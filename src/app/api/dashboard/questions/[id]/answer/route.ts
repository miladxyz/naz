import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

async function getAuthUser(req: NextRequest) {
  const token = req.cookies.get('payload-token')?.value
  if (!token) return null
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const data = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'))
    if (!data?.id || (data.exp && Date.now() / 1000 > data.exp)) return null
    const payload = await getPayloadClient()
    return payload.findByID({ collection: 'users', id: data.id })
  } catch { return null }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!['founder', 'lawyer'].includes((user as any).role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const { id } = await params
    const { answer } = await req.json()
    if (!answer?.trim()) {
      return NextResponse.json({ error: 'پاسخ نمی‌تواند خالی باشد' }, { status: 400 })
    }
    const payload = await getPayloadClient()
    await payload.update({
      collection: 'questions',
      id,
      data: {
        answer,
        status: 'answered',
        answeredBy: user.id,
        answeredAt: new Date().toISOString(),
      },
    })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'خطا در ذخیره پاسخ' }, { status: 500 })
  }
}
