import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

function decodeToken(token: string): { id: string } | null {
  try {
    const parts  = token.split('.')
    if (parts.length !== 3) return null
    const padded = parts[1].padEnd(parts[1].length + (4 - parts[1].length % 4) % 4, '=')
    const decoded = JSON.parse(Buffer.from(padded, 'base64').toString('utf8'))
    if (!decoded?.id) return null
    if (decoded.exp && Math.floor(Date.now() / 1000) > decoded.exp) return null
    return decoded
  } catch {
    return null
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('payload-token')?.value
    if (!token) return NextResponse.json({ error: 'احراز هویت نشده' }, { status: 401 })

    const decoded = decodeToken(token)
    if (!decoded) return NextResponse.json({ error: 'توکن نامعتبر' }, { status: 401 })

    const { firstName, lastName } = await req.json()

    if (!firstName?.trim() || !lastName?.trim()) {
      return NextResponse.json({ error: 'نام و نام خانوادگی را وارد کنید' }, { status: 400 })
    }

    const payload = await getPayloadClient()

    await payload.update({
      collection:     'users',
      id:             decoded.id,
      data:           { name: `${firstName.trim()} ${lastName.trim()}` },
      overrideAccess: true,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[/api/auth/update-profile]', err)
    return NextResponse.json({ error: 'خطا در ذخیره اطلاعات' }, { status: 500 })
  }
}
