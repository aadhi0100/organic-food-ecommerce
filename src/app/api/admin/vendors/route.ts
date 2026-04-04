import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { SESSION_COOKIE_NAME, verifySession } from '@/lib/auth/session'
import { DATA_ROOT } from '@/lib/storage'

async function requireAdmin(request: Request) {
  const cookieHeader = request.headers.get('cookie') || ''
  const match = cookieHeader.match(new RegExp(`(?:^|; )${SESSION_COOKIE_NAME}=([^;]+)`))
  const token = match ? decodeURIComponent(match[1] || '') : ''
  if (!token) return null
  try {
    const user = await verifySession(token)
    return user.role === 'admin' ? user : null
  } catch { return null }
}

function sanitizeField(value: unknown): string {
  return String(value ?? '').replace(/[\r\n]/g, ' ').trim()
}

function parseVendorFile(content: string) {
  const lines = content.split('\n').map(l => l.trim()).filter(Boolean)
  const data: Record<string, string> = {}
  for (const line of lines) {
    const idx = line.indexOf(':')
    if (idx === -1) continue
    const key = line.slice(0, idx).trim().toLowerCase()
    const value = line.slice(idx + 1).trim()
    data[key] = value
  }
  return data
}

export async function GET(request: Request) {
  try {
    if (!await requireAdmin(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }
    const dataDir = path.join(DATA_ROOT, 'users')
    if (!fs.existsSync(dataDir)) return NextResponse.json({ vendors: [] })

    const vendors = fs
      .readdirSync(dataDir)
      .filter(f => f.startsWith('vendor_') && f.endsWith('.txt'))
      .map(file => {
        const content = fs.readFileSync(path.join(dataDir, file), 'utf-8')
        const parsed = parseVendorFile(content)
        return {
          id: parsed.id || file.replace(/^vendor_/, '').replace(/\.txt$/, ''),
          name: parsed.name || '',
          email: parsed.email || '',
          role: 'vendor' as const,
          phone: parsed.phone || '',
          address: parsed.address || '',
          businessName: parsed['business name'] || '',
          status: (parsed.status as 'active' | 'inactive' | 'pending') || 'active',
          joinedDate: parsed.joined || parsed.created || '',
        }
      })
      .filter(v => v.id && v.email)

    return NextResponse.json({ vendors })
  } catch {
    return NextResponse.json({ vendors: [] }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    if (!await requireAdmin(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }
    const body = await request.json()
    const name = sanitizeField(body.name)
    const email = sanitizeField(body.email)
    const phone = sanitizeField(body.phone)
    const address = sanitizeField(body.address)
    const businessName = sanitizeField(body.businessName)

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
    }

    const vendorId = String(Date.now()).replace(/[^a-zA-Z0-9_-]/g, '')
    const formattedPhone = phone.startsWith('+91') ? phone : `+91 ${phone}`
    const joinedDate = new Date().toISOString()

    const newVendor = {
      id: vendorId,
      name,
      email,
      phone: formattedPhone,
      address,
      role: 'vendor' as const,
      businessName,
      status: 'active',
      joinedDate,
    }

    const dataDir = path.join(DATA_ROOT, 'users')
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })
    const filePath = path.join(dataDir, `vendor_${vendorId}.txt`)
    const content = `ID: ${vendorId}\nName: ${name}\nEmail: ${email}\nRole: vendor\nPhone: ${formattedPhone}\nAddress: ${address}\nBusiness Name: ${businessName}\nStatus: active\nJoined: ${joinedDate}\n`
    fs.writeFileSync(filePath, content, 'utf-8')
    return NextResponse.json({ success: true, vendor: newVendor })
  } catch {
    return NextResponse.json({ error: 'Failed to add vendor' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    if (!await requireAdmin(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }
    const { searchParams } = new URL(request.url)
    const rawId = searchParams.get('id')
    const id = rawId ? String(rawId).replace(/[^a-zA-Z0-9_-]/g, '') : ''

    if (!id) {
      return NextResponse.json({ error: 'Vendor ID required' }, { status: 400 })
    }

    const dataDir = path.join(DATA_ROOT, 'users')
    const filePath = path.join(dataDir, `vendor_${id}.txt`)
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }

    return NextResponse.json({ success: true, message: 'Vendor deleted' })
  } catch {
    return NextResponse.json({ error: 'Failed to delete vendor' }, { status: 500 })
  }
}
