import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { SESSION_COOKIE_NAME, verifySession } from '@/lib/auth/session'

function escapeHtml(str: unknown) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

export async function POST(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie') || ''
    const match = cookieHeader.match(new RegExp(`(?:^|; )${SESSION_COOKIE_NAME}=([^;]+)`))
    const token = match ? decodeURIComponent(match[1] || '') : ''
    if (!token) return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    try { await verifySession(token) } catch { return NextResponse.json({ error: 'Authentication required' }, { status: 401 }) }

    const { email, orderDetails, items, total } = await request.json()

    if (!email || !orderDetails?.orderId || !Array.isArray(items)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Sanitize orderId to prevent path traversal
    const safeOrderId = String(orderDetails.orderId).replace(/[^a-zA-Z0-9_-]/g, '')
    if (!safeOrderId) return NextResponse.json({ error: 'Invalid order ID' }, { status: 400 })

    const receipt = `<!DOCTYPE html>
<html>
<head><style>
  body{font-family:Arial,sans-serif;line-height:1.6;color:#333}
  .container{max-width:600px;margin:0 auto;padding:20px}
  .header{background:#16a34a;color:white;padding:20px;text-align:center}
  .content{padding:20px;background:#f9f9f9}
  .item{border-bottom:1px solid #ddd;padding:10px 0}
  .total{font-size:20px;font-weight:bold;color:#16a34a;margin-top:20px}
  .footer{text-align:center;padding:20px;color:#666;font-size:12px}
</style></head>
<body>
  <div class="container">
    <div class="header"><h1>🌿 Organic Food Store</h1><p>Order Receipt</p></div>
    <div class="content">
      <h2>Order #${escapeHtml(safeOrderId)}</h2>
      <p><strong>Date:</strong> ${new Date().toLocaleDateString('en-IN')}</p>
      <p><strong>Customer:</strong> ${escapeHtml(orderDetails.customerName)}</p>
      <h3>Items Purchased:</h3>
      ${items.map((item: { name?: unknown; quantity?: unknown; price?: unknown }) => `
        <div class="item">
          <strong>${escapeHtml(item.name)}</strong><br>
          Quantity: ${escapeHtml(item.quantity)} × ₹${escapeHtml(item.price)}
        </div>
      `).join('')}
      <div class="total">
        <p>Total: ₹${escapeHtml(total)}</p>
      </div>
    </div>
    <div class="footer"><p>Thank you for shopping with us!</p></div>
  </div>
</body>
</html>`

    const receiptsDir = path.join(process.cwd(), 'data', 'receipts')
    if (!fs.existsSync(receiptsDir)) fs.mkdirSync(receiptsDir, { recursive: true })
    fs.writeFileSync(path.join(receiptsDir, `receipt_${safeOrderId}.html`), receipt)

    return NextResponse.json({ success: true, message: 'Receipt generated successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate receipt' }, { status: 500 })
  }
}
