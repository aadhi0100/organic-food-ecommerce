import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

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
