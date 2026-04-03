import Link from 'next/link'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { buildInvoiceData } from '@/lib/invoiceData'
import { InvoiceTemplate } from '@/components/invoice/InvoiceTemplate'
import { LANGUAGE_COOKIE_NAME, createTranslator, normalizeLanguage } from '@/lib/i18n'
import { DownloadPdfButton } from '@/components/invoice/DownloadPdfButton'

export const metadata = {
  title: 'Invoice',
}

export default async function InvoicePage({
  params,
}: {
  params: Promise<{ orderId: string }>
}) {
  const { orderId } = await params
  const order = await db.orders.findById(orderId)

  if (!order) {
    notFound()
  }

  const language = normalizeLanguage(cookies().get(LANGUAGE_COOKIE_NAME)?.value)
  const t = createTranslator(language)
  const invoice = await buildInvoiceData(order)

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { margin: 0; background: white; }
          @page { size: A4; margin: 0; }
        }
      `}</style>

      {/* Action bar */}
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
            <Link
              href="/dashboard/customer"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              ← Dashboard
            </Link>
          </div>
        </div>
      </div>

      <InvoiceTemplate invoice={invoice} t={t} />
    </>
  )
}
