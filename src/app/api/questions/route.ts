import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

/** Decode JWT from cookie — no external lib needed */
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

export async function POST(req: NextRequest) {
  try {
    const { title, body: questionBody, category, name, email } = await req.json()

    if (!title || !questionBody || !category) {
      return NextResponse.json({ error: 'فیلدهای الزامی وارد نشده‌اند' }, { status: 400 })
    }

    const payload = await getPayloadClient()
    if (!payload) return NextResponse.json({ error: 'سرور در دسترس نیست' }, { status: 503 })

    // ── Get the real logged-in user ID from cookie ──────────
    const tokenUserId = getUserIdFromToken(req)

    let userId: string | undefined = tokenUserId || undefined

    // If no token (shouldn't happen if form is auth-gated) fallback to email lookup
    if (!userId && email) {
      try {
        const existing = await payload.find({
          collection: 'users',
          where: { email: { equals: email } },
          limit: 1,
        })
        if (existing.docs.length > 0) {
          userId = String(existing.docs[0].id)
        } else if (name && email) {
          const newUser = await payload.create({
            collection: 'users',
            data: {
              name: name || email.split('@')[0],
              email,
              password: Math.random().toString(36).slice(-12) + 'Aa1!',
              role: 'client',
            },
          })
          userId = String(newUser.id)
        }
      } catch (_) {}
    }

    const question = await payload.create({
      collection: 'questions',
      data: {
        title,
        body: questionBody,
        category,
        status: 'pending',
        isPublic: true,
        ...(userId ? { askedBy: userId } : {}),
      },
    })

    return NextResponse.json({ success: true, id: question.id })
  } catch (error) {
    console.error('Question submission error:', error)
    return NextResponse.json({ error: 'خطا در ثبت سوال' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const page     = parseInt(searchParams.get('page') || '1')

    const payload = await getPayloadClient()
    if (!payload) return NextResponse.json({ docs: [], totalDocs: 0 })

    const where: any = {
      status: { equals: 'answered' },
      isPublic: { equals: true },
    }
    if (category) where.category = { equals: category }

    const result = await payload.find({
      collection: 'questions',
      where,
      limit: 20,
      page,
      sort: '-answeredAt',
      depth: 1,
    })

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: 'خطا در دریافت سوالات' }, { status: 500 })
  }
}
