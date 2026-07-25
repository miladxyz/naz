import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

// GET /api/comments?postId=xxx
export async function GET(req: NextRequest) {
  const postId = req.nextUrl.searchParams.get('postId')
  if (!postId) return NextResponse.json({ docs: [] })

  try {
    const payload = await getPayloadClient()

    // Fetch top-level comments (no parent)
    const res = await payload.find({
      collection: 'comments',
      where: {
        post:          { equals: postId },
        status:        { equals: 'approved' },
        parentComment: { exists: false },
      },
      sort: 'createdAt',
      limit: 100,
    })

    // Fetch all replies for this post
    const repliesRes = await payload.find({
      collection: 'comments',
      where: {
        post:          { equals: postId },
        status:        { equals: 'approved' },
        parentComment: { exists: true },
      },
      sort: 'createdAt',
      limit: 500,
      depth: 0,
    })

    return NextResponse.json({ docs: res.docs, replies: repliesRes.docs })
  } catch (err) {
    console.error('Comments GET error:', err)
    return NextResponse.json({ docs: [], replies: [] })
  }
}

// POST /api/comments
export async function POST(req: NextRequest) {
  try {
    const { postId, authorName, authorPhone, body, parentCommentId } = await req.json()

    if (!postId || !authorName || !authorPhone || !body) {
      return NextResponse.json({ error: 'اطلاعات ناقص است' }, { status: 400 })
    }

    const payload = await getPayloadClient()
    await payload.create({
      collection: 'comments',
      data: {
        post:          postId,
        authorName:    authorName.trim(),
        authorPhone:   authorPhone.trim(),
        body:          body.trim(),
        status:        'pending',
        ...(parentCommentId ? { parentComment: parentCommentId } : {}),
      },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Comments POST error:', err)
    const detail = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: 'خطا در ثبت نظر', detail }, { status: 500 })
  }
}
