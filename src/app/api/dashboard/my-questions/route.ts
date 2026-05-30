import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

function getUserIdFromToken(req: NextRequest): string | null {
  const token = req.cookies.get('payload-token')?.value
  if (!token) return null
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const padded = parts[1].padEnd(parts[1].length + (4 - parts[1].length % 4) % 4, '=')
    const data = JSON.parse(Buffer.from(padded, 'base64').toString('utf8'))
    if (!data?.id) return null
    if (data.exp && Math.floor(Date.now() / 1000) > data.exp) return null
    return String(data.id)
  } catch { return null }
}

export async function GET(req: NextRequest) {
  const userId = getUserIdFromToken(req)
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const payload = await getPayloadClient()
    if (!payload) return NextResponse.json([])

    const res = await payload.find({
      collection: 'questions',
      where: { askedBy: { equals: userId } },
      limit: 50,
      sort: '-createdAt',
      depth: 1,
    })

    return NextResponse.json(res.docs)
  } catch (err) {
    console.error('my-questions error:', err)
    return NextResponse.json([])
  }
}
