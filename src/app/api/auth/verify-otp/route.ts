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
    const payload         = await getPayloadClient()

    // Find OTP record
    const otpResult = await payload.find({
      collection:     'otp-codes',
      where:          { phone: { equals: normalisedPhone } },
      limit:          1,
      overrideAccess: true,
    })

    if (otpResult.docs.length === 0) {
      return NextResponse.json({ error: 'کد تأیید یافت نشد. دوباره درخواست دهید' }, { status: 400 })
    }

    const otpDoc = otpResult.docs[0] as any

    // Check expiry
    if (new Date(otpDoc.expiresAt) < new Date()) {
      await payload.delete({ collection: 'otp-codes', id: otpDoc.id, overrideAccess: true })
      return NextResponse.json({ error: 'کد تأیید منقضی شده است. دوباره درخواست دهید' }, { status: 400 })
    }

    // Increment attempt counter
    const attempts = (otpDoc.attempts || 0) + 1
    if (attempts > MAX_ATTEMPTS) {
      await payload.delete({ collection: 'otp-codes', id: otpDoc.id, overrideAccess: true })
      return NextResponse.json({ error: 'تعداد تلاش‌های مجاز تمام شد. دوباره درخواست دهید' }, { status: 429 })
    }

    if (otpDoc.code !== String(code)) {
      await payload.update({
        collection:     'otp-codes',
        id:             otpDoc.id,
        data:           { attempts },
        overrideAccess: true,
      })
      const remaining = MAX_ATTEMPTS - attempts
      return NextResponse.json(
        { error: `کد تأیید اشتباه است (${remaining} تلاش باقی‌مانده)` },
        { status: 400 },
      )
    }

    // Valid — delete the OTP
    await payload.delete({ collection: 'otp-codes', id: otpDoc.id, overrideAccess: true })

    // Find or create user
    const userResult = await payload.find({
      collection:     'users',
      where:          { phone: { equals: normalisedPhone } },
      limit:          1,
      overrideAccess: true,
    })

    let userId: string
    let userData: any

    if (userResult.docs.length > 0) {
      // Existing user — login
      userData = userResult.docs[0]
      userId   = userData.id
    } else {
      // New user — register
      // name is required only on first registration
      const displayName = name?.trim() || `کاربر ${normalisedPhone.slice(-4)}`
      const newUser = await payload.create({
        collection: 'users',
        data: {
          name:     displayName,
          phone:    normalisedPhone,
          // Payload auth requires email+password; we use phone as dummy email
          email:    `${normalisedPhone}@sms.local`,
          password: crypto.randomUUID(), // random — user will never use it
          role:     'client',
        },
        overrideAccess: true,
      })
      userData = newUser
      userId   = newUser.id
    }

    // Issue a Payload JWT token by logging in with the internal credentials
    // We use Payload's REST login endpoint internally
    const loginRes = await payload.login({
      collection: 'users',
      data: {
        email:    userData.email || `${normalisedPhone}@sms.local`,
        password: '__never__', // won't work — use overrideAccess token instead
      },
    }).catch(() => null)

    // Fallback: generate token via local API (Payload's generatePayloadCookie helper)
    // Since we can't call payload.login without the password, we craft the token directly
    // by using Payload's internal token generation.
    const { token } = await (payload as any).generatePayloadCookie({
      collectionConfig: payload.collections['users'].config,
      user:             userData,
    }).catch(async () => {
      // Older Payload versions: use the REST route directly
      const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
      const r = await fetch(`${serverUrl}/api/users/login`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        // This will fail without password — handled in the catch below
        body:    JSON.stringify({ email: userData.email, password: '__never__' }),
      })
      if (!r.ok) throw new Error('token generation failed')
      return r.json()
    }).catch(() => ({ token: null }))

    // If token generation failed, use a simpler approach:
    // temporarily set a known password, login, then reset it
    let finalToken = token
    if (!finalToken) {
      const tempPass = crypto.randomUUID()
      await payload.update({
        collection:     'users',
        id:             userId,
        data:           { password: tempPass },
        overrideAccess: true,
      })
      const loginResult = await payload.login({
        collection: 'users',
        data:       { email: userData.email || `${normalisedPhone}@sms.local`, password: tempPass },
      })
      finalToken = loginResult.token
      // Reset to another random password so it can't be guessed
      await payload.update({
        collection:     'users',
        id:             userId,
        data:           { password: crypto.randomUUID() },
        overrideAccess: true,
      })
    }

    const response = NextResponse.json({
      success: true,
      user: {
        id:    userData.id,
        name:  userData.name,
        email: userData.email,
        phone: userData.phone,
        role:  userData.role,
      },
    })

    if (finalToken) {
      response.cookies.set('payload-token', finalToken, {
        httpOnly: true,
        secure:   process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge:   60 * 60 * 24 * 7,
        path:     '/',
      })
    }

    return response
  } catch (error: any) {
    console.error('verify-otp error:', error)
    return NextResponse.json({ error: 'خطا در تأیید کد' }, { status: 500 })
  }
}
