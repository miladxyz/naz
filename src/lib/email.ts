/**
 * Contact form email sender (Resend)
 * Docs: https://resend.com/docs/send-with-nextjs
 *
 * Set these env vars:
 *   RESEND_API_KEY     — API key from resend.com/api-keys
 *   CONTACT_FROM_EMAIL — verified sender address, e.g. "Alireza Nazari <contact@alirezanazari.com>"
 *                        (must be on a domain you've verified in Resend)
 *   CONTACT_TO_EMAIL   — where contact form submissions are delivered (defaults below)
 */

const RESEND_API = 'https://api.resend.com/emails'

export interface ContactFormPayload {
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
}

export async function sendContactEmail(payload: ContactFormPayload): Promise<void> {
  const apiKey   = process.env.RESEND_API_KEY
  const from     = process.env.CONTACT_FROM_EMAIL || 'onboarding@resend.dev'
  const to       = process.env.CONTACT_TO_EMAIL || 'Alireza.nazari38@proton.me'

  if (!apiKey) {
    throw new Error('RESEND_API_KEY تنظیم نشده است')
  }

  const { name, email, phone, subject, message } = payload

  const html = `
    <div dir="rtl" style="font-family:Tahoma,Arial,sans-serif;line-height:1.8">
      <h2>پیام جدید از فرم تماس سایت</h2>
      <p><strong>نام:</strong> ${escapeHtml(name)}</p>
      <p><strong>ایمیل:</strong> ${escapeHtml(email)}</p>
      ${phone ? `<p><strong>تلفن:</strong> ${escapeHtml(phone)}</p>` : ''}
      ${subject ? `<p><strong>موضوع:</strong> ${escapeHtml(subject)}</p>` : ''}
      <p><strong>پیام:</strong></p>
      <p>${escapeHtml(message).replace(/\n/g, '<br/>')}</p>
    </div>
  `

  const res = await fetch(RESEND_API, {
    method:  'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from,
      to,
      reply_to: email,
      subject: `فرم تماس سایت: ${subject || 'پیام جدید'}`,
      html,
    }),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Resend error ${res.status}: ${text}`)
  }
}

export interface CareersFormPayload {
  fullName: string
  email: string
  phone: string
  position: string
  experience?: string
  message?: string
}

export async function sendCareersEmail(payload: CareersFormPayload): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  const from   = process.env.CONTACT_FROM_EMAIL || 'onboarding@resend.dev'
  const to     = process.env.CONTACT_TO_EMAIL   || 'Alireza.nazari38@proton.me'

  if (!apiKey) throw new Error('RESEND_API_KEY تنظیم نشده است')

  const { fullName, email, phone, position, experience, message } = payload

  const experienceMap: Record<string, string> = {
    student: 'دانشجو / بدون سابقه',
    '1-2':   '۱ تا ۲ سال',
    '3-5':   '۳ تا ۵ سال',
    '5+':    'بیش از ۵ سال',
  }

  const html = `
    <div dir="rtl" style="font-family:Tahoma,Arial,sans-serif;line-height:1.8">
      <h2>درخواست همکاری جدید از سایت</h2>
      <p><strong>نام:</strong> ${escapeHtml(fullName)}</p>
      <p><strong>ایمیل:</strong> ${escapeHtml(email)}</p>
      <p><strong>تلفن:</strong> ${escapeHtml(phone)}</p>
      <p><strong>موقعیت درخواستی:</strong> ${escapeHtml(position)}</p>
      ${experience ? `<p><strong>سابقه کاری:</strong> ${escapeHtml(experienceMap[experience] ?? experience)}</p>` : ''}
      ${message ? `<p><strong>معرفی / انگیزه:</strong></p><p>${escapeHtml(message).replace(/\n/g, '<br/>')}</p>` : ''}
    </div>
  `

  const res = await fetch(RESEND_API, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({
      from,
      to,
      reply_to: email,
      subject:  `درخواست همکاری: ${position} — ${fullName}`,
      html,
    }),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Resend error ${res.status}: ${text}`)
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
