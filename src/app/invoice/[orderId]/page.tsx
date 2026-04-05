'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import type { InvoiceData } from '@/lib/invoiceData'
import { InvoiceTemplate } from '@/components/invoice/InvoiceTemplate'
import { DownloadPdfButton } from '@/components/invoice/DownloadPdfButton'
import { createTranslator } from '@/lib/i18n'

const t = createTranslator('en')

export default function InvoicePage() {
  const { orderId } = useParams<{ orderId: string }>()
  const router = useRouter()
  const [invoice, setInvoice] = useState<InvoiceData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!orderId) return
    fetch(`/api/orders/${orderId}/invoice`)
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setInvoice(json.data)
        else setError(json.error || 'Order not found')
      })
      .catch(() => setError('Failed to load invoice'))
  }, [orderId])

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
        <p className="text-lg text-red-600">{error}</p>
        <Link href="/" className="rounded-lg bg-green-600 px-6 py-3 font-bold text-white hover:bg-green-700">
          Return to Home
        </Link>
      </div>
    )
  }

  if (!invoice) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-green-600" />
      </div>
    )
  }

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { margin: 0; background: white; }
          @page { size: A4; margin: 0; }
        }
      `}</style>

      <div className="no-print sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="flex w-full flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-green-700">Invoice</p>
            <p className="text-lg font-bold text-slate-900">{invoice.orderId}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <DownloadPdfButton invoice={invoice} />
            <Link
              href={`/track-order/${invoice.orderId}`}
              className="inline-flex items-center gap-2 rounded-lg border border-green-600 px-4 py-2 text-sm font-semibold text-green-700 transition hover:bg-green-50"
            >
              Track Order
            </Link>
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              ← Back
            </button>
          </div>
        </div>
      </div>

      <InvoiceTemplate invoice={invoice} t={t} />
    </>
  )
}
