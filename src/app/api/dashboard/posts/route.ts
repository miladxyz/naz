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

  try {
    const payload = await getPayloadClient()
    const where: any = {}
    if ((user as any).role === 'lawyer') {
      where.author = { equals: user.id }
    }
    const res = await payload.find({
      collection: 'posts',
      where,
      limit: 50,
      sort: '-createdAt',
    })
    return NextResponse.json(res.docs)
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!['founder', 'lawyer'].includes((user as any).role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const { title, excerpt, content, category, publishNow } = await req.json()
    if (!title || !content) {
      return NextResponse.json({ error: 'عنوان و محتوا الزامی است' }, { status: 400 })
    }

    const payload = await getPayloadClient()
    const slug = title.replace(/\s+/g, '-').replace(/[^\u0600-\u06FFa-zA-Z0-9-]/g, '') + '-' + Date.now()

    // Build a minimal Lexical JSON node from plain text
    const richTextContent = {
      root: {
        type: 'root',
        format: '',
        indent: 0,
        version: 1,
        direction: 'rtl',
        children: content.split('\n\n').filter(Boolean).map((para: string) => ({
          type: 'paragraph',
          format: '',
          indent: 0,
          version: 1,
          direction: 'rtl',
          children: [{ type: 'text', text: para, format: 0, version: 1, mode: 'normal', style: '', detail: 0 }],
          textFormat: 0,
          textStyle: '',
        })),
      },
    }

    const post = await payload.create({
      collection: 'posts',
      data: {
        title,
        slug,
        excerpt: excerpt || '',
        content: richTextContent,
        category: category || 'general',
        author: user.id,
        _status: publishNow ? 'published' : 'draft',
        publishedAt: publishNow ? new Date().toISOString() : undefined,
        readingTime: Math.max(1, Math.ceil(content.split(/\s+/).length / 200)),
      },
    })

    return NextResponse.json({ success: true, id: post.id })
  } catch (err) {
    console.error('Post creation error:', err)
    return NextResponse.json({ error: 'خطا در ایجاد مقاله' }, { status: 500 })
  }
}
