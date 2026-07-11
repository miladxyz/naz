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

// PATCH /api/dashboard/comments/[id]  body: { status: 'approved' | 'rejected' }
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const { status } = await req.json()

  if (!['approved', 'rejected'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  try {
    const payload = await getPayloadClient()
    await payload.update({ collection: 'comments', id, data: { status } })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Comment update error:', err)
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}
