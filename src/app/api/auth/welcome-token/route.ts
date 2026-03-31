import { NextResponse } from 'next/server'
import { UserStore } from '@/lib/userStore'

function appBaseUrl(request: Request) {
  return (process.env.APP_BASE_URL || new URL(request.url).origin).replace(/\/+$/g, '')
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json()
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })

    const reset = await UserStore.createPasswordResetToken(email)
    if (!reset) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const resetUrl = `${appBaseUrl(request)}/reset-password/${reset.token}`
    return NextResponse.json({ resetUrl, name: reset.user.name || 'there' })
  } catch {
    return NextResponse.json({ error: 'Failed to generate token' }, { status: 500 })
  }
}
