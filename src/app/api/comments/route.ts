import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

// GET /api/comments?postId=xxx  — returns approved comments for a post
export async function GET(req: NextRequest) {
  const postId = req.nextUrl.searchParams.get('postId')
  if (!postId) return NextResponse.json({ docs: [] })

  try {
    const payload = await getPayloadClient()
    const res = await payload.find({
      collection: 'comments',
      where: {
        post:   { equals: postId },
        status: { equals: 'approved' },
      },
      sort: 'createdAt',
      limit: 100,
    })
    return NextResponse.json({ docs: res.docs })
  } catch (err) {
    console.error('Comments GET error:', err)
    return NextResponse.json({ docs: [] })
  }
}

// POST /api/comments  — submit a new comment (pending by default)
export async function POST(req: NextRequest) {
  try {
    const { postId, authorName, authorEmail, body } = await req.json()

    if (!postId || !authorName || !body) {
      return NextResponse.json({ error: 'اطلاعات ناقص است' }, { status: 400 })
    }

    const payload = await getPayloadClient()
    await payload.create({
      collection: 'comments',
      data: {
        post:        postId,
        authorName:  authorName.trim(),
        authorEmail: authorEmail?.trim() || undefined,
        body:        body.trim(),
        status:      'pending',
      },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Comments POST error:', err)
    const detail = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: 'خطا در ثبت نظر', detail }, { status: 500 })
  }
}
