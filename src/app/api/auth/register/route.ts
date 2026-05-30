import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json()
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'همه فیلدها الزامی است' }, { status: 400 })
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'رمز عبور باید حداقل ۸ کاراکتر باشد' }, { status: 400 })
    }

    const payload = await getPayloadClient()

    const existing = await payload.find({
      collection: 'users',
      where: { email: { equals: email } },
      limit: 1,
    })
    if (existing.docs.length > 0) {
      return NextResponse.json({ error: 'این ایمیل قبلاً ثبت شده است' }, { status: 409 })
    }

    await payload.create({
      collection: 'users',
      data: { name, email, password, role: 'client' },
    })

    // Auto-login
    const loginResult = await payload.login({
      collection: 'users',
      data: { email, password },
    })

    const response = NextResponse.json({
      success: true,
      user: {
        id: loginResult.user.id,
        name: (loginResult.user as any).name,
        email: loginResult.user.email,
        role: (loginResult.user as any).role,
      },
    })

    if (loginResult.token) {
      response.cookies.set('payload-token', loginResult.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      })
    }

    return response
  } catch (error: any) {
    console.error('Register error:', error)
    return NextResponse.json({ error: 'خطا در ثبت‌نام' }, { status: 500 })
  }
}
