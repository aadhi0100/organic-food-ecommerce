import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json(
    { error: 'Password registration is disabled. Use Google Sign-In instead.' },
    { status: 410 },
  )
}
