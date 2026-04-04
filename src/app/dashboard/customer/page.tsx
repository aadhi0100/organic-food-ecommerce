'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import { useRouter } from 'next/navigation'
import { ShoppingCart, Package, TrendingUp, Gift, Award, History, Tag, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import type { Order, CartItem } from '@/types'
import { formatIndianCurrency } from '@/utils/indianFormat'
import { SafeImage } from '@/components/SafeImage'

interface CartHistory {
  date: string
  items: CartItem[]
  total: number
}

export default function CustomerDashboard() {
  const { user } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [cartHistory, setCartHistory] = useState<CartHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [loyaltyPoints, setLoyaltyPoints] = useState(0)
  const [discountTier, setDiscountTier] = useState('Bronze')
  const [discountPercentage, setDiscountPercentage] = useState(0)
  const [totalCarts, setTotalCarts] = useState(0)

  useEffect(() => {
    if (!user || user.role !== 'customer') {
      router.push('/login')
      return
    }

    const controller = new AbortController()

    fetch('/api/orders', { signal: controller.signal })
      .then((r) => r.json())
      .then((ordersData) => {
        const userOrders = Array.isArray(ordersData) ? ordersData : []
        setOrders(userOrders)
        setTotalCarts(userOrders.length)

        const totalSpent = userOrders.reduce((sum: number, o: Order) => sum + o.total, 0)
        const points = Math.floor(totalSpent * 10)
        setLoyaltyPoints(points)

        if (totalSpent >= 50000) {
          setDiscountTier('Platinum')
          setDiscountPercentage(20)
        } else if (totalSpent >= 30000) {
          setDiscountTier('Gold')
          setDiscountPercentage(15)
        } else if (totalSpent >= 15000) {
          setDiscountTier('Silver')
          setDiscountPercentage(10)
        } else if (totalSpent >= 5000) {
          setDiscountTier('Bronze')
          setDiscountPercentage(5)
        }

        const history: CartHistory[] = userOrders.map((order: Order) => ({
          date: order.createdAt,
          items: order.items,
          total: order.total,
        }))
        setCartHistory(history)

        const savedCartHistory = localStorage.getItem(`cartHistory_${user.id}`)
        if (savedCartHistory) {
          try {
            const parsedHistory = JSON.parse(savedCartHistory) as CartHistory[]
            setCartHistory((prev) => [...parsedHistory, ...prev])
          } catch { /* ignore malformed localStorage */ }
        }
      })
      .catch((err) => {
        if (err.name !== 'AbortError') console.error('Failed to load orders:', err)
      })
      .finally(() => setLoading(false))

    return () => controller.abort()
  }, [user, router])



  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-green-600" />
      </div>
    )
  }

  const totalSpent = orders.reduce((sum, o) => sum + o.total, 0)
  const totalOrders = orders.length
  const averageOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Platinum':
        return 'from-gray-400 to-gray-600'
      case 'Gold':
        return 'from-yellow-400 to-yellow-600'
      case 'Silver':
        return 'from-gray-300 to-gray-500'
      default:
        return 'from-orange-400 to-orange-600'
    }
  }

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'Platinum':
        return '💎'
      case 'Gold':
        return '🏆'
      case 'Silver':
        return '🥈'
      default:
        return '🥉'
    }
  }

  const progressLabel = discountTier === 'Platinum' ? t('progressToMaxTier') : t('progressToNextTier')
  const progressTarget =
    discountTier === 'Platinum'
      ? t('maxTier')
      : discountTier === 'Gold'
        ? '₹50,000'
        : discountTier === 'Silver'
          ? '₹30,000'
          : '₹15,000'

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-3 py-6 sm:px-4 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="mb-1 text-3xl font-bold text-gray-900 sm:mb-2 sm:text-4xl">{t('myDashboard')}</h1>
          <p className="text-sm text-gray-600 sm:text-base">
            {t('welcomeBack')}, {user?.name}!
          </p>
        </div>

        <div className="mb-6 grid gap-4 sm:mb-8 sm:gap-6 sm:grid-cols-1 lg:grid-cols-3">
          <div className={`col-span-1 rounded-xl bg-gradient-to-br ${getTierColor(discountTier)} p-4 text-white shadow-lg sm:p-6 lg:col-span-2`}>
            <div className="mb-3 flex items-center justify-between gap-3 sm:mb-4">
              <div>
                <h3 className="mb-0.5 text-base font-bold sm:mb-1 sm:text-lg">{t('loyaltyStatus')}</h3>
                <p className="text-sm text-white/80">{t('yourRewardsAndBenefits')}</p>
              </div>
              <div className="text-5xl">{getTierIcon(discountTier)}</div>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div>
                <p className="mb-1 text-sm text-white/80">{t('tier')}</p>
                <p className="text-2xl font-bold">{t(discountTier.toLowerCase())}</p>
              </div>
              <div>
                <p className="mb-1 text-sm text-white/80">{t('discount')}</p>
                <p className="text-2xl font-bold">{discountPercentage}%</p>
              </div>
              <div>
                <p className="mb-1 text-sm text-white/80">{t('points')}</p>
                <p className="text-2xl font-bold">{loyaltyPoints}</p>
              </div>
            </div>
            <div className="mt-6 rounded-lg bg-white/20 p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm">{progressLabel}</span>
                <span className="text-sm font-bold">
                  ₹{totalSpent.toFixed(0)} / {progressTarget}
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-white/30">
                <div
                  className="h-2 rounded-full bg-white transition-all duration-500"
                  style={{
                    width: `${Math.min(100, (totalSpent / (discountTier === 'Platinum' ? 50000 : discountTier === 'Gold' ? 50000 : discountTier === 'Silver' ? 30000 : 15000)) * 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-md">
            <div className="mb-4 flex items-center justify-between">
              <div className="rounded-lg bg-green-100 p-3">
                <Gift className="text-green-600" size={24} />
              </div>
            </div>
            <h3 className="mb-1 text-sm text-gray-600">{t('availableDiscount')}</h3>
            <p className="mb-2 text-3xl font-bold text-green-600">{discountPercentage}% OFF</p>
            <p className="text-sm text-gray-600">
              {t('useCode')}: <span className="font-bold">LOYAL{discountPercentage}</span>
            </p>
            <Link href="/products">
              <button className="mt-4 w-full rounded-lg bg-green-600 py-2 font-bold text-white transition hover:bg-green-700">
                {t('shopNow')}
              </button>
            </Link>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
          <div className="rounded-xl bg-white p-6 shadow-md">
            <div className="mb-4 flex items-center justify-between">
              <div className="rounded-lg bg-blue-100 p-3">
                <Package className="text-blue-600" size={24} />
              </div>
            </div>
            <h3 className="mb-1 text-sm text-gray-600">{t('totalOrders')}</h3>
            <p className="text-3xl font-bold">{totalOrders}</p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-md">
            <div className="mb-4 flex items-center justify-between">
              <div className="rounded-lg bg-green-100 p-3">
                <ShoppingBag className="text-green-600" size={24} />
              </div>
            </div>
            <h3 className="mb-1 text-sm text-gray-600">{t('totalItems')}</h3>
            <p className="text-3xl font-bold">{orders.reduce((sum, o) => sum + (o.items?.length || 0), 0)}</p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-md">
            <div className="mb-4 flex items-center justify-between">
              <div className="rounded-lg bg-purple-100 p-3">
                <TrendingUp className="text-purple-600" size={24} />
              </div>
            </div>
            <h3 className="mb-1 text-sm text-gray-600">{t('totalSpent')}</h3>
            <p className="text-3xl font-bold">{formatIndianCurrency(totalSpent)}</p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-md">
            <div className="mb-4 flex items-center justify-between">
              <div className="rounded-lg bg-orange-100 p-3">
                <ShoppingCart className="text-orange-600" size={24} />
              </div>
            </div>
            <h3 className="mb-1 text-sm text-gray-600">{t('avgOrderValue')}</h3>
            <p className="text-3xl font-bold">{formatIndianCurrency(averageOrderValue)}</p>
          </div>
        </div>

        <div className="mb-8 rounded-xl bg-white p-6 shadow-md">
          <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold">
            <Package className="text-green-600" />
            {t('orderHistoryAndTracking')}
          </h2>
          {orders.length === 0 ? (
            <div className="py-12 text-center">
              <Package className="mx-auto mb-4 text-gray-300" size={64} />
              <p className="mb-4 text-gray-600">{t('noOrdersYet')}</p>
              <Link href="/products">
                <button className="rounded-lg bg-green-600 px-6 py-3 font-bold text-white transition hover:bg-green-700">
                  {t('startShopping')}
                </button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order, idx) => (
                <div key={idx} className="rounded-lg border-2 border-gray-200 p-6 transition hover:shadow-xl">
                  <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="text-xl font-bold">{t('orderNumber')} #{order.id}</h3>
                      <p className="text-sm text-gray-600">
                        {t('placedOn')}{' '}
                        {new Date(order.orderDate || order.createdAt || new Date().toISOString()).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="text-right">
                        <p className="text-sm text-gray-600">{t('totalAmount')}</p>
                        <p className="text-2xl font-bold text-green-600">{formatIndianCurrency(order.total)}</p>
                      </div>
                      <span
                        className={`rounded-full px-4 py-1 text-sm font-bold ${
                          order.status === 'delivered'
                            ? 'bg-green-100 text-green-700'
                            : order.status === 'shipped'
                              ? 'bg-blue-100 text-blue-700'
                              : order.status === 'confirmed'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {t(order.status || 'confirmed')}
                      </span>
                    </div>
                  </div>

                  {order.trackingNumber && (
                    <div className="mb-4 rounded-lg border-2 border-green-200 bg-gradient-to-r from-green-50 to-blue-50 p-4">
                      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h4 className="flex items-center gap-2 font-bold text-green-800">
                            <Package size={20} />
                            {t('deliveryTracking')}
                          </h4>
                          <p className="mt-1 text-sm text-gray-600">
                            {t('trackingNumber')}: <span className="font-mono font-bold text-green-700">{order.trackingNumber}</span>
                          </p>
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="text-xs text-gray-600">{t('expectedDelivery')}</p>
                          <p className="font-bold text-green-700">
                            {new Date(order.deliveryDate || new Date().toISOString()).toLocaleDateString('en-IN', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="relative overflow-x-auto">
                        <div className="flex min-w-[320px] items-center justify-between">
                          <div className="flex flex-1 flex-col items-center">
                            <div
                              className={`flex h-10 w-10 items-center justify-center rounded-full ${
                                order.status ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                              }`}
                            >
                              ✓
                            </div>
                            <p className="mt-2 text-xs font-medium">{t('confirmed')}</p>
                          </div>
                          <div
                            className={`flex-1 h-1 ${
                              order.status === 'shipped' || order.status === 'delivered' ? 'bg-green-500' : 'bg-gray-300'
                            }`}
                          />
                          <div className="flex flex-1 flex-col items-center">
                            <div
                              className={`flex h-10 w-10 items-center justify-center rounded-full ${
                                order.status === 'shipped' || order.status === 'delivered'
                                  ? 'bg-green-500 text-white'
                                  : 'bg-gray-300 text-gray-600'
                              }`}
                            >
                              📦
                            </div>
                            <p className="mt-2 text-xs font-medium">{t('shipped')}</p>
                          </div>
                          <div
                            className={`flex-1 h-1 ${order.status === 'delivered' ? 'bg-green-500' : 'bg-gray-300'}`}
                          />
                          <div className="flex flex-1 flex-col items-center">
                            <div
                              className={`flex h-10 w-10 items-center justify-center rounded-full ${
                                order.status === 'delivered'
                                  ? 'bg-green-500 text-white'
                                  : 'bg-gray-300 text-gray-600'
                              }`}
                            >
                              🏠
                            </div>
                            <p className="mt-2 text-xs font-medium">{t('delivered')}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    {order.items.map((item, itemIdx) => (
                      <div key={itemIdx} className="flex flex-wrap items-center gap-4 rounded-lg bg-gray-50 p-3 sm:flex-nowrap">
                        {item.product && (
                          <>
                            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg">
                              <SafeImage src={item.product.image} alt={item.product.name} fill className="object-cover" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className="font-bold">{item.product.name}</h4>
                              <p className="text-sm text-gray-600">
                                {formatIndianCurrency(item.product.price)} × {item.quantity}
                              </p>
                            </div>
                            <div className="w-full text-left sm:w-auto sm:text-right">
                              <p className="font-bold">{formatIndianCurrency(item.product.price * item.quantity)}</p>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>

                  {order.shippingAddress && (
                    <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
                      <h4 className="mb-2 font-bold text-blue-800">{t('shippingAddress')}</h4>
                      <p className="text-sm text-gray-700">
                        {order.shippingAddress.street}, {order.shippingAddress.city}
                        <br />
                        {order.shippingAddress.state} - {order.shippingAddress.zipCode}
                        <br />
                        {order.shippingAddress.country || 'India'}
                      </p>
                    </div>
                  )}

                  <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                    {order.id && (
                      <Link
                        href={`/invoice/${order.id}`}
                        className="flex-1 rounded-lg bg-green-600 py-3 text-center font-bold text-white transition hover:bg-green-700"
                      >
                        ↓ {t('downloadInvoice')}
                      </Link>
                    )}
                    {order.trackingNumber && (
                      <button
                        onClick={() => router.push(`/track-order/${order.id}`)}
                        className="rounded-lg border-2 border-green-600 px-6 py-3 font-bold text-green-600 transition hover:bg-green-50"
                      >
                        {t('trackOrder')}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mb-8 rounded-xl bg-white p-6 shadow-md">
          <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold">
            <History className="text-green-600" />
            {t('cartHistory')}
          </h2>
          {cartHistory.length === 0 ? (
            <div className="py-12 text-center">
              <ShoppingCart className="mx-auto mb-4 text-gray-300" size={64} />
              <p className="mb-4 text-gray-600">{t('noCartHistoryYet')}</p>
              <Link href="/products">
                <button className="rounded-lg bg-green-600 px-6 py-3 font-bold text-white transition hover:bg-green-700">
                  {t('startShopping')}
                </button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {cartHistory.map((cart, idx) => (
                <div key={idx} className="rounded-lg border p-6 transition hover:shadow-lg">
                  <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-lg font-bold">{t('cart')} #{idx + 1}</h3>
                      <p className="text-sm text-gray-600">
                        {new Date(cart.date).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-sm text-gray-600">{t('total')}</p>
                      <p className="text-2xl font-bold text-green-600">₹{cart.total.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {cart.items.map((item, itemIdx) => (
                      <div key={itemIdx} className="flex flex-wrap items-center gap-4 rounded-lg bg-gray-50 p-3 sm:flex-nowrap">
                        {item.product && (
                          <>
                            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg">
                              <SafeImage src={item.product.image} alt={item.product.name} fill className="object-cover" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className="font-bold">{item.product.name}</h4>
                              <p className="text-sm text-gray-600">
                                {formatIndianCurrency(item.product.price)} × {item.quantity}
                              </p>
                            </div>
                            <div className="w-full text-left sm:w-auto sm:text-right">
                              <p className="font-bold">{formatIndianCurrency(item.product.price * item.quantity)}</p>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                  {discountPercentage > 0 && (
                    <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3">
                      <div className="flex items-center gap-2 text-green-700">
                        <Tag size={16} />
                        <span className="text-sm font-medium">
                          {t('youCouldHaveSavedWithYourDiscount', {
                            amount: formatIndianCurrency((cart.total * discountPercentage) / 100),
                            tier: t(discountTier.toLowerCase()),
                          })}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl bg-white p-6 shadow-md">
          <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold">
            <Award className="text-yellow-500" />
            {t('rewardsAndBenefits')}
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className={`rounded-lg border-2 p-4 ${discountTier === 'Bronze' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'}`}>
              <div className="mb-2 text-3xl">🥉</div>
              <h3 className="mb-1 font-bold">{t('bronze')}</h3>
              <p className="mb-2 text-sm text-gray-600">{t('spendAtLeastAmount', { amount: '₹5,000+' })}</p>
              <p className="text-lg font-bold text-orange-600">{t('discount5Off')}</p>
            </div>
            <div className={`rounded-lg border-2 p-4 ${discountTier === 'Silver' ? 'border-gray-500 bg-gray-50' : 'border-gray-200'}`}>
              <div className="mb-2 text-3xl">🥈</div>
              <h3 className="mb-1 font-bold">{t('silver')}</h3>
              <p className="mb-2 text-sm text-gray-600">{t('spendAtLeastAmount', { amount: '₹15,000+' })}</p>
              <p className="text-lg font-bold text-gray-600">{t('discount10Off')}</p>
            </div>
            <div className={`rounded-lg border-2 p-4 ${discountTier === 'Gold' ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200'}`}>
              <div className="mb-2 text-3xl">🏆</div>
              <h3 className="mb-1 font-bold">{t('gold')}</h3>
              <p className="mb-2 text-sm text-gray-600">{t('spendAtLeastAmount', { amount: '₹30,000+' })}</p>
              <p className="text-lg font-bold text-yellow-600">{t('discount15Off')}</p>
            </div>
            <div className={`rounded-lg border-2 p-4 ${discountTier === 'Platinum' ? 'border-gray-600 bg-gray-50' : 'border-gray-200'}`}>
              <div className="mb-2 text-3xl">💎</div>
              <h3 className="mb-1 font-bold">{t('platinum')}</h3>
              <p className="mb-2 text-sm text-gray-600">{t('spendAtLeastAmount', { amount: '₹50,000+' })}</p>
              <p className="text-lg font-bold text-gray-700">{t('discount20Off')}</p>
            </div>
          </div>
        </div>
      </div>


    </div>
  )
}
