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

/**
 * Converts Payload Lexical JSON → HTML string for Tiptap.
 *
 * Handles two cases:
 *  1. Dashboard-created posts: HTML is stored as a plain text string inside
 *     the first text node (children[0].children[0].text starts with "<").
 *  2. Payload-admin-created posts: real Lexical node tree that must be walked.
 */
function lexicalToHtml(content: any): string {
  if (!content?.root) return ''

  // Case 1 — HTML stored as raw text in first node
  const firstText = content?.root?.children?.[0]?.children?.[0]?.text ?? ''
  if (firstText.trimStart().startsWith('<')) return firstText

  // Case 2 — Walk Lexical node tree and convert to HTML
  function nodeToHtml(node: any): string {
    if (!node) return ''

    // Text node
    if (node.type === 'text') {
      let t = (node.text ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
      if (node.format & 1)  t = `<strong>${t}</strong>`   // bold
      if (node.format & 2)  t = `<em>${t}</em>`           // italic
      if (node.format & 8)  t = `<u>${t}</u>`             // underline
      if (node.format & 4)  t = `<s>${t}</s>`             // strikethrough
      if (node.format & 16) t = `<code>${t}</code>`       // code
      return t
    }

    const inner = (node.children ?? []).map(nodeToHtml).join('')

    switch (node.type) {
      case 'heading': {
        const tag = `h${node.tag?.replace('h','') ?? '2'}`
        const align = node.format ? ` style="text-align:${node.format}"` : ''
        return `<${tag}${align}>${inner}</${tag}>`
      }
      case 'paragraph': {
        const align = node.format ? ` style="text-align:${node.format}"` : ''
        return `<p${align}>${inner}</p>`
      }
      case 'list':
        return node.listType === 'bullet'
          ? `<ul>${inner}</ul>`
          : `<ol>${inner}</ol>`
      case 'listitem':
        return `<li>${inner}</li>`
      case 'quote':
        return `<blockquote>${inner}</blockquote>`
      case 'horizontalrule':
        return '<hr/>'
      case 'link': {
        const href = node.fields?.url ?? node.url ?? '#'
        return `<a href="${href}">${inner}</a>`
      }
      case 'upload': {
        const url = node.value?.url ?? ''
        return url ? `<img src="${url}" alt="${node.value?.alt ?? ''}" class="max-w-full h-auto my-4 rounded"/>` : ''
      }
      default:
        return inner
    }
  }

  return (content.root.children ?? []).map(nodeToHtml).join('')
}

/* GET — fetch single post for editing */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  try {
    const payload = await getPayloadClient()
    if (!payload) return NextResponse.json({ error: 'DB unavailable' }, { status: 503 })

    const post = await payload.findByID({ collection: 'posts', id, draft: true })
    const html = lexicalToHtml((post as any).content)

    return NextResponse.json({
      id:          post.id,
      title:       (post as any).title       ?? '',
      excerpt:     (post as any).excerpt     ?? '',
      content:     html,
      category:    (post as any).category    ?? '',
      readingTime: (post as any).readingTime ?? '',
      _status:     (post as any)._status,
      coverImage:  (post as any).coverImage  ?? null,
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

    // Wrap Tiptap HTML in Lexical envelope so blog page can render it
    const richContent = {
      root: {
        type: 'root', format: '', indent: 0, version: 1, direction: 'rtl',
        children: [{
          type: 'paragraph', format: '', indent: 0, version: 1, direction: 'rtl',
          textFormat: 0, textStyle: '',
          children: [{
            type: 'text',
            text: content,   // raw HTML — blog page detects "<" prefix and uses dangerouslySetInnerHTML
            format: 0, version: 1, mode: 'normal', style: '', detail: 0,
          }],
        }],
      },
    }

    // Handle new cover image if provided
    let coverImageId: string | undefined
    if (coverImageBase64?.startsWith('data:image')) {
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
      } catch (e) { console.warn('Cover image upload failed:', e) }
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
        category: category || 'others',
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
