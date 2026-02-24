import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()
    
    const subscription = {
      email,
      subscribedAt: new Date().toISOString(),
      status: 'active'
    }
    
    const dataDir = path.join(process.cwd(), 'data', 'subscriptions')
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }
    
    const filePath = path.join(dataDir, `subscription_${Date.now()}.txt`)
    const content = `Email: ${email}\nSubscribed At: ${subscription.subscribedAt}\nStatus: ${subscription.status}\n`
    
    fs.writeFileSync(filePath, content, 'utf-8')
    
    const allSubsPath = path.join(dataDir, 'all_subscriptions.txt')
    fs.appendFileSync(allSubsPath, `${email} - ${subscription.subscribedAt}\n`, 'utf-8')
    
    return NextResponse.json({ success: true, message: 'Subscribed successfully!' })
  } catch (error) {
    return NextResponse.json({ error: 'Subscription failed' }, { status: 500 })
  }
}
