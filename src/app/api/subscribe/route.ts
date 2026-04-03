import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email || !EMAIL_RE.test(String(email))) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    const safeEmail = String(email).slice(0, 254).replace(/[\r\n]/g, '')
    const subscribedAt = new Date().toISOString()

    const dataDir = path.join(process.cwd(), 'data', 'subscriptions')
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }

    const filePath = path.join(dataDir, `subscription_${Date.now()}.txt`)
    const content = `Email: ${safeEmail}\nSubscribed At: ${subscribedAt}\nStatus: active\n`
    fs.writeFileSync(filePath, content, 'utf-8')

    const allSubsPath = path.join(dataDir, 'all_subscriptions.txt')
    fs.appendFileSync(allSubsPath, `${safeEmail} - ${subscribedAt}\n`, 'utf-8')

    return NextResponse.json({ success: true, message: 'Subscribed successfully!' })
  } catch {
    return NextResponse.json({ error: 'Subscription failed' }, { status: 500 })
  }
}
