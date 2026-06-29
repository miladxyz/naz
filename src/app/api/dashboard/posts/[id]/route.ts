import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

async function getAuthUser(req: NextRequest) {
  const token = req.cookies.get('payload-token')?.value
  if (!token) return null
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const padded = parts[1].padEnd(parts[1].length + (4 - parts[1].length % 4) % 4, '=')
    const data = JSON.parse(Buffer.from(padded, 'base64').toString('utf8'))
    if (!data?.id || (data.exp && Math.floor(Date.now() / 1000) > data.exp)) return null
    const payload = await getPayloadClient()
    if (!payload) return null
    return payload.findByID({ collection: 'users', id: data.id })
  } catch { return null }
}

/* GET — fetch single post for editing */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  try {
    const payload = await getPayloadClient()
    if (!payload) return NextResponse.json({ error: 'DB unavailable' }, { status: 503 })

    const post = await payload.findByID({
      collection: 'posts',
      id,
      draft: true,
    })

    // Extract HTML text stored inside Lexical root
    const rawContent = (post.content as any)?.root?.children?.[0]?.children?.[0]?.text ?? ''

    return NextResponse.json({
      id: post.id,
      title: post.title,
      excerpt: post.excerpt ?? '',
      content: rawContent,
      category: post.category ?? '',
      readingTime: post.readingTime ?? '',
      _status: post._status,
      coverImage: post.coverImage ?? null,
    })
  } catch {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 })
  }
}

/* PATCH — update post */
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!['founder', 'lawyer'].includes((user as any).role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params
  try {
    const body = await req.json()
    const { title, excerpt, content, category, readingTime, publishNow, coverImageBase64 } = body

    if (!title || !content) {
      return NextResponse.json({ error: 'عنوان و محتوا الزامی است' }, { status: 400 })
    }

    const payload = await getPayloadClient()
    if (!payload) return NextResponse.json({ error: 'DB unavailable' }, { status: 503 })

    const richContent = {
      root: {
        type: 'root', format: '', indent: 0, version: 1, direction: 'rtl',
        children: [{
          type: 'paragraph', format: '', indent: 0, version: 1, direction: 'rtl',
          textFormat: 0, textStyle: '',
          children: [{
            type: 'text',
            text: content,
            format: 0, version: 1, mode: 'normal', style: '', detail: 0,
          }],
        }],
      },
    }

    // Handle new cover image if provided
    let coverImageId: string | undefined
    if (coverImageBase64 && coverImageBase64.startsWith('data:image')) {
      try {
        const matches = coverImageBase64.match(/^data:(.+);base64,(.+)$/)
        if (matches) {
          const mimeType = matches[1]
          const buffer = Buffer.from(matches[2], 'base64')
          const ext = mimeType.split('/')[1] || 'jpg'
          const media = await payload.create({
            collection: 'media',
            data: { alt: title },
            file: { data: buffer, mimetype: mimeType, name: `cover-${Date.now()}.${ext}`, size: buffer.length },
          })
          coverImageId = String(media.id)
        }
      } catch (e) {
        console.warn('Cover image upload failed:', e)
      }
    }

    const wordCount = content.replace(/<[^>]+>/g, '').split(/\s+/).length
    const calcReadingTime = readingTime ? parseInt(readingTime) : Math.max(1, Math.ceil(wordCount / 200))

    const updated = await payload.update({
      collection: 'posts',
      id,
      data: {
        title,
        excerpt: excerpt || '',
        content: richContent,
        category: category || 'general',
        readingTime: calcReadingTime,
        _status: publishNow ? 'published' : 'draft',
        ...(publishNow ? { publishedAt: new Date().toISOString() } : {}),
        ...(coverImageId ? { coverImage: coverImageId } : {}),
      },
    })

    return NextResponse.json({ success: true, id: updated.id })
  } catch (err) {
    console.error('Post update error:', err)
    return NextResponse.json({ error: 'خطا در ویرایش مقاله' }, { status: 500 })
  }
}
