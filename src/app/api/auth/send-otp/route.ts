import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { sendOtpSmsir, generateOtp, isValidIranPhone, normalisePhone } from '@/lib/smsir'

const OTP_TTL_SECONDS   = 120   // 2 minutes
const RATE_LIMIT_SECONDS = 60   // minimum gap between sends

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json()

    if (!phone || !isValidIranPhone(phone)) {
      return NextResponse.json(
        { error: 'شماره موبایل معتبر نیست (مثال: 09121234567)' },
        { status: 400 },
      )
    }

    const normalisedPhone = normalisePhone(phone)
    const payload = await getPayloadClient()

    // Rate-limit: check if a recent OTP was already sent for this number
    const existing = await payload.find({
      collection: 'otp-codes',
      where: { phone: { equals: normalisedPhone } },
      limit: 1,
      overrideAccess: true,
    })

    if (existing.docs.length > 0) {
      const doc        = existing.docs[0] as any
      const expiresAt  = new Date(doc.expiresAt).getTime()
      const createdGap = expiresAt - Date.now() - (OTP_TTL_SECONDS - RATE_LIMIT_SECONDS) * 1000
      if (createdGap > 0) {
        const waitSecs = Math.ceil(createdGap / 1000)
        return NextResponse.json(
          { error: `لطفاً ${waitSecs} ثانیه صبر کنید` },
          { status: 429 },
        )
      }
    }

    const code      = generateOtp()
    const expiresAt = new Date(Date.now() + OTP_TTL_SECONDS * 1000)

    // Store OTP (beforeChange hook deletes old ones for this phone)
    await payload.create({
      collection: 'otp-codes',
      data:       { phone: normalisedPhone, code, expiresAt: expiresAt.toISOString() },
      overrideAccess: true,
    })

    // Send SMS
    await sendOtpSmsir(normalisedPhone, code)

    return NextResponse.json({ success: true, expiresInSeconds: OTP_TTL_SECONDS })
  } catch (error: any) {
    console.error('send-otp error:', error)
    return NextResponse.json({ error: 'خطا در ارسال پیامک' }, { status: 500 })
  }
}
