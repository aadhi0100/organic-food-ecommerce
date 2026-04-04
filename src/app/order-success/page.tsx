'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { CheckCircle, Package, Home } from 'lucide-react'
import { motion } from 'framer-motion'
import { useLanguage } from '@/context/LanguageContext'
import { useSearchParams } from 'next/navigation'

function OrderSuccessContent() {
  const { t } = useLanguage()
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')
  const [pdfLoading, setPdfLoading] = useState(false)

  const handleDownloadPdf = async () => {
    if (!orderId) return
    setPdfLoading(true)
    try {
      const res = await fetch(`/api/orders/${orderId}/invoice`)
      const json = await res.json()
      if (!json.success) throw new Error(json.error || 'Failed to load invoice')
      const invoice = json.data

      const [{ jsPDF }, { default: autoTable }, { default: QRCode }] = await Promise.all([
        import('jspdf'),
        import('jspdf-autotable'),
        import('qrcode'),
      ])

      type RGB = [number, number, number]
      const G900: RGB = [20, 83, 45], G700: RGB = [21, 128, 61], G500: RGB = [22, 163, 74]
      const G100: RGB = [220, 252, 231], G50: RGB = [240, 253, 244]
      const S900: RGB = [15, 23, 42], S700: RGB = [51, 65, 85], S500: RGB = [100, 116, 139]
      const S300: RGB = [148, 163, 184], S200: RGB = [203, 213, 225]
      const S100: RGB = [241, 245, 249], S50: RGB = [248, 250, 252], WHITE: RGB = [255, 255, 255]

      const money = (v: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(v)
      const fmt = (iso: string) => new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })

      const doc = new jsPDF({ unit: 'pt', format: 'a4', compress: true })
      const PW = doc.internal.pageSize.width, PH = doc.internal.pageSize.height
      const L = 44, R = 44, CW = PW - L - R

      const HH = 96
      doc.setFillColor(...G900); doc.rect(0, 0, PW, HH, 'F')
      doc.setFillColor(...G700); doc.rect(0, 0, PW * 0.38, HH, 'F')
      doc.setFillColor(...G500); doc.circle(L + 20, HH / 2, 16, 'F')
      doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(...WHITE)
      doc.text('OFS', L + 20, HH / 2 + 3.5, { align: 'center' })
      doc.setFontSize(16); doc.text('Organic Food Store', L + 44, HH / 2 - 6)
      doc.setFont('helvetica', 'normal'); doc.setFontSize(7); doc.setTextColor(...G100)
      doc.text('FARM TO TABLE  |  FAST & FRESH', L + 44, HH / 2 + 6)
      doc.text('No. 12, Anna Salai, Teynampet, Chennai 600018  |  info@organicfood.in  |  +91 98765 43210', L + 44, HH / 2 + 17)
      doc.setFont('helvetica', 'bold'); doc.setFontSize(28); doc.setTextColor(...WHITE)
      doc.text('INVOICE', PW - R, 38, { align: 'right' })
      const MX = PW - R - 160, MY = 44
      ;([['Invoice No.', `#${invoice.orderId}`], ['Order Date', fmt(invoice.orderDate)], ['Due Date', fmt(invoice.deliveryDate)]] as [string, string][]).forEach(([lbl, val], i) => {
        const ry = MY + i * 13
        doc.setFont('helvetica', 'normal'); doc.setFontSize(7); doc.setTextColor(...G100); doc.text(lbl, MX, ry)
        doc.setFont('helvetica', 'bold'); doc.setTextColor(...WHITE); doc.text(val, PW - R, ry, { align: 'right' })
      })

      let y = HH + 18
      const stripHeight = 52
      doc.setFillColor(...S50); doc.setDrawColor(...S200); doc.setLineWidth(0.4)
      doc.roundedRect(L, y, CW, stripHeight, 4, 4, 'FD')
      const BW = CW * 0.55
      doc.setFont('helvetica', 'bold'); doc.setFontSize(6); doc.setTextColor(...S300); doc.text('BILL TO', L + 10, y + 13)
      doc.setFontSize(9.5); doc.setTextColor(...S900); doc.text(invoice.customerName, L + 10, y + 26)
      doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5); doc.setTextColor(...S700)
      doc.text(`${invoice.customerEmail || ''}   ${invoice.customerPhone || ''}`, L + 10, y + 38)
      doc.setDrawColor(...S200); doc.line(L + BW, y + 8, L + BW, y + stripHeight - 8)
      const MC = (CW - BW) / 3
      ;([['ORDER DATE', fmt(invoice.orderDate)], ['PAYMENT', invoice.paymentMethod], ['STATUS', 'Confirmed']] as [string, string][]).forEach(([lbl, val], i) => {
        const cx = L + BW + i * MC + 10
        doc.setFont('helvetica', 'normal'); doc.setFontSize(6); doc.setTextColor(...S300); doc.text(lbl, cx, y + 18)
        doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.setTextColor(...S900); doc.text(val, cx, y + 32)
        if (i < 2) { doc.setDrawColor(...S200); doc.line(L + BW + (i + 1) * MC, y + 8, L + BW + (i + 1) * MC, y + stripHeight - 8) }
      })
      y += stripHeight + 14

      autoTable(doc, {
        startY: y,
        head: [['#', 'Product', 'Qty', 'Unit Price', 'Discount', 'Total']],
        body: invoice.items.map((item: any, idx: number) => [String(idx + 1), item.name, String(item.quantity), money(item.unitPrice), item.discountPercent > 0 ? `-${item.discountPercent}%` : '—', money(item.lineTotal)]),
        theme: 'plain',
        headStyles: { fillColor: G50, textColor: G900, fontStyle: 'bold', fontSize: 7, cellPadding: { top: 7, bottom: 7, left: 8, right: 8 }, lineColor: G100, lineWidth: { bottom: 1.2 } },
        bodyStyles: { fontSize: 8, cellPadding: { top: 7, bottom: 7, left: 8, right: 8 }, textColor: S900, lineColor: S100, lineWidth: { bottom: 0.4 } },
        alternateRowStyles: { fillColor: S50 },
        columnStyles: { 0: { cellWidth: 22, halign: 'center', textColor: S300, fontStyle: 'bold' }, 1: { cellWidth: 'auto', halign: 'left' }, 2: { cellWidth: 32, halign: 'center' }, 3: { cellWidth: 72, halign: 'right' }, 4: { cellWidth: 56, halign: 'right', textColor: G500 }, 5: { cellWidth: 72, halign: 'right', fontStyle: 'bold' } },
        margin: { left: L, right: R }, tableLineColor: S200, tableLineWidth: 0.4,
      })
      y = ((doc as any).lastAutoTable?.finalY ?? y) + 20

      const QR_SIZE = 88, SUM_W = 200, PAY_W = CW - QR_SIZE - SUM_W - 24
      const trackingUrl = `https://organicfood.in/track/${invoice.orderId}`
      const qrImg = await QRCode.toDataURL(trackingUrl, { width: 160, margin: 1, color: { dark: '#14532d', light: '#ffffff' } })
      doc.setFillColor(...WHITE); doc.setDrawColor(...S200); doc.setLineWidth(0.4)
      doc.roundedRect(L, y, QR_SIZE + 20, QR_SIZE + 32, 4, 4, 'FD')
      doc.addImage(qrImg, 'PNG', L + 10, y + 10, QR_SIZE, QR_SIZE)
      doc.setFont('helvetica', 'bold'); doc.setFontSize(6); doc.setTextColor(...G900)
      doc.text('SCAN TO TRACK ORDER', L + QR_SIZE / 2 + 10, y + QR_SIZE + 22, { align: 'center' })
      const PAY_X = L + QR_SIZE + 32
      doc.setFont('helvetica', 'bold'); doc.setFontSize(6.5); doc.setTextColor(...S300); doc.text('PAYMENT METHOD', PAY_X, y + 12)
      doc.setFillColor(...G50); doc.setDrawColor(...G100); doc.setLineWidth(0.4)
      doc.roundedRect(PAY_X, y + 16, PAY_W, 22, 3, 3, 'FD')
      doc.setFont('helvetica', 'bold'); doc.setFontSize(8.5); doc.setTextColor(...G900); doc.text('[OK]  ' + invoice.paymentMethod, PAY_X + 8, y + 30)
      doc.setFont('helvetica', 'bold'); doc.setFontSize(6.5); doc.setTextColor(...S300); doc.text('TRACKING NUMBER', PAY_X, y + 54)
      doc.setFont('courier', 'bold'); doc.setFontSize(8.5); doc.setTextColor(...S900); doc.text(invoice.trackingNumber, PAY_X, y + 66)
      doc.setFont('helvetica', 'bold'); doc.setFontSize(6.5); doc.setTextColor(...S300); doc.text('TRACK URL', PAY_X, y + 82)
      doc.setFont('helvetica', 'normal'); doc.setFontSize(7); doc.setTextColor(...G700); doc.text(trackingUrl, PAY_X, y + 93)

      const SUM_X = PW - R - SUM_W
      const totRows: Array<{ label: string; value: string; green?: boolean }> = [
        { label: 'Subtotal', value: money(invoice.subtotal + invoice.quantityDiscount) },
        ...(invoice.quantityDiscount > 0 ? [{ label: 'Qty Discount', value: `-${money(invoice.quantityDiscount)}`, green: true }] : []),
        ...(invoice.bundleDiscount > 0 ? [{ label: 'Bundle Discount', value: `-${money(invoice.bundleDiscount)}`, green: true }] : []),
        ...(invoice.loyaltyDiscount > 0 ? [{ label: 'Loyalty Discount', value: `-${money(invoice.loyaltyDiscount)}`, green: true }] : []),
        ...(invoice.couponDiscount > 0 ? [{ label: 'Coupon Discount', value: `-${money(invoice.couponDiscount)}`, green: true }] : []),
        { label: 'Shipping', value: invoice.shipping === 0 ? 'FREE' : money(invoice.shipping), green: invoice.shipping === 0 },
        { label: 'GST / Tax', value: money(invoice.tax) },
      ]
      const ROW_H = 16, INNER_H = totRows.length * ROW_H, GRAND_H = 26, BOX_H = 14 + INNER_H + GRAND_H
      doc.setFillColor(...WHITE); doc.setDrawColor(...S200); doc.setLineWidth(0.4)
      doc.roundedRect(SUM_X, y, SUM_W, BOX_H, 4, 4, 'FD')
      doc.setFillColor(...S50); doc.roundedRect(SUM_X, y, SUM_W, 14, 4, 4, 'F')
      doc.rect(SUM_X, y + 7, SUM_W, 7, 'F')
      doc.setDrawColor(...S200); doc.line(SUM_X, y + 14, SUM_X + SUM_W, y + 14)
      doc.setFont('helvetica', 'bold'); doc.setFontSize(6.5); doc.setTextColor(...S500)
      doc.text('ORDER SUMMARY', SUM_X + SUM_W / 2, y + 10, { align: 'center' })
      totRows.forEach((row, i) => {
        const ry = y + 14 + i * ROW_H
        if (i % 2 === 1) { doc.setFillColor(...S50); doc.rect(SUM_X + 0.5, ry, SUM_W - 1, ROW_H, 'F') }
        const ty = ry + ROW_H - 4
        doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5); doc.setTextColor(...S700); doc.text(row.label, SUM_X + 8, ty)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(row.green ? G500[0] : S900[0], row.green ? G500[1] : S900[1], row.green ? G500[2] : S900[2])
        doc.text(row.value, SUM_X + SUM_W - 8, ty, { align: 'right' })
      })
      doc.setDrawColor(...S200); doc.line(SUM_X, y + 14 + INNER_H, SUM_X + SUM_W, y + 14 + INNER_H)
      const GT_Y = y + 14 + INNER_H
      doc.setFillColor(...G900); doc.roundedRect(SUM_X, GT_Y, SUM_W, GRAND_H, 4, 4, 'F')
      doc.rect(SUM_X, GT_Y, SUM_W, GRAND_H / 2, 'F')
      doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(...WHITE)
      doc.text('GRAND TOTAL', SUM_X + 8, GT_Y + 17)
      doc.setFontSize(11); doc.text(money(invoice.total), SUM_X + SUM_W - 8, GT_Y + 17, { align: 'right' })
      y += Math.max(QR_SIZE + 32, BOX_H) + 18

      const NOTE_H = 38
      doc.setFillColor(...S50); doc.setDrawColor(...S200); doc.setLineWidth(0.4)
      doc.roundedRect(L, y, CW, NOTE_H, 4, 4, 'FD')
      doc.setFont('helvetica', 'bold'); doc.setFontSize(6.5); doc.setTextColor(...S500); doc.text('TERMS & CONDITIONS', L + 10, y + 13)
      doc.setFont('helvetica', 'normal'); doc.setFontSize(7); doc.setTextColor(...S700)
      doc.text('Payment is due within 7 days of invoice date. All products are subject to availability. Returns accepted within 7 days of delivery.', L + 10, y + 24)
      doc.text('For support: support@organicfood.in  |  +91 98765 43210', L + 10, y + 34)

      const FOOTER_Y = PH - 30
      doc.setFillColor(...S50); doc.rect(0, FOOTER_Y, PW, 30, 'F')
      doc.setDrawColor(...S200); doc.setLineWidth(0.4); doc.line(0, FOOTER_Y, PW, FOOTER_Y)
      doc.setFillColor(...G900); doc.rect(0, PH - 5, PW, 5, 'F')
      doc.setFont('helvetica', 'normal'); doc.setFontSize(6.5); doc.setTextColor(...S300)
      doc.text('This is a computer-generated invoice and does not require a signature.', L, FOOTER_Y + 18)
      doc.setFont('helvetica', 'bold'); doc.setTextColor(...S500)
      doc.text(`© ${new Date().getFullYear()} Organic Food Store  |  organicfood.in`, PW - R, FOOTER_Y + 18, { align: 'right' })
      doc.setFont('helvetica', 'normal'); doc.setFontSize(6.5); doc.setTextColor(...S300)
      doc.text('Page 1 of 1', PW / 2, FOOTER_Y + 18, { align: 'center' })

      const blob = doc.output('blob')
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url; a.download = `Invoice-${invoice.orderId}.pdf`; a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('PDF generation error:', err)
      alert('Failed to generate PDF. Please try again.')
    } finally {
      setPdfLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-16">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mx-auto max-w-2xl text-center">
          <CheckCircle size={80} className="mx-auto mb-6 text-green-600" />
          <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">{t('orderSuccess')}!</h1>
          <p className="mb-8 text-xl text-gray-600 dark:text-gray-400">{t('thankYouOrder')}</p>

          {orderId && (
            <div className="mb-8 rounded-2xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 p-5 text-left">
              <p className="text-sm uppercase tracking-[0.2em] text-green-700 dark:text-green-400">{t('orderReference')}</p>
              <p className="mt-2 text-2xl font-bold text-green-900 dark:text-green-300">{orderId}</p>
            </div>
          )}

          <div className="mb-8 rounded-lg border-2 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 p-6">
            <Package size={48} className="mx-auto mb-4 text-green-600" />
            <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">{t('whatsNext')}</h2>
            <ul className="mx-auto max-w-md space-y-2 text-left">
              <li className="flex items-start gap-2">
                <span className="font-bold text-green-600">1.</span>
                <span className="text-gray-700 dark:text-gray-300">{t('orderConfirmationEmail')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-green-600">2.</span>
                <span className="text-gray-700 dark:text-gray-300">{t('prepareYourFreshProducts')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-green-600">3.</span>
                <span className="text-gray-700 dark:text-gray-300">{t('deliveryWithin24To48Hours')}</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/" className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-8 py-3 font-bold text-white transition hover:bg-green-700">
              <Home size={20} />{t('home')}
            </Link>
            {orderId && (
              <Link href={`/invoice/${orderId}`} className="inline-flex items-center gap-2 rounded-lg border-2 border-green-600 px-8 py-3 font-bold text-green-600 dark:text-green-400 dark:border-green-500 transition hover:bg-green-50 dark:hover:bg-green-900/20">
                {t('viewInvoice')}
              </Link>
            )}
            {orderId && (
              <button onClick={handleDownloadPdf} disabled={pdfLoading} className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-8 py-3 font-bold text-white transition hover:bg-green-700 disabled:opacity-60">
                {pdfLoading ? 'Generating…' : `↓ ${t('downloadPdf')}`}
              </button>
            )}
            {orderId && (
              <Link href={`/track-order/${orderId}`} className="inline-flex items-center gap-2 rounded-lg border-2 border-slate-800 dark:border-slate-400 px-8 py-3 font-bold text-slate-800 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-slate-800">
                {t('trackOrder')}
              </Link>
            )}
            <Link href="/products" className="inline-flex items-center gap-2 rounded-lg border-2 border-green-600 px-8 py-3 font-bold text-green-600 dark:text-green-400 dark:border-green-500 transition hover:bg-green-50 dark:hover:bg-green-900/20">
              {t('continueShopping')}
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center dark:bg-gray-900"><div className="h-12 w-12 animate-spin rounded-full border-b-2 border-green-600" /></div>}>
      <OrderSuccessContent />
    </Suspense>
  )
}
