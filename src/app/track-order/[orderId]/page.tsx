'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Clock3, MapPin, PackageCheck, Truck, Warehouse, Zap, Package, Clock } from 'lucide-react'
import type { TrackingEvent, Order } from '@/types'
import { formatIndianCurrency } from '@/utils/indianFormat'
import { useLanguage } from '@/context/LanguageContext'
import { DELIVERY_CONFIG, type DeliveryType } from '@/lib/tracking'

type TrackingResponse = {
  order: Order & { deliveryType?: DeliveryType }
  tracking: {
    timeline: TrackingEvent[]
    activeStage?: TrackingEvent
    completedCount: number
    progress: number
    deliveryType?: DeliveryType
  }
}

const iconMap = {
  warehouse: Warehouse,
  packaging: PackageCheck,
  on_the_way: Truck,
  delivered: Clock3,
}

const deliveryTypeConfig: Record<DeliveryType, { icon: typeof Zap; color: string; bg: string; border: string; subtitle: string }> = {
  express: { icon: Zap, color: 'text-orange-600', bg: 'bg-orange-100', border: 'border-orange-300', subtitle: 'Same-day priority delivery' },
  standard: { icon: Package, color: 'text-green-700', bg: 'bg-green-100', border: 'border-green-300', subtitle: '3-day standard delivery route' },
  economy: { icon: Clock, color: 'text-blue-700', bg: 'bg-blue-100', border: 'border-blue-300', subtitle: '7-day economy freight route' },
}

function translateApiMessage(message: string | undefined, t: (key: string, params?: Record<string, string | number>) => string) {
  if (!message) return ''
  const known: Record<string, string> = {
    'Tracking information not found': 'trackingInformationNotFound',
    'Unable to load tracking data': 'unableToLoadTrackingData',
    'Tracking unavailable': 'trackingUnavailable',
    'We could not find that order.': 'weCouldNotFindThatOrder',
  }
  const key = known[message]
  return key ? t(key) : t(message)
}

export default function TrackOrderPage() {
  const params = useParams<{ orderId: string }>()
  const orderId = params?.orderId || ''
  const [data, setData] = useState<TrackingResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { t } = useLanguage()

  useEffect(() => {
    if (!orderId) return

    let mounted = true

    const load = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}/tracking`, { credentials: 'include' })
        if (!res.ok) throw new Error(t('trackingInformationNotFound'))
        const json = (await res.json()) as TrackingResponse
        if (mounted) {
          setData(json)
          setError('')
          setLoading(false)
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? translateApiMessage(err.message, t) || err.message : t('unableToLoadTrackingData'))
          setLoading(false)
        }
      }
    }

    load()
    const interval = window.setInterval(load, 15000)
    return () => {
      mounted = false
      window.clearInterval(interval)
    }
  }, [orderId, t])

  const activeIndex = useMemo(() => {
    if (!data) return 0
    return Math.max(0, data.tracking.timeline.findIndex((item) => item.key === data.tracking.activeStage?.key))
  }, [data])

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-green-200 border-t-green-600" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-14">
        <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
          <h1 className="text-2xl font-bold text-red-800">{t('trackingUnavailable')}</h1>
          <p className="mt-2 text-red-700">{error || t('weCouldNotFindThatOrder')}</p>
          <Link href="/dashboard/customer" className="mt-6 inline-flex rounded-full bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700">
            {t('backToDashboard')}
          </Link>
        </div>
      </div>
    )
  }

  const deliveryType: DeliveryType = data.order.deliveryType || data.tracking.deliveryType || 'standard'
  const dtConfig = deliveryTypeConfig[deliveryType]
  const DeliveryIcon = dtConfig.icon
  const deliveryLabel = DELIVERY_CONFIG[deliveryType].label

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#dcfce7,_#f8fafc_40%,_#eef7ef_100%)] px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <p className="text-sm uppercase tracking-[0.25em] text-green-700">{t('liveTracking')}</p>
              <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-0.5 text-xs font-bold ${dtConfig.bg} ${dtConfig.border} ${dtConfig.color}`}>
                <DeliveryIcon className="h-3 w-3" />
                {deliveryLabel}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900">
              {t('orderId')} {data.order.id}
            </h1>
            <p className="mt-1 text-sm text-slate-600">{dtConfig.subtitle}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href={`/invoice/${data.order.id}`} className="rounded-full border border-green-600 px-5 py-3 text-sm font-semibold text-green-700 transition hover:bg-green-50">
              {t('viewInvoice')}
            </Link>
            <Link href="/dashboard/customer" className="rounded-full bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700">
              {t('orderHistory')}
            </Link>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <section className="overflow-hidden rounded-[2rem] border border-white/60 bg-white/90 shadow-2xl backdrop-blur">
            <div className="border-b border-slate-100 bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-7 text-white">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-green-100">{t('warehouseMovement')}</p>
                  <h2 className="mt-2 text-2xl font-bold">{t('tamilNaduCentralWarehouse')}</h2>
                  <p className="mt-1 text-sm text-green-50/90">{dtConfig.subtitle}</p>
                </div>
                <div className="rounded-2xl bg-white/15 px-5 py-4 text-right">
                  <p className="text-xs uppercase tracking-[0.2em] text-green-100">{t('progress')}</p>
                  <p className="text-3xl font-black">{data.tracking.progress}%</p>
                </div>
              </div>
              <div className="mt-6 h-3 rounded-full bg-white/20">
                <div className="h-3 rounded-full bg-white transition-all duration-500" style={{ width: `${data.tracking.progress}%` }} />
              </div>
            </div>

            <div className="space-y-6 px-8 py-8">
              {data.tracking.timeline.map((stage, index) => {
                const Icon = iconMap[stage.key]
                const active = index <= activeIndex
                return (
                  <div key={stage.key} className="grid gap-4 lg:grid-cols-[1fr_auto]">
                    <div className={`rounded-3xl border p-5 transition ${active ? 'border-green-200 bg-green-50 shadow-sm' : 'border-slate-200 bg-slate-50'}`}>
                      <div className="flex items-start gap-4">
                        <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${active ? 'bg-green-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <h3 className="text-lg font-bold text-slate-900">
                              {t((stage as any).labelKey || stage.label)}
                            </h3>
                            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${active ? 'bg-green-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                              {stage.completed ? t('completed') : t('pending')}
                            </span>
                          </div>
                          <p className="mt-2 text-sm leading-6 text-slate-600">
                            {t((stage as any).descriptionKey || stage.description)}
                          </p>
                          <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-500">
                            <span className="inline-flex items-center gap-2">
                              <Clock3 className="h-4 w-4" />
                              {new Date(stage.timestamp).toLocaleString('en-IN', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                            <span className="inline-flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              {stage.location}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-[2rem] border border-white/60 bg-white/90 p-6 shadow-xl backdrop-blur">
              <p className="text-xs uppercase tracking-[0.25em] text-green-700">{t('shipment')}</p>
              <div className="mt-3 space-y-3 text-sm text-slate-600">
                <div className="flex justify-between gap-4">
                  <span>{t('trackingNumber')}</span>
                  <strong className="text-slate-900">{data.order.trackingNumber}</strong>
                </div>
                <div className="flex justify-between gap-4">
                  <span>{t('expectedDelivery')}</span>
                  <strong className="text-slate-900">
                    {new Date(data.order.deliveryDate || '').toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </strong>
                </div>
                <div className="flex justify-between gap-4">
                  <span>{t('orderTotal')}</span>
                  <strong className="text-green-700">{formatIndianCurrency(data.order.total)}</strong>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/60 bg-slate-950 p-6 text-white shadow-xl">
              <p className="text-xs uppercase tracking-[0.25em] text-green-200">{t('deliveryPath')}</p>
              <div className="mt-4 space-y-4">
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-sm font-semibold">{t('origin')}</p>
                  <p className="mt-1 text-sm text-slate-300">{t('tamilNaduCentralWarehouse')}</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-sm font-semibold">{t('currentStage')}</p>
                  <p className="mt-1 text-sm text-slate-300">{t((data.tracking.activeStage as any)?.labelKey || data.tracking.activeStage?.label || 'trackingWarehouse')}</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-sm font-semibold">{t('destination')}</p>
                  <p className="mt-1 text-sm text-slate-300">
                    {data.order.shippingAddress.city}, {data.order.shippingAddress.state}
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
