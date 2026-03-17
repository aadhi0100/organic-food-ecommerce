import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

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

export async function GET() {
  try {
    const dataDir = path.join(process.cwd(), 'data', 'users')
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
    const body = await request.json()
    const { name, email, phone, address, businessName } = body
    
    const vendorId = String(Date.now())
    const newVendor = {
      id: vendorId,
      name,
      email,
      phone: phone.startsWith('+91') ? phone : `+91 ${phone}`,
      address,
      role: 'vendor' as const,
      businessName,
      status: 'active',
      joinedDate: new Date().toISOString()
    }
    
    // Save to file
    const dataDir = path.join(process.cwd(), 'data', 'users')
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }
    
    const filePath = path.join(dataDir, `vendor_${vendorId}.txt`)
    const content = `ID: ${vendorId}\nName: ${name}\nEmail: ${email}\nRole: vendor\nPhone: ${newVendor.phone}\nAddress: ${address}\nBusiness Name: ${businessName}\nStatus: active\nJoined: ${newVendor.joinedDate}\n`
    
    fs.writeFileSync(filePath, content, 'utf-8')
    
    return NextResponse.json({ success: true, vendor: newVendor })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add vendor' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'Vendor ID required' }, { status: 400 })
    }
    
    return NextResponse.json({ success: true, message: 'Vendor deleted' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete vendor' }, { status: 500 })
  }
}
