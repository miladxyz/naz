import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { cookies } from 'next/headers'
import { sendCommentReplySms } from '@/lib/smsir'

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

    // Fetch the comment before updating so we can read its data
    const comment = await payload.findByID({ collection: 'comments', id, depth: 1 }) as any

    await payload.update({ collection: 'comments', id, data: { status } })

    // If this is a reply being approved, SMS the original commenter
    if (status === 'approved' && comment?.parentComment) {
      try {
        const parentId = typeof comment.parentComment === 'string'
          ? comment.parentComment
          : comment.parentComment?.id

        if (parentId) {
          const parent = await payload.findByID({ collection: 'comments', id: parentId }) as any
          if (parent?.authorPhone) {
            await sendCommentReplySms(parent.authorPhone, parent.authorName, comment.body)
          }
        }
      } catch (smsErr) {
        // SMS failure should not block the approval
        console.error('Reply SMS failed:', smsErr)
      }
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Comment update error:', err)
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}
