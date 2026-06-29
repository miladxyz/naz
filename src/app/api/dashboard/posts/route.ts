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

/* GET — list posts for current user */
export async function GET(req: NextRequest) {
  const user = await getAuthUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const payload = await getPayloadClient()
    if (!payload) return NextResponse.json([])

    const where: any = {}
    if ((user as any).role === 'lawyer') where.author = { equals: user.id }

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

/* POST — create new post with rich content + cover image */
export async function POST(req: NextRequest) {
  const user = await getAuthUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!['founder', 'lawyer'].includes((user as any).role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = await req.json()
    const {
      title, excerpt, content, category,
      publishNow, coverImageBase64,
      readingTime, tags,
    } = body

    if (!title || !content) {
      return NextResponse.json({ error: 'عنوان و محتوا الزامی است' }, { status: 400 })
    }

    const payload = await getPayloadClient()
    if (!payload) return NextResponse.json({ error: 'DB unavailable' }, { status: 503 })

    // Generate slug from title
    const slug = title
      .replace(/[\s]+/g, '-')
      .replace(/[^\u0600-\u06FFa-zA-Z0-9-]/g, '')
      + '-' + Date.now()

    // Convert HTML content to Lexical JSON for Payload
    // Store as a single paragraph with raw HTML preserved in text node
    // (Payload will display it via the blog [slug] page which extracts text)
    const richContent = {
      root: {
        type: 'root', format: '', indent: 0, version: 1, direction: 'rtl',
        children: [{
          type: 'paragraph', format: '', indent: 0, version: 1, direction: 'rtl',
          textFormat: 0, textStyle: '',
          children: [{
            type: 'text',
            // Store the raw HTML — blog page will render it with dangerouslySetInnerHTML
            text: content,
            format: 0, version: 1, mode: 'normal', style: '', detail: 0,
          }],
        }],
      },
    }

    // Handle cover image (base64 → upload to media collection)
    let coverImageId: string | undefined
    if (coverImageBase64 && coverImageBase64.startsWith('data:image')) {
      try {
        // Extract mime type and base64 data
        const matches = coverImageBase64.match(/^data:(.+);base64,(.+)$/)
        if (matches) {
          const mimeType = matches[1]
          const base64Data = matches[2]
          const buffer = Buffer.from(base64Data, 'base64')
          const ext = mimeType.split('/')[1] || 'jpg'
          const filename = `cover-${Date.now()}.${ext}`

          // Create media entry with file data
          const media = await payload.create({
            collection: 'media',
            data: { alt: title },
            file: {
              data: buffer,
              mimetype: mimeType,
              name: filename,
              size: buffer.length,
            },
          })
          coverImageId = String(media.id)
        }
      } catch (e) {
        console.warn('Cover image upload failed:', e)
      }
    }

    // Parse tags
    const parsedTags = tags
      ? tags.split(/[,،]/).map((t: string) => t.trim()).filter(Boolean).map((t: string) => ({ tag: t }))
      : []

    // Auto-calculate reading time from content if not provided
    const wordCount = content.replace(/<[^>]+>/g, '').split(/\s+/).length
    const calcReadingTime = readingTime ? parseInt(readingTime) : Math.max(1, Math.ceil(wordCount / 200))

    const post = await payload.create({
      collection: 'posts',
      data: {
        title,
        slug,
        excerpt: excerpt || '',
        content: richContent,
        category: category || 'others',
        author: user.id,
        _status: publishNow ? 'published' : 'draft',
        publishedAt: publishNow ? new Date().toISOString() : undefined,
        readingTime: calcReadingTime,
        tags: parsedTags,
        ...(coverImageId ? { coverImage: coverImageId } : {}),
      },
    })

    return NextResponse.json({ success: true, id: post.id, slug })
  } catch (err) {
    console.error('Post creation error:', err)
    return NextResponse.json({ error: 'خطا در ایجاد مقاله' }, { status: 500 })
  }
}
