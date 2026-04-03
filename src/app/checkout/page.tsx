'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/hooks/useCart'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import { formatPrice } from '@/utils/format'
import { MapPin } from 'lucide-react'
import { IndianPaymentMethods } from '@/components/IndianPaymentMethods'
import type { Address } from '@/types'
import { LocationPicker } from '@/components/LocationPicker'
import { SafeImage } from '@/components/SafeImage'
import { calculatePricing } from '@/lib/pricing'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, clearCart, hydrateProducts, cartId } = useCart()
  const { user, isLoading } = useAuth()
  const { t } = useLanguage()
  const [isProcessing, setIsProcessing] = useState(false)
  const [customerSpend, setCustomerSpend] = useState(0)
  const [couponCode, setCouponCode] = useState('')
  const [address, setAddress] = useState<Address>({
    fullName: '',
    street: 'No. 1, Anna Salai, Teynampet, Chennai',
    city: 'Chennai',
    state: 'Tamil Nadu',
    zipCode: '600018',
    phone: '+91 9445231232',
  })
  const [useNewAddress, setUseNewAddress] = useState(false)
  const [deliveryLocation, setDeliveryLocation] = useState<{ lat: number; lng: number; address: string } | null>(null)
  const [paymentMethod, setPaymentMethod] = useState('cod')

  useEffect(() => {
    if (!isLoading && !user) router.push('/login?redirect=/checkout')
    if (user) setAddress((prev) => ({ ...prev, fullName: user.name || '' }))
  }, [user, isLoading, router])

  useEffect(() => {
    if (!user) return
    fetch(`/api/orders?userId=${encodeURIComponent(user.id)}`)
      .then((res) => res.json())
      .then((orders: any[]) => {
        const spent = Array.isArray(orders) ? orders.reduce((sum, o) => sum + Number(o.total || 0), 0) : 0
        setCustomerSpend(spent)
      })
      .catch(() => setCustomerSpend(0))
  }, [user])

  useEffect(() => { if (items.length === 0) router.push('/cart') }, [items, router])
  useEffect(() => { hydrateProducts() }, [hydrateProducts])
  useEffect(() => {
    if (typeof window === 'undefined') return
    setCouponCode(window.localStorage.getItem('pendingCouponCode') || '')
  }, [])

  const pricing = calculatePricing(
    items.filter((item) => item.product).map((item) => ({
      productId: item.productId,
      name: item.product?.name || t('product'),
      quantity: item.quantity,
      unitPrice: item.product?.price || 0,
    })),
    { customerSpend, couponCode },
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) { router.push('/login?redirect=/checkout'); return }
    setIsProcessing(true)
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: address.fullName,
          customerEmail: user.email,
          customerPhone: address.phone,
          cartId,
          couponCode,
          items: items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
          paymentMethod: paymentMethod === 'cod' ? t('cashOnDelivery') : paymentMethod === 'upi' ? 'UPI' : paymentMethod === 'card' ? 'Credit/Debit Card' : 'Net Banking',
          deliveryType: 'standard',
          shippingAddress: { fullName: address.fullName, street: address.street, city: address.city, state: address.state, zipCode: address.zipCode, phone: address.phone, country: 'India' },
        }),
      })
      if (response.ok) {
        const order = await response.json()
        clearCart()
        if (typeof window !== 'undefined') window.localStorage.removeItem('pendingCouponCode')
        router.push(`/order-success?orderId=${order.id}`)
      } else {
        alert(t('orderFailedTryAgain'))
      }
    } catch {
      alert(t('orderFailedTryAgain'))
    } finally {
      setIsProcessing(false)
    }
  }

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center dark:bg-gray-900"><div className="h-12 w-12 animate-spin rounded-full border-b-2 border-green-600" /></div>
  }
  if (!user || items.length === 0) return null

  const inputCls = 'w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-transparent focus:ring-2 focus:ring-green-500'
  const labelCls = 'mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-4xl font-bold text-gray-900 dark:text-white">{t('checkout')}</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow-md">
              <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-white">
                <MapPin className="text-green-600" />{t('shippingAddress')}
              </h2>
              <div className="mb-4">
                <label className="flex cursor-pointer items-center gap-2">
                  <input type="checkbox" checked={useNewAddress} onChange={(e) => setUseNewAddress(e.target.checked)} className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-gray-700 dark:text-gray-300">{t('useDifferentAddress')}</span>
                </label>
              </div>
              {!useNewAddress ? (
                <div className="rounded-lg bg-gray-50 dark:bg-gray-700 p-4">
                  <p className="font-medium text-gray-900 dark:text-white">{address.fullName}</p>
                  <p className="text-gray-600 dark:text-gray-400">{address.phone}</p>
                  <p className="text-gray-600 dark:text-gray-400">{address.city}, {address.state}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className={labelCls}>{t('name')}</label>
                    <input type="text" required value={address.fullName} onChange={(e) => setAddress({ ...address, fullName: e.target.value })} className={inputCls} />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelCls}>{t('address')}</label>
                    <input type="text" required value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>{t('city')}</label>
                    <input type="text" required value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>{t('state')}</label>
                    <input type="text" required value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>{t('zipCode')}</label>
                    <input type="text" required value={address.zipCode} onChange={(e) => setAddress({ ...address, zipCode: e.target.value })} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>{t('phone')}</label>
                    <input type="tel" required value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} placeholder="+91 9445231232" className={inputCls} />
                  </div>
                </div>
              )}
              <div className="mt-6">
                <label className={labelCls}>{t('pinDeliveryLocation')}</label>
                <LocationPicker
                  onLocationSelect={(location) => { setDeliveryLocation(location); setAddress((prev) => ({ ...prev, street: location.address })) }}
                  initialLocation={deliveryLocation || undefined}
                />
              </div>
            </div>

            <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow-md">
              <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-white">
                <span className="text-green-600">₹</span>{t('paymentMethod')}
              </h2>
              <IndianPaymentMethods selected={paymentMethod} onSelect={setPaymentMethod} />
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-lg bg-white dark:bg-gray-800 p-6 shadow-md">
              <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">{t('orderSummary')}</h2>
              <div className="mb-6 max-h-64 space-y-3 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.productId} className="flex gap-3">
                    <div className="relative h-16 w-16 flex-shrink-0 rounded bg-gray-100 dark:bg-gray-700">
                      <SafeImage src={item.product?.image} alt={item.product?.name || t('product')} fill className="rounded object-cover" sizes="64px" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{item.product?.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{t('quantity')}: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{formatPrice((item.product?.price || 0) * item.quantity)}</p>
                  </div>
                ))}
              </div>
              <div className="mb-6 space-y-3 border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{t('subtotal')}</span>
                  <span className="font-medium text-gray-900 dark:text-white">{formatPrice(pricing.itemsTotal)}</span>
                </div>
                {pricing.totalDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>{t('discount')}</span>
                    <span>-{formatPrice(pricing.totalDiscount)}</span>
                  </div>
                )}
                {pricing.shipping > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{t('shipping')}</span>
                    <span className="font-medium text-gray-900 dark:text-white">{formatPrice(pricing.shipping)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{t('tax')} (5%)</span>
                  <span className="font-medium text-gray-900 dark:text-white">{formatPrice(pricing.tax)}</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-3 text-xl font-bold">
                  <span className="text-gray-900 dark:text-white">{t('total')}</span>
                  <span className="text-green-600">{formatPrice(pricing.grandTotal)}</span>
                </div>
              </div>
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full rounded-lg bg-green-600 py-4 font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {isProcessing ? `${t('placeOrder')}...` : t('placeOrder')}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
