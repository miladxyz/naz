import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { isValidIranPhone, normalisePhone } from '@/lib/smsir'

const MAX_ATTEMPTS = 5

export async function POST(req: NextRequest) {
  try {
    const { phone, code, name } = await req.json()

    if (!phone || !isValidIranPhone(phone)) {
      return NextResponse.json({ error: 'شماره موبایل معتبر نیست' }, { status: 400 })
    }
    if (!code || String(code).length !== 6) {
      return NextResponse.json({ error: 'کد تأیید ۶ رقمی وارد کنید' }, { status: 400 })
    }

    const normalisedPhone = normalisePhone(phone)
    const payload = await getPayloadClient()

    // ── 1. Find OTP record ──────────────────────────────────────────────
    const otpResult = await payload.find({
      collection: 'otp-codes',
      where: { phone: { equals: normalisedPhone } },
      limit: 1,
      overrideAccess: true,
    })

    if (otpResult.docs.length === 0) {
      return NextResponse.json({ error: 'کد تأیید یافت نشد. دوباره درخواست دهید' }, { status: 400 })
    }

    const otpDoc = otpResult.docs[0] as any

    // ── 2. Check expiry ─────────────────────────────────────────────────
    if (new Date(otpDoc.expiresAt) < new Date()) {
      await payload.delete({ collection: 'otp-codes', id: otpDoc.id, overrideAccess: true })
      return NextResponse.json({ error: 'کد تأیید منقضی شده است. دوباره درخواست دهید' }, { status: 400 })
    }

    // ── 3. Check attempts ───────────────────────────────────────────────
    const attempts = (otpDoc.attempts || 0) + 1
    if (attempts > MAX_ATTEMPTS) {
      await payload.delete({ collection: 'otp-codes', id: otpDoc.id, overrideAccess: true })
      return NextResponse.json({ error: 'تعداد تلاش‌های مجاز تمام شد. دوباره درخواست دهید' }, { status: 429 })
    }

    // ── 4. Verify code ──────────────────────────────────────────────────
    if (otpDoc.code !== String(code)) {
      await payload.update({
        collection: 'otp-codes',
        id: otpDoc.id,
        data: { attempts },
        overrideAccess: true,
      })
      const remaining = MAX_ATTEMPTS - attempts
      return NextResponse.json(
        { error: `کد تأیید اشتباه است (${remaining} تلاش باقی‌مانده)` },
        { status: 400 },
      )
    }

    // ── 5. Delete used OTP ──────────────────────────────────────────────
    await payload.delete({ collection: 'otp-codes', id: otpDoc.id, overrideAccess: true })

    // ── 6. Find or create user ──────────────────────────────────────────
    const userResult = await payload.find({
      collection: 'users',
      where: { phone: { equals: normalisedPhone } },
      limit: 1,
      overrideAccess: true,
    })

    let userData: any

    if (userResult.docs.length > 0) {
      userData = userResult.docs[0]
    } else {
      const displayName = name?.trim() || `کاربر ${normalisedPhone.slice(-4)}`
      userData = await payload.create({
        collection: 'users',
        data: {
          name:     displayName,
          phone:    normalisedPhone,
          email:    `ph_${normalisedPhone}@naz.local`,
          password: crypto.randomUUID(),
          role:     'client',
        },
        overrideAccess: true,
      })
    }

    // ── 7. Generate JWT via temp-password swap ──────────────────────────
    // Payload doesn't expose a public "sign token for user" helper,
    // so we temporarily set a known password, call payload.login(), then randomise it again.
    const tempPass = crypto.randomUUID()

    await payload.update({
      collection: 'users',
      id: userData.id,
      data: { password: tempPass },
      overrideAccess: true,
    })

    let loginResult: any
    try {
      loginResult = await payload.login({
        collection: 'users',
        data: {
          email:    userData.email,
          password: tempPass,
        },
      })
    } catch (loginErr) {
      console.error('payload.login error:', loginErr)
      // Scramble password even on failure so the temp one can't be used
      await payload.update({
        collection: 'users',
        id: userData.id,
        data: { password: crypto.randomUUID() },
        overrideAccess: true,
      })
      return NextResponse.json({ error: 'خطا در ورود به حساب. دوباره تلاش کنید' }, { status: 500 })
    }

    // Scramble password immediately after login
    await payload.update({
      collection: 'users',
      id: userData.id,
      data: { password: crypto.randomUUID() },
      overrideAccess: true,
    })

    const token = loginResult?.token
    if (!token) {
      console.error('No token returned from payload.login. loginResult:', loginResult)
      return NextResponse.json({ error: 'خطا در صدور توکن. دوباره تلاش کنید' }, { status: 500 })
    }

    // ── 8. Return response with cookie ─────────────────────────────────
    const isNewUser = userResult.docs.length === 0

    const response = NextResponse.json({
      success: true,
      isNewUser,
      user: {
        id:    userData.id,
        name:  userData.name,
        email: userData.email,
        phone: userData.phone,
        role:  userData.role,
      },
    })

    response.cookies.set('payload-token', token, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge:   60 * 60 * 24 * 7,
      path:     '/',
    })

    return response

  } catch (error: any) {
    console.error('verify-otp unhandled error:', error)
    return NextResponse.json({ error: 'خطا در تأیید کد' }, { status: 500 })
  }
}
