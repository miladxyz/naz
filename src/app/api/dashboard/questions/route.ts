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

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const staffRoles = ['founder', 'lawyer', 'it_manager', 'financial_manager']
  if (!staffRoles.includes((user as any).role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const payload = await getPayloadClient()
    const where: any = {}
    if ((user as any).role === 'lawyer' && (user as any).categories?.length) {
      where.category = { in: (user as any).categories }
    }
    const res = await payload.find({
      collection: 'questions',
      where,
      limit: 50,
      sort: '-createdAt',
      depth: 1,
    })
    return NextResponse.json(res.docs)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
