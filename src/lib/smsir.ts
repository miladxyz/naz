/**
 * SMS.ir OTP sender
 * Docs: https://www.sms.ir/developer/send-verify
 *
 * Uses the "Verify" (کد تأیید) endpoint — no need for a dedicated line.
 * Set these env vars:
 *   SMSIR_API_KEY   — your API key from panel.sms.ir
 *   SMSIR_TEMPLATE_ID — the numeric ID of your OTP pattern in sms.ir panel
 */

const SMSIR_API = 'https://api.sms.ir/v1/send/verify'

export async function sendOtpSmsir(phone: string, code: string): Promise<void> {
  const apiKey      = process.env.SMSIR_API_KEY
  const templateId  = process.env.SMSIR_TEMPLATE_ID

  if (!apiKey || !templateId) {
    throw new Error('SMSIR_API_KEY یا SMSIR_TEMPLATE_ID تنظیم نشده است')
  }

  // Normalise Iranian numbers: strip leading 0 / +98, keep digits
  const normalised = normalisePhone(phone)

  const body = {
    mobile:     normalised,
    templateId: Number(templateId),
    parameters: [
      { name: 'OTP', value: code },
    ],
  }

  const res = await fetch(SMSIR_API, {
    method:  'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY':    apiKey,
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`SMS.ir error ${res.status}: ${text}`)
  }

  const data = await res.json()
  // sms.ir returns { status: 1, ... } on success
  if (data.status !== 1) {
    throw new Error(`SMS.ir rejected the request: ${JSON.stringify(data)}`)
  }
}

/** Strips country code / leading zero; returns digits only (e.g. 09121234567 → 9121234567) */
export function normalisePhone(raw: string): string {
  let digits = raw.replace(/\D/g, '')
  if (digits.startsWith('98'))  digits = digits.slice(2)
  if (digits.startsWith('0'))   digits = digits.slice(1)
  return digits
}

/** Validates an Iranian mobile number (09xx…) */
export function isValidIranPhone(raw: string): boolean {
  const digits = raw.replace(/\D/g, '')
  // Accept 09xxxxxxxxx (11 digits) or 9xxxxxxxxx (10 digits)
  return /^(0?9[0-9]{9})$/.test(digits)
}

/** Generate a 6-digit OTP code */
export function generateOtp(): string {
  return String(Math.floor(100000 + Math.random() * 900000))
}

/**
 * Send SMS when founder replies to a comment.
 * Create a pattern in sms.ir panel with params: NAME, REPLY
 * Set env var: SMSIR_REPLY_TEMPLATE_ID
 */
export async function sendCommentReplySms(phone: string, commenterName: string, replyBody: string): Promise<void> {
  const apiKey     = process.env.SMSIR_API_KEY
  const templateId = process.env.SMSIR_REPLY_TEMPLATE_ID

  if (!apiKey || !templateId) {
    console.warn('SMSIR_REPLY_TEMPLATE_ID not set — skipping reply SMS')
    return
  }

  const normalised = normalisePhone(phone)
  const preview    = replyBody.length > 100 ? replyBody.slice(0, 97) + '...' : replyBody

  const res = await fetch(SMSIR_API, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json', 'X-API-KEY': apiKey },
    body: JSON.stringify({
      mobile:     normalised,
      templateId: Number(templateId),
      parameters: [
        { name: 'NAME',  value: commenterName },
        { name: 'REPLY', value: preview },
      ],
    }),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`SMS.ir reply error ${res.status}: ${text}`)
  }

  const data = await res.json()
  if (data.status !== 1) {
    throw new Error(`SMS.ir rejected reply SMS: ${JSON.stringify(data)}`)
  }
}
