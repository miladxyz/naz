import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('payload-token')?.value
    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 })
    }

    // Decode JWT without external libs (base64url)
    const parts = token.split('.')
    if (parts.length !== 3) {
      return NextResponse.json({ user: null }, { status: 401 })
    }

    let decoded: any
    try {
      const padded = parts[1].padEnd(parts[1].length + (4 - parts[1].length % 4) % 4, '=')
      decoded = JSON.parse(Buffer.from(padded, 'base64').toString('utf8'))
    } catch {
      return NextResponse.json({ user: null }, { status: 401 })
    }

    if (!decoded?.id) {
      return NextResponse.json({ user: null }, { status: 401 })
    }

    // Check expiry
    if (decoded.exp && Math.floor(Date.now() / 1000) > decoded.exp) {
      return NextResponse.json({ user: null }, { status: 401 })
    }

    const payload = await getPayloadClient()
    if (!payload) {
      // DB not available — return a partial user from token claims
      return NextResponse.json({
        user: {
          id: decoded.id,
          name: decoded.name || 'کاربر',
          email: decoded.email || '',
          role: decoded.role || 'client',
        },
      })
    }

    const user = await payload.findByID({
      collection: 'users',
      id: decoded.id,
    })

    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 })
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: (user as any).name,
        email: user.email,
        role: (user as any).role,
      },
    })
  } catch (err) {
    console.error('[/api/auth/me]', err)
    return NextResponse.json({ user: null }, { status: 401 })
  }
}
