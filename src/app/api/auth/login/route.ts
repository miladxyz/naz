import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) {
      return NextResponse.json({ error: 'ایمیل و رمز عبور الزامی است' }, { status: 400 })
    }

    const payload = await getPayloadClient()
    const result = await payload.login({
      collection: 'users',
      data: { email, password },
    })

    const response = NextResponse.json({
      success: true,
      user: {
        id: result.user.id,
        name: (result.user as any).name,
        email: result.user.email,
        role: (result.user as any).role,
      },
      token: result.token,
    })

    if (result.token) {
      response.cookies.set('payload-token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      })
    }

    return response
  } catch (error: any) {
    const msg = error?.message || ''
    if (msg.toLowerCase().includes('invalid') || msg.toLowerCase().includes('not found')) {
      return NextResponse.json({ error: 'ایمیل یا رمز عبور اشتباه است' }, { status: 401 })
    }
    console.error('Login error:', error)
    return NextResponse.json({ error: 'خطا در ورود' }, { status: 500 })
  }
}
