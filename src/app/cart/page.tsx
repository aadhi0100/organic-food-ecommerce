'use client'

import { useState, useEffect } from 'react'
import { useCart } from '@/hooks/useCart'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import Link from 'next/link'
import { Trash2, Plus, Minus, ShoppingBag, History, TrendingUp, Calendar, Package } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { Order } from '@/types'
import { SafeImage } from '@/components/SafeImage'
import { calculatePricing } from '@/lib/pricing'

interface CartHistoryItem {
  date: string
  items: number
  total: number
  orderId: string
}

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal, hydrateProducts } = useCart()
  const { user } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()
  const [cartHistory, setCartHistory] = useState<CartHistoryItem[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [totalSpent, setTotalSpent] = useState(0)
  const [averageCart, setAverageCart] = useState(0)
  const [discountCode, setDiscountCode] = useState('')
  const [discount, setDiscount] = useState(0)

  useEffect(() => {
    if (user) {
      fetch('/api/orders')
        .then((r) => r.json())
        .then((orders: Order[]) => {
          const userOrders = Array.isArray(orders) ? orders : []
          const history: CartHistoryItem[] = userOrders.map((order) => ({
            date: order.createdAt,
            items: order.items.length,
            total: order.total,
            orderId: order.id,
          }))
          setCartHistory(history)
          const spent = userOrders.reduce((sum, o) => sum + o.total, 0)
          setTotalSpent(spent)
          setAverageCart(userOrders.length > 0 ? spent / userOrders.length : 0)
          if (spent >= 50000) setDiscount(20)
          else if (spent >= 30000) setDiscount(15)
          else if (spent >= 15000) setDiscount(10)
          else if (spent >= 5000) setDiscount(5)
        })
    }
  }, [user])

  useEffect(() => { hydrateProducts() }, [hydrateProducts])

  const pricing = calculatePricing(
    items.filter((i) => i.product).map((i) => ({
      productId: i.productId,
      name: i.product?.name || '',
      quantity: i.quantity,
      unitPrice: i.product?.price || 0,
    })),
    { couponCode: discountCode, customerSpend: totalSpent },
  )
  const subtotal = getTotal()
  const discountAmount = pricing.totalDiscount
  const tax = pricing.tax
  const finalTotal = pricing.grandTotal

  const applyDiscountCode = () => {
    const code = discountCode.toUpperCase()
    if (code === 'LOYAL5') setDiscount(5)
    else if (code === 'LOYAL10') setDiscount(10)
    else if (code === 'LOYAL15') setDiscount(15)
    else if (code === 'LOYAL20') setDiscount(20)
    else if (code === 'WELCOME10') setDiscount(10)
    else if (code === 'SAVE15') setDiscount(15)
    else alert(t('invalidDiscountCode'))
  }

  if (items.length === 0 && !showHistory) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <ShoppingBag className="mx-auto mb-6 text-gray-300 dark:text-gray-600" size={80} />
            <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">{t('cartEmpty')}</h1>
            <p className="mb-8 text-gray-600 dark:text-gray-400">{t('farmFresh')}</p>
            {user && cartHistory.length > 0 && (
              <button onClick={() => setShowHistory(true)} className="mx-auto mb-6 flex items-center gap-2 font-medium text-green-600 hover:text-green-700">
                <History size={20} />{t('viewCartHistory')} ({cartHistory.length} {t('orders')})
              </button>
            )}
            <Link href="/products">
              <button className="rounded-lg bg-green-600 px-8 py-4 font-bold text-white transition hover:bg-green-700">{t('products')}</button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">{t('cart')}</h1>
          {user && cartHistory.length > 0 && (
            <button onClick={() => setShowHistory(!showHistory)} className="flex items-center gap-2 font-medium text-green-600 hover:text-green-700">
              <History size={20} />{showHistory ? t('viewCurrentCart') : t('viewHistory')}
            </button>
          )}
        </div>

        {showHistory ? (
          <div className="space-y-6">
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-md">
                <div className="mb-4 flex items-center gap-4">
                  <div className="rounded-lg bg-green-100 dark:bg-green-900/30 p-3"><Package className="text-green-600 dark:text-green-400" size={24} /></div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{t('totalSpent')}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">₹{totalSpent.toFixed(2)}</p>
                  </div>
                </div>
              </div>
              <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-md">
                <div className="mb-4 flex items-center gap-4">
                  <div className="rounded-lg bg-blue-100 dark:bg-blue-900/30 p-3"><Package className="text-blue-600 dark:text-blue-400" size={24} /></div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{t('totalOrders')}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{cartHistory.length}</p>
                  </div>
                </div>
              </div>
              <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-md">
                <div className="mb-4 flex items-center gap-4">
                  <div className="rounded-lg bg-purple-100 dark:bg-purple-900/30 p-3"><TrendingUp className="text-purple-600 dark:text-purple-400" size={24} /></div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{t('avgCartValue')}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">₹{averageCart.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-md">
              <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">{t('previousCarts')}</h2>
              <div className="space-y-4">
                {cartHistory.map((cart, idx) => (
                  <div key={idx} className="rounded-lg border border-gray-200 dark:border-gray-700 p-6 transition hover:shadow-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="rounded-lg bg-green-100 dark:bg-green-900/30 p-3"><Calendar className="text-green-600 dark:text-green-400" size={24} /></div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t('orderNumber')} #{cart.orderId}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{new Date(cart.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600 dark:text-gray-400">{cart.items} {t('items')}</p>
                        <p className="text-2xl font-bold text-green-600">₹{cart.total.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              {items.map((item) =>
                item.product ? (
                  <div key={item.productId} className="flex gap-6 rounded-xl bg-white dark:bg-gray-800 p-6 shadow-md">
                    <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-lg">
                      <SafeImage src={item.product?.image} alt={item.product?.name || 'Product'} fill className="object-cover" sizes="128px" />
                    </div>
                    <div className="flex-1">
                      <div className="mb-4 flex items-start justify-between">
                        <div>
                          <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">{item.product.name}</h3>
                          <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">{item.product.description}</p>
                          <p className="text-lg font-bold text-green-600">₹{item.product.price}</p>
                        </div>
                        <button onClick={() => removeItem(item.productId)} className="rounded-lg p-2 text-red-600 transition hover:bg-red-50 dark:hover:bg-red-900/20">
                          <Trash2 size={20} />
                        </button>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 rounded-lg bg-gray-100 dark:bg-gray-700 p-2">
                          <button onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))} className="flex h-8 w-8 items-center justify-center rounded bg-white dark:bg-gray-600 transition hover:bg-gray-50 dark:hover:bg-gray-500">
                            <Minus size={16} className="text-gray-700 dark:text-gray-200" />
                          </button>
                          <span className="w-8 text-center font-bold text-gray-900 dark:text-white">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="flex h-8 w-8 items-center justify-center rounded bg-white dark:bg-gray-600 transition hover:bg-gray-50 dark:hover:bg-gray-500">
                            <Plus size={16} className="text-gray-700 dark:text-gray-200" />
                          </button>
                        </div>
                        <div className="flex-1 text-right">
                          <p className="text-sm text-gray-600 dark:text-gray-400">{t('subtotal')}</p>
                          <p className="text-xl font-bold text-gray-900 dark:text-white">₹{item.product.price * item.quantity}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null,
              )}
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-xl bg-white dark:bg-gray-800 p-6 shadow-md">
                <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">{t('orderSummary')}</h2>
                <div className="mb-6 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{t('subtotal')}</span>
                    <span className="font-bold text-gray-900 dark:text-white">₹{subtotal.toFixed(2)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>{t('discount')}</span>
                      <span className="font-bold">-₹{discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">GST (5%)</span>
                    <span className="font-medium text-gray-900 dark:text-white">₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600 dark:text-gray-400">Est. Delivery</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex justify-between text-xl">
                      <span className="font-bold text-gray-900 dark:text-white">{t('total')}</span>
                      <span className="font-bold text-green-600">₹{finalTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <div className="mb-6">
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">{t('discountCode')}</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      placeholder={t('enterCode')}
                      className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-green-500"
                    />
                    <button onClick={applyDiscountCode} className="rounded-lg bg-gray-100 dark:bg-gray-700 px-4 py-2 font-medium text-gray-700 dark:text-gray-200 transition hover:bg-gray-200 dark:hover:bg-gray-600">
                      {t('apply')}
                    </button>
                  </div>
                  {discount > 0 && <p className="mt-2 text-sm text-green-600">✓ {discount}% {t('discountApplied')}</p>}
                </div>
                {user && totalSpent > 0 && (
                  <div className="mb-6 rounded-lg border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 p-4">
                    <p className="mb-1 text-sm font-medium text-green-800 dark:text-green-300">{t('loyaltyRewards')}</p>
                    <p className="text-xs text-green-700 dark:text-green-400">
                      {t('youHaveSpentTotal', { amount: totalSpent.toFixed(2) })}{' '}
                      {totalSpent >= 50000 ? t('discount20Off') : totalSpent >= 30000 ? t('discount15Off') : totalSpent >= 15000 ? t('discount10Off') : totalSpent >= 5000 ? t('discount5Off') : t('spendMoreForDiscount', { amount: (5000 - totalSpent).toFixed(2) })}
                    </p>
                  </div>
                )}
                <Link href="/checkout">
                  <button
                    onClick={() => {
                      if (user && items.length > 0) {
                        const snap = { date: new Date().toISOString(), items, total: finalTotal }
                        const existing = JSON.parse(localStorage.getItem(`cartHistory_${user.id}`) || '[]')
                        existing.push(snap)
                        localStorage.setItem(`cartHistory_${user.id}`, JSON.stringify(existing))
                        localStorage.setItem('pendingCouponCode', discountCode)
                      }
                    }}
                    className="mb-3 w-full rounded-lg bg-green-600 py-4 font-bold text-white transition hover:bg-green-700"
                  >
                    {t('proceedToCheckout')}
                  </button>
                </Link>
                <Link href="/products">
                  <button className="w-full rounded-lg border border-gray-300 dark:border-gray-600 py-4 font-bold text-gray-700 dark:text-gray-200 transition hover:bg-gray-50 dark:hover:bg-gray-700">
                    {t('continueShopping')}
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
