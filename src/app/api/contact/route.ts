import { NextRequest, NextResponse } from 'next/server'
import { sendContactEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, subject, message } = await req.json()

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'نام، ایمیل و پیام الزامی است' }, { status: 400 })
    }

    await sendContactEmail({ name, email, phone, subject, message })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Contact form error:', err)
    const detail = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: 'ارسال پیام با خطا مواجه شد', detail }, { status: 500 })
  }
}
