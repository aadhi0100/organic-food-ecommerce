import type { InvoiceData } from '@/lib/invoiceData'
import type { CSSProperties, ReactNode } from 'react'

type Translator = (key: string, params?: Record<string, string | number>) => string

const fmt = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 2,
})

export function InvoiceTemplate({ invoice, t }: { invoice: InvoiceData; t: Translator }) {
  const orderDate = new Date(invoice.orderDate).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'long', year: 'numeric',
  })
  const deliveryDate = new Date(invoice.deliveryDate).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'long', year: 'numeric',
  })

  return (
    <div style={{ background: '#0f172a', minHeight: '100vh', padding: '40px 32px', fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif" }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', background: '#ffffff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 25px 80px rgba(0,0,0,0.4)' }}>

        {/* ══════════════════════════════════════════
            HEADER — dark slate + emerald accent bar
        ══════════════════════════════════════════ */}
        <div style={{ position: 'relative', background: '#0f172a', padding: '0 0 0 0', overflow: 'hidden' }}>
          {/* top accent stripe */}
          <div style={{ height: 5, background: 'linear-gradient(90deg, #10b981 0%, #34d399 40%, #059669 100%)' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '36px 48px 32px', gap: 32 }}>
            {/* Brand block */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 14,
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 26, boxShadow: '0 4px 16px rgba(16,185,129,0.4)',
                }}>🌿</div>
                <div>
                  <div style={{ color: '#f8fafc', fontWeight: 800, fontSize: 22, letterSpacing: 0.3, lineHeight: 1.2 }}>
                    Organic Food Store
                  </div>
                  <div style={{ color: '#10b981', fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', marginTop: 2 }}>
                    Farm to Table · Certified Organic
                  </div>
                </div>
              </div>
              <div style={{ color: '#94a3b8', fontSize: 12.5, lineHeight: 2, borderLeft: '2px solid #1e293b', paddingLeft: 14 }}>
                <div>No. 12, Anna Salai, Teynampet</div>
                <div>Chennai, Tamil Nadu 600018, India</div>
                <div>info@organicfood.in &nbsp;·&nbsp; +91 98765 43210</div>
                <div>GSTIN: 33AABCO1234F1Z5</div>
              </div>
            </div>

            {/* INVOICE title block */}
            <div style={{ textAlign: 'right' }}>
              <div style={{
                fontSize: 52, fontWeight: 900, letterSpacing: 6,
                background: 'linear-gradient(135deg, #10b981, #34d399)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                lineHeight: 1, marginBottom: 20,
              }}>INVOICE</div>
              <div style={{
                background: '#1e293b', borderRadius: 12, padding: '16px 20px',
                border: '1px solid #334155', minWidth: 260,
              }}>
                {[
                  { label: 'Invoice No.', value: invoice.orderId, highlight: true },
                  { label: 'Issue Date', value: orderDate },
                  { label: 'Due Date', value: deliveryDate },
                  { label: 'Tracking No.', value: invoice.trackingNumber },
                ].map(row => (
                  <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0', borderBottom: '1px solid #334155' }}>
                    <span style={{ color: '#64748b', fontSize: 11, fontWeight: 600, letterSpacing: 0.8, textTransform: 'uppercase' }}>{row.label}</span>
                    <span style={{ color: row.highlight ? '#10b981' : '#e2e8f0', fontSize: 12, fontWeight: row.highlight ? 800 : 600, letterSpacing: row.highlight ? 0.5 : 0 }}>{row.value}</span>
                  </div>
                ))}
                {/* Status badge */}
                <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end' }}>
                  <span style={{
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: '#fff', fontSize: 11, fontWeight: 700,
                    padding: '4px 14px', borderRadius: 20, letterSpacing: 1, textTransform: 'uppercase',
                  }}>● Confirmed</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════
            BILL TO / SHIP TO — two-tone cards
        ══════════════════════════════════════════ */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: '#f8fafc' }}>
          {/* Bill To */}
          <div style={{ padding: '28px 48px', borderRight: '3px solid #e2e8f0', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: 4, height: '100%', background: 'linear-gradient(180deg, #10b981, #059669)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>👤</div>
              <span style={{ fontSize: 10, fontWeight: 800, color: '#059669', letterSpacing: 2, textTransform: 'uppercase' }}>Billed To</span>
            </div>
            <div style={{ fontWeight: 800, fontSize: 17, color: '#0f172a', marginBottom: 6 }}>{invoice.customerName}</div>
            <div style={{ fontSize: 13, color: '#475569', lineHeight: 2 }}>
              <div>📧 {invoice.customerEmail || '—'}</div>
              <div>📞 {invoice.customerPhone || '—'}</div>
            </div>
          </div>

          {/* Ship To */}
          <div style={{ padding: '28px 48px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: 4, height: '100%', background: 'linear-gradient(180deg, #3b82f6, #1d4ed8)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>📦</div>
              <span style={{ fontSize: 10, fontWeight: 800, color: '#1d4ed8', letterSpacing: 2, textTransform: 'uppercase' }}>Ship To</span>
            </div>
            <div style={{ fontWeight: 800, fontSize: 17, color: '#0f172a', marginBottom: 6 }}>{invoice.shippingAddress.fullName}</div>
            <div style={{ fontSize: 13, color: '#475569', lineHeight: 2 }}>
              <div>📍 {invoice.shippingAddress.street}</div>
              <div>&nbsp;&nbsp;&nbsp;&nbsp;{invoice.shippingAddress.city}, {invoice.shippingAddress.state} {invoice.shippingAddress.zipCode}</div>
              <div>&nbsp;&nbsp;&nbsp;&nbsp;{invoice.shippingAddress.country || 'India'}</div>
              {invoice.shippingAddress.phone && <div>📞 {invoice.shippingAddress.phone}</div>}
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════
            ORDER META STRIP — 4 unique stat cards
        ══════════════════════════════════════════ */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', background: '#0f172a' }}>
          {[
            { icon: '📅', label: 'Order Date', value: orderDate, accent: '#10b981' },
            { icon: '💳', label: 'Payment Method', value: invoice.paymentMethod, accent: '#f59e0b' },
            { icon: '🚚', label: 'Expected Delivery', value: deliveryDate, accent: '#3b82f6' },
            { icon: '🏭', label: 'Dispatched From', value: invoice.warehouse.name, accent: '#a855f7' },
          ].map((item, i) => (
            <div key={i} style={{
              padding: '18px 24px',
              borderRight: i < 3 ? '1px solid #1e293b' : 'none',
              borderTop: '3px solid ' + item.accent,
            }}>
              <div style={{ fontSize: 18, marginBottom: 6 }}>{item.icon}</div>
              <div style={{ fontSize: 10, color: '#64748b', fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: item.accent, lineHeight: 1.4 }}>{item.value}</div>
            </div>
          ))}
        </div>

        {/* ══════════════════════════════════════════
            ITEMS TABLE — premium striped design
        ══════════════════════════════════════════ */}
        <div style={{ padding: '36px 48px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <div style={{ width: 4, height: 22, background: 'linear-gradient(180deg, #10b981, #059669)', borderRadius: 2 }} />
            <span style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', letterSpacing: 1, textTransform: 'uppercase' }}>Order Items</span>
            <span style={{ marginLeft: 8, background: '#dcfce7', color: '#059669', fontSize: 11, fontWeight: 700, padding: '2px 10px', borderRadius: 20 }}>
              {invoice.items.length} {invoice.items.length === 1 ? 'item' : 'items'}
            </span>
          </div>

          <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            {/* Table header */}
            <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr 80px 130px 100px 130px', background: '#0f172a', padding: '14px 20px', gap: 8 }}>
              {[
                { label: '#', align: 'center' },
                { label: 'Product Description', align: 'left' },
                { label: 'Qty', align: 'center' },
                { label: 'Unit Price', align: 'right' },
                { label: 'Discount', align: 'center' },
                { label: 'Line Total', align: 'right' },
              ].map((col, i) => (
                <div key={i} style={{
                  fontSize: 10, fontWeight: 800, letterSpacing: 1.5,
                  textTransform: 'uppercase', color: '#94a3b8',
                  textAlign: col.align as CSSProperties['textAlign'],
                }}>{col.label}</div>
              ))}
            </div>

            {/* Table rows */}
            {invoice.items.map((item, idx) => (
              <div key={`${item.productId}-${idx}`} style={{
                display: 'grid', gridTemplateColumns: '40px 1fr 80px 130px 100px 130px',
                padding: '16px 20px', gap: 8, alignItems: 'center',
                background: idx % 2 === 0 ? '#ffffff' : '#f8fafc',
                borderTop: '1px solid #f1f5f9',
              }}>
                {/* # */}
                <div style={{ textAlign: 'center' }}>
                  <span style={{ width: 26, height: 26, borderRadius: 8, background: '#f1f5f9', color: '#64748b', fontSize: 11, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                    {idx + 1}
                  </span>
                </div>

                {/* Product */}
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#0f172a', marginBottom: 2 }}>{item.name}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>SKU: {item.productId.padStart(6, '0')}</div>
                </div>

                {/* Qty */}
                <div style={{ textAlign: 'center' }}>
                  <span style={{
                    background: '#f0fdf4', color: '#059669', fontWeight: 800, fontSize: 13,
                    padding: '4px 12px', borderRadius: 20, border: '1px solid #bbf7d0',
                  }}>{item.quantity}</span>
                </div>

                {/* Unit Price */}
                <div style={{ textAlign: 'right', fontWeight: 600, fontSize: 13, color: '#334155' }}>
                  {fmt.format(item.unitPrice)}
                </div>

                {/* Discount */}
                <div style={{ textAlign: 'center' }}>
                  {item.discountPercent > 0 ? (
                    <span style={{ background: '#fef3c7', color: '#d97706', fontWeight: 700, fontSize: 12, padding: '3px 10px', borderRadius: 20, border: '1px solid #fde68a' }}>
                      -{item.discountPercent}%
                    </span>
                  ) : (
                    <span style={{ color: '#cbd5e1', fontSize: 13 }}>—</span>
                  )}
                </div>

                {/* Line Total */}
                <div style={{ textAlign: 'right', fontWeight: 800, fontSize: 14, color: '#0f172a' }}>
                  {fmt.format(item.lineTotal)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════
            TOTALS + PAYMENT INFO
        ══════════════════════════════════════════ */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 32, padding: '32px 48px' }}>

          {/* Left — Payment + Warehouse */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Payment card */}
            <div style={{ background: '#f8fafc', borderRadius: 12, padding: '20px 24px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: '#94a3b8', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Payment Information</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>💳</div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 15, color: '#0f172a' }}>{invoice.paymentMethod}</div>
                  <div style={{ fontSize: 12, color: '#10b981', fontWeight: 600 }}>✓ Payment Confirmed</div>
                </div>
              </div>
            </div>

            {/* Warehouse card */}
            <div style={{ background: '#f8fafc', borderRadius: 12, padding: '20px 24px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: '#94a3b8', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Dispatched From</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: '#ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🏭</div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 15, color: '#0f172a' }}>{invoice.warehouse.name}</div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>{invoice.warehouse.city}, {invoice.warehouse.state}, {invoice.warehouse.country}</div>
                </div>
              </div>
            </div>

            {/* Terms */}
            <div style={{ background: '#fffbeb', borderRadius: 12, padding: '16px 20px', border: '1px solid #fde68a' }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: '#d97706', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>Terms & Conditions</div>
              <ul style={{ margin: 0, padding: '0 0 0 16px', fontSize: 12, color: '#78716c', lineHeight: 2 }}>
                <li>All products are 100% organic and certified</li>
                <li>Returns accepted within 7 days of delivery</li>
                <li>For queries: support@organicfood.in</li>
              </ul>
            </div>
          </div>

          {/* Right — Summary box */}
          <div style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', alignSelf: 'start' }}>
            <div style={{ background: '#0f172a', padding: '14px 20px' }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', letterSpacing: 2, textTransform: 'uppercase' }}>Order Summary</span>
            </div>

            <div style={{ background: '#fff', padding: '8px 0' }}>
              <SummaryRow label="Items Subtotal" value={fmt.format(invoice.subtotal + invoice.quantityDiscount)} />
              {invoice.quantityDiscount > 0 && <SummaryRow label="Quantity Discount" value={`− ${fmt.format(invoice.quantityDiscount)}`} green />}
              {invoice.bundleDiscount > 0 && <SummaryRow label="Bundle Discount" value={`− ${fmt.format(invoice.bundleDiscount)}`} green />}
              {invoice.loyaltyDiscount > 0 && <SummaryRow label="Loyalty Discount" value={`− ${fmt.format(invoice.loyaltyDiscount)}`} green />}
              {invoice.couponDiscount > 0 && <SummaryRow label="Coupon Discount" value={`− ${fmt.format(invoice.couponDiscount)}`} green />}
              <SummaryRow
                label="Shipping Charges"
                value={invoice.shipping === 0 ? '🎉 FREE' : fmt.format(invoice.shipping)}
                green={invoice.shipping === 0}
              />
              <SummaryRow label="GST / Tax" value={fmt.format(invoice.tax)} />
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: 'linear-gradient(90deg, #10b981, #3b82f6, #a855f7)' }} />

            {/* Grand total */}
            <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', padding: '20px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ color: '#94a3b8', fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>Grand Total</div>
                  <div style={{ color: '#64748b', fontSize: 11 }}>Inclusive of all taxes</div>
                </div>
                <div style={{
                  fontSize: 26, fontWeight: 900,
                  background: 'linear-gradient(135deg, #10b981, #34d399)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}>{fmt.format(invoice.total)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════
            DELIVERY TIMELINE
        ══════════════════════════════════════════ */}
        <div style={{ margin: '0 48px 36px', borderRadius: 14, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
          <div style={{ background: '#0f172a', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 16 }}>🚚</span>
            <span style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', letterSpacing: 2, textTransform: 'uppercase' }}>Delivery Timeline</span>
          </div>
          <div style={{ background: '#f8fafc', padding: '28px 32px', display: 'grid', gridTemplateColumns: `repeat(${invoice.trackingTimeline.length}, 1fr)`, gap: 0 }}>
            {invoice.trackingTimeline.map((stage, idx) => {
              const isLast = idx === invoice.trackingTimeline.length - 1
              return (
                <div key={stage.key} style={{ textAlign: 'center', position: 'relative' }}>
                  {/* connector */}
                  {!isLast && (
                    <div style={{
                      position: 'absolute', top: 18, left: '50%', width: '100%', height: 3,
                      background: stage.completed ? 'linear-gradient(90deg, #10b981, #34d399)' : '#e2e8f0',
                      zIndex: 0,
                    }} />
                  )}
                  {/* dot */}
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%', margin: '0 auto 10px',
                    background: stage.completed ? 'linear-gradient(135deg, #10b981, #059669)' : '#e2e8f0',
                    border: `3px solid ${stage.completed ? '#059669' : '#cbd5e1'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    position: 'relative', zIndex: 1,
                    boxShadow: stage.completed ? '0 0 0 4px rgba(16,185,129,0.15)' : 'none',
                  }}>
                    <span style={{ color: stage.completed ? '#fff' : '#94a3b8', fontSize: 14, fontWeight: 900 }}>
                      {stage.completed ? '✓' : '○'}
                    </span>
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: stage.completed ? '#059669' : '#94a3b8', marginBottom: 3, letterSpacing: 0.3 }}>
                    {(stage as any).labelKey ? t((stage as any).labelKey) : stage.label}
                  </div>
                  <div style={{
                    fontSize: 10, color: stage.completed ? '#64748b' : '#cbd5e1',
                    background: stage.completed ? '#dcfce7' : '#f1f5f9',
                    display: 'inline-block', padding: '2px 8px', borderRadius: 10, fontWeight: 600,
                  }}>
                    {new Date(stage.timestamp).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ══════════════════════════════════════════
            FOOTER
        ══════════════════════════════════════════ */}
        <div style={{ background: '#0f172a', padding: '0' }}>
          {/* rainbow divider */}
          <div style={{ height: 4, background: 'linear-gradient(90deg, #10b981 0%, #3b82f6 33%, #a855f7 66%, #f59e0b 100%)' }} />
          <div style={{ padding: '20px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 18 }}>🌿</span>
              <span style={{ color: '#475569', fontSize: 12 }}>This is a computer-generated invoice. No signature required.</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: '#10b981', fontWeight: 700, fontSize: 13 }}>Organic Food Store</div>
              <div style={{ color: '#475569', fontSize: 11 }}>© {new Date().getFullYear()} organicfood.in · All rights reserved</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

function SummaryRow({ label, value, green }: { label: string; value: string; green?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 20px', borderBottom: '1px solid #f8fafc' }}>
      <span style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 700, color: green ? '#10b981' : '#0f172a' }}>{value}</span>
    </div>
  )
}
