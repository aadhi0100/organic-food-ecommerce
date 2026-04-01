import jsPDF from 'jspdf'
import 'jspdf-autotable'
import QRCode from 'qrcode'
import type { InvoiceData } from '@/lib/invoiceData'

type RGB = [number, number, number]

// ── Palette ──────────────────────────────────────────────────────────────────
const G900: RGB = [20,  83,  45]
const G700: RGB = [21, 128,  61]
const G500: RGB = [22, 163,  74]
const G100: RGB = [220, 252, 231]
const G50:  RGB = [240, 253, 244]

const S900: RGB = [15,  23,  42]
const S700: RGB = [51,  65,  85]
const S500: RGB = [100, 116, 139]
const S300: RGB = [148, 163, 184]
const S200: RGB = [203, 213, 225]
const S100: RGB = [241, 245, 249]
const S50:  RGB = [248, 250, 252]
const WHITE: RGB = [255, 255, 255]

// ── Helpers ───────────────────────────────────────────────────────────────────
function money(v: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(v)
}

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

async function qrDataUrl(text: string): Promise<string> {
  return QRCode.toDataURL(text, { width: 160, margin: 1, color: { dark: '#14532d', light: '#ffffff' } })
}

// ── Main ──────────────────────────────────────────────────────────────────────
export async function generateProfessionalInvoice(data: InvoiceData): Promise<jsPDF> {
  if (!data || !data.items || data.items.length === 0) {
    throw new Error('Invalid invoice data: missing items')
  }
  
  const doc = new jsPDF({ unit: 'pt', format: 'a4', compress: true })
  const PW  = doc.internal.pageSize.width   // 595.28
  const PH  = doc.internal.pageSize.height  // 841.89
  const L   = 44
  const R   = 44
  const CW  = PW - L - R

  // ── 1. HEADER BAND ────────────────────────────────────────────────────────
  const HH = 96
  doc.setFillColor(...G900)
  doc.rect(0, 0, PW, HH, 'F')
  doc.setFillColor(...G700)
  doc.rect(0, 0, PW * 0.38, HH, 'F')

  // Logo circle
  doc.setFillColor(...G500)
  doc.circle(L + 20, HH / 2, 16, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.setTextColor(...WHITE)
  doc.text('OFS', L + 20, HH / 2 + 3.5, { align: 'center' })

  // Brand
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...WHITE)
  doc.text('Organic Food Store', L + 44, HH / 2 - 6)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7)
  doc.setTextColor(...G100)
  doc.text('FARM TO TABLE  ·  FAST & FRESH', L + 44, HH / 2 + 6)
  doc.text('No. 12, Anna Salai, Teynampet, Chennai 600018  |  info@organicfood.in  |  +91 98765 43210', L + 44, HH / 2 + 17)

  // INVOICE title + meta — right
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(28)
  doc.setTextColor(...WHITE)
  doc.text('INVOICE', PW - R, 38, { align: 'right' })

  const MX = PW - R - 160
  const MY = 44
  const metaRows: [string, string][] = [
    ['Invoice No.', `#${data.orderId}`],
    ['Order Date',  fmt(data.orderDate)],
    ['Due Date',    fmt(data.deliveryDate)],
  ]
  doc.setFontSize(7)
  metaRows.forEach(([lbl, val], i) => {
    const ry = MY + i * 13
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...G100)
    doc.text(lbl, MX, ry)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...WHITE)
    doc.text(val, PW - R, ry, { align: 'right' })
  })

  let y = HH + 18

  // ── 2. BILL TO + ORDER META STRIP ─────────────────────────────────────────
  const STRIP_H = 52
  doc.setFillColor(...S50)
  doc.setDrawColor(...S200)
  doc.setLineWidth(0.4)
  doc.roundedRect(L, y, CW, STRIP_H, 4, 4, 'FD')

  // Bill To (left 55%)
  const BW = CW * 0.55
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(6)
  doc.setTextColor(...S300)
  doc.text('BILL TO', L + 10, y + 13)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9.5)
  doc.setTextColor(...S900)
  doc.text(data.customerName, L + 10, y + 26)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.5)
  doc.setTextColor(...S700)
  doc.text(`${data.customerEmail || ''}   ${data.customerPhone || ''}`, L + 10, y + 38)

  // Divider
  doc.setDrawColor(...S200)
  doc.line(L + BW, y + 8, L + BW, y + STRIP_H - 8)

  // Order meta (right 45%) — 3 cells
  const metaCols: [string, string][] = [
    ['ORDER DATE',     fmt(data.orderDate)],
    ['PAYMENT',        data.paymentMethod],
    ['STATUS',         'Confirmed'],
  ]
  const MC = (CW - BW) / 3
  metaCols.forEach(([lbl, val], i) => {
    const cx = L + BW + i * MC + 10
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(6)
    doc.setTextColor(...S300)
    doc.text(lbl, cx, y + 18)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    doc.setTextColor(...S900)
    doc.text(val, cx, y + 32)
    if (i < 2) {
      doc.setDrawColor(...S200)
      doc.line(L + BW + (i + 1) * MC, y + 8, L + BW + (i + 1) * MC, y + STRIP_H - 8)
    }
  })

  y += STRIP_H + 14

  // ── 3. ITEMS TABLE ────────────────────────────────────────────────────────
  (doc as any).autoTable({
    startY: y,
    head: [['#', 'Product', 'Qty', 'Unit Price', 'Discount', 'Total']],
    body: data.items.map((item, idx) => [
      String(idx + 1),
      item.name,
      String(item.quantity),
      money(item.unitPrice),
      item.discountPercent > 0 ? `-${item.discountPercent}%` : '—',
      money(item.lineTotal),
    ]),
    theme: 'plain',
    headStyles: {
      fillColor:   G50,
      textColor:   G900,
      fontStyle:   'bold',
      fontSize:    7,
      cellPadding: { top: 7, bottom: 7, left: 8, right: 8 },
      lineColor:   G100,
      lineWidth:   { bottom: 1.2 },
    },
    bodyStyles: {
      fontSize:    8,
      cellPadding: { top: 7, bottom: 7, left: 8, right: 8 },
      textColor:   S900,
      lineColor:   S100,
      lineWidth:   { bottom: 0.4 },
    },
    alternateRowStyles: { fillColor: S50 },
    columnStyles: {
      0: { cellWidth: 22,     halign: 'center', textColor: S300, fontStyle: 'bold' },
      1: { cellWidth: 'auto', halign: 'left' },
      2: { cellWidth: 32,     halign: 'center' },
      3: { cellWidth: 72,     halign: 'right' },
      4: { cellWidth: 56,     halign: 'right', textColor: G500 },
      5: { cellWidth: 72,     halign: 'right', fontStyle: 'bold' },
    },
    margin: { left: L, right: R },
    tableLineColor: S200,
    tableLineWidth: 0.4,
  })

  y = ((doc as any).lastAutoTable?.finalY ?? y) + 20

  // ── 4. BOTTOM SECTION: QR  |  PAYMENT  |  SUMMARY ────────────────────────
  const QR_SIZE  = 88
  const SUM_W    = 200
  const PAY_W    = CW - QR_SIZE - SUM_W - 24  // middle column

  // ── 4a. QR Code (left) ────────────────────────────────────────────────────
  const trackingUrl = `https://organicfood.in/track/${data.orderId}`
  const qrImg = await qrDataUrl(trackingUrl)

  doc.setFillColor(...WHITE)
  doc.setDrawColor(...S200)
  doc.setLineWidth(0.4)
  doc.roundedRect(L, y, QR_SIZE + 20, QR_SIZE + 32, 4, 4, 'FD')

  doc.addImage(qrImg, 'PNG', L + 10, y + 10, QR_SIZE, QR_SIZE)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(6)
  doc.setTextColor(...G900)
  doc.text('SCAN TO TRACK ORDER', L + QR_SIZE / 2 + 10, y + QR_SIZE + 22, { align: 'center' })

  // ── 4b. Payment + Tracking (middle) ───────────────────────────────────────
  const PAY_X = L + QR_SIZE + 32
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(6.5)
  doc.setTextColor(...S300)
  doc.text('PAYMENT METHOD', PAY_X, y + 12)

  doc.setFillColor(...G50)
  doc.setDrawColor(...G100)
  doc.setLineWidth(0.4)
  doc.roundedRect(PAY_X, y + 16, PAY_W, 22, 3, 3, 'FD')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8.5)
  doc.setTextColor(...G900)
  doc.text('✓  ' + data.paymentMethod, PAY_X + 8, y + 30)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(6.5)
  doc.setTextColor(...S300)
  doc.text('TRACKING NUMBER', PAY_X, y + 54)
  doc.setFont('courier', 'bold')
  doc.setFontSize(8.5)
  doc.setTextColor(...S900)
  doc.text(data.trackingNumber, PAY_X, y + 66)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(6.5)
  doc.setTextColor(...S300)
  doc.text('TRACK URL', PAY_X, y + 82)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7)
  doc.setTextColor(...G700)
  doc.text(trackingUrl, PAY_X, y + 93)

  // ── 4c. Order Summary (right) ─────────────────────────────────────────────
  const SUM_X = PW - R - SUM_W
  const totRows: Array<{ label: string; value: string; green?: boolean }> = [
    { label: 'Subtotal',         value: money(data.subtotal + data.quantityDiscount) },
    ...(data.quantityDiscount > 0 ? [{ label: 'Qty Discount',    value: `-${money(data.quantityDiscount)}`, green: true }] : []),
    ...(data.bundleDiscount   > 0 ? [{ label: 'Bundle Discount', value: `-${money(data.bundleDiscount)}`,   green: true }] : []),
    ...(data.loyaltyDiscount  > 0 ? [{ label: 'Loyalty Discount',value: `-${money(data.loyaltyDiscount)}`,  green: true }] : []),
    ...(data.couponDiscount   > 0 ? [{ label: 'Coupon Discount', value: `-${money(data.couponDiscount)}`,   green: true }] : []),
    { label: 'Shipping',         value: data.shipping === 0 ? 'FREE' : money(data.shipping), green: data.shipping === 0 },
    { label: 'GST / Tax',        value: money(data.tax) },
  ]

  const ROW_H   = 16
  const INNER_H = totRows.length * ROW_H
  const GRAND_H = 26
  const BOX_H   = 14 + INNER_H + GRAND_H

  doc.setFillColor(...WHITE)
  doc.setDrawColor(...S200)
  doc.setLineWidth(0.4)
  doc.roundedRect(SUM_X, y, SUM_W, BOX_H, 4, 4, 'FD')

  // Header
  doc.setFillColor(...S50)
  doc.roundedRect(SUM_X, y, SUM_W, 14, 4, 4, 'F')
  doc.rect(SUM_X, y + 7, SUM_W, 7, 'F')
  doc.setDrawColor(...S200)
  doc.line(SUM_X, y + 14, SUM_X + SUM_W, y + 14)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(6.5)
  doc.setTextColor(...S500)
  doc.text('ORDER SUMMARY', SUM_X + SUM_W / 2, y + 10, { align: 'center' })

  // Rows
  totRows.forEach((row, i) => {
    const ry = y + 14 + i * ROW_H
    if (i % 2 === 1) {
      doc.setFillColor(...S50)
      doc.rect(SUM_X + 0.5, ry, SUM_W - 1, ROW_H, 'F')
    }
    const ty = ry + ROW_H - 4
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7.5)
    doc.setTextColor(...S700)
    doc.text(row.label, SUM_X + 8, ty)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(row.green ? G500[0] : S900[0], row.green ? G500[1] : S900[1], row.green ? G500[2] : S900[2])
    doc.text(row.value, SUM_X + SUM_W - 8, ty, { align: 'right' })
  })

  // Grand total
  doc.setDrawColor(...S200)
  doc.line(SUM_X, y + 14 + INNER_H, SUM_X + SUM_W, y + 14 + INNER_H)
  const GT_Y = y + 14 + INNER_H
  doc.setFillColor(...G900)
  doc.roundedRect(SUM_X, GT_Y, SUM_W, GRAND_H, 4, 4, 'F')
  doc.rect(SUM_X, GT_Y, SUM_W, GRAND_H / 2, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.setTextColor(...WHITE)
  doc.text('GRAND TOTAL', SUM_X + 8, GT_Y + 17)
  doc.setFontSize(11)
  doc.text(money(data.total), SUM_X + SUM_W - 8, GT_Y + 17, { align: 'right' })

  y += Math.max(QR_SIZE + 32, BOX_H) + 18

  // ── 5. TERMS & NOTES ──────────────────────────────────────────────────────
  const NOTE_H = 38
  doc.setFillColor(...S50)
  doc.setDrawColor(...S200)
  doc.setLineWidth(0.4)
  doc.roundedRect(L, y, CW, NOTE_H, 4, 4, 'FD')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(6.5)
  doc.setTextColor(...S500)
  doc.text('TERMS & CONDITIONS', L + 10, y + 13)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7)
  doc.setTextColor(...S700)
  doc.text('Payment is due within 7 days of invoice date. All products are subject to availability. Returns accepted within 7 days of delivery.', L + 10, y + 24)
  doc.text('For support: support@organicfood.in  |  +91 98765 43210', L + 10, y + 34)

  y += NOTE_H + 10

  // ── 6. FOOTER ─────────────────────────────────────────────────────────────
  // Fill remaining page with a subtle background
  const FOOTER_Y = PH - 30
  doc.setFillColor(...S50)
  doc.rect(0, FOOTER_Y, PW, 30, 'F')
  doc.setDrawColor(...S200)
  doc.setLineWidth(0.4)
  doc.line(0, FOOTER_Y, PW, FOOTER_Y)

  // Green accent bar at very bottom
  doc.setFillColor(...G900)
  doc.rect(0, PH - 5, PW, 5, 'F')

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(6.5)
  doc.setTextColor(...S300)
  doc.text('This is a computer-generated invoice and does not require a signature.', L, FOOTER_Y + 18)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...S500)
  doc.text(`© ${new Date().getFullYear()} Organic Food Store  ·  organicfood.in`, PW - R, FOOTER_Y + 18, { align: 'right' })

  // Page number
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(6.5)
  doc.setTextColor(...S300)
  doc.text('Page 1 of 1', PW / 2, FOOTER_Y + 18, { align: 'center' })

  return doc
}
