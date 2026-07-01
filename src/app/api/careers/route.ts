import { NextRequest, NextResponse } from 'next/server'
import { sendCareersEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const { fullName, email, phone, position, experience, message } = await req.json()

    if (!fullName || !email || !phone || !position) {
      return NextResponse.json({ error: 'اطلاعات ناقص است' }, { status: 400 })
    }

    await sendCareersEmail({ fullName, email, phone, position, experience, message })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Careers form error:', err)
    const detail = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: 'ارسال درخواست با خطا مواجه شد', detail }, { status: 500 })
  }
}
