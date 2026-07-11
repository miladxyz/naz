import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { cookies } from 'next/headers'

async function getUser() {
  try {
    const payload = await getPayloadClient()
    const cookieStore = await cookies()
    const token = cookieStore.get('payload-token')?.value
    if (!token) return null
    const { user } = await payload.auth({ headers: new Headers({ Authorization: `JWT ${token}` }) })
    return user
  } catch { return null }
}

// GET /api/dashboard/comments — returns all non-rejected comments for staff
export async function GET() {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const payload = await getPayloadClient()
    const res = await payload.find({
      collection: 'comments',
      where: { status: { not_equals: 'rejected' } },
      sort: '-createdAt',
      limit: 100,
      depth: 1,
    })
    return NextResponse.json(res.docs)
  } catch (err) {
    console.error('Dashboard comments GET error:', err)
    return NextResponse.json([], { status: 500 })
  }
}
