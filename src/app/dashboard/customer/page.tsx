'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { ShoppingCart, Package, TrendingUp, Gift, Award, History, Tag, ShoppingBag } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import type { Order, CartItem } from '@/types'
import { formatIndianCurrency } from '@/utils/indianFormat'

interface CartHistory {
  date: string
  items: CartItem[]
  total: number
}

export default function CustomerDashboard() {
  const { user } = useAuth()
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

    fetch('/api/orders')
      .then(r => r.json())
      .then(ordersData => {
        const userOrders = ordersData.filter((o: Order) => o.userId === user.id)
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
          total: order.total
        }))
        setCartHistory(history)
        setLoading(false)
      })
  }, [user, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  const totalSpent = orders.reduce((sum, o) => sum + o.total, 0)
  const totalOrders = orders.length
  const averageOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Platinum': return 'from-gray-400 to-gray-600'
      case 'Gold': return 'from-yellow-400 to-yellow-600'
      case 'Silver': return 'from-gray-300 to-gray-500'
      default: return 'from-orange-400 to-orange-600'
    }
  }

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'Platinum': return '💎'
      case 'Gold': return '🏆'
      case 'Silver': return '🥈'
      default: return '🥉'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}!</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className={`bg-gradient-to-br ${getTierColor(discountTier)} rounded-xl shadow-lg p-6 text-white col-span-1 lg:col-span-2`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold mb-1">Loyalty Status</h3>
                <p className="text-white/80 text-sm">Your rewards and benefits</p>
              </div>
              <div className="text-5xl">{getTierIcon(discountTier)}</div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div>
                <p className="text-white/80 text-sm mb-1">Tier</p>
                <p className="text-2xl font-bold">{discountTier}</p>
              </div>
              <div>
                <p className="text-white/80 text-sm mb-1">Discount</p>
                <p className="text-2xl font-bold">{discountPercentage}%</p>
              </div>
              <div>
                <p className="text-white/80 text-sm mb-1">Points</p>
                <p className="text-2xl font-bold">{loyaltyPoints}</p>
              </div>
            </div>
            <div className="mt-6 bg-white/20 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Progress to {discountTier === 'Platinum' ? 'Max Tier' : 'Next Tier'}</span>
                <span className="text-sm font-bold">
                  ${totalSpent.toFixed(0)} / ${discountTier === 'Platinum' ? '500+' : discountTier === 'Gold' ? '500' : discountTier === 'Silver' ? '300' : '150'}
                </span>
              </div>
              <div className="w-full bg-white/30 rounded-full h-2">
                <div 
                  className="bg-white rounded-full h-2 transition-all duration-500"
                  style={{ 
                    width: `${Math.min(100, (totalSpent / (discountTier === 'Platinum' ? 500 : discountTier === 'Gold' ? 500 : discountTier === 'Silver' ? 300 : 150)) * 100)}%` 
                  }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <Gift className="text-green-600" size={24} />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm mb-1">Available Discount</h3>
            <p className="text-3xl font-bold text-green-600 mb-2">{discountPercentage}% OFF</p>
            <p className="text-sm text-gray-600">Use code: <span className="font-bold">LOYAL{discountPercentage}</span></p>
            <Link href="/products">
              <button className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg font-bold hover:bg-green-700 transition">
                Shop Now
              </button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Package className="text-blue-600" size={24} />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm mb-1">Total Orders</h3>
            <p className="text-3xl font-bold">{totalOrders}</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <ShoppingBag className="text-green-600" size={24} />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm mb-1">Total Carts</h3>
            <p className="text-3xl font-bold">{totalCarts}</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <TrendingUp className="text-purple-600" size={24} />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm mb-1">Total Spent</h3>
            <p className="text-3xl font-bold">{formatIndianCurrency(totalSpent)}</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-orange-100 p-3 rounded-lg">
                <ShoppingCart className="text-orange-600" size={24} />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm mb-1">Avg Order Value</h3>
            <p className="text-3xl font-bold">{formatIndianCurrency(averageOrderValue)}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <History className="text-green-600" />
            Cart History
          </h2>
          {cartHistory.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="mx-auto text-gray-300 mb-4" size={64} />
              <p className="text-gray-600 mb-4">No cart history yet</p>
              <Link href="/products">
                <button className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition">
                  Start Shopping
                </button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {cartHistory.map((cart, idx) => (
                <div key={idx} className="border rounded-lg p-6 hover:shadow-lg transition">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg">Cart #{idx + 1}</h3>
                      <p className="text-sm text-gray-600">{new Date(cart.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Total</p>
                      <p className="text-2xl font-bold text-green-600">{formatIndianCurrency(cart.total)}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {cart.items.map((item, itemIdx) => (
                      <div key={itemIdx} className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg">
                        {item.product && (
                          <>
                            <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                              <Image 
                                src={item.product.image} 
                                alt={item.product.name} 
                                fill 
                                className="object-cover" 
                              />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold">{item.product.name}</h4>
                              <p className="text-sm text-gray-600">
                                {formatIndianCurrency(item.product.price)} × {item.quantity}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold">{formatIndianCurrency(item.product.price * item.quantity)}</p>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                  {discountPercentage > 0 && (
                    <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-green-700">
                        <Tag size={16} />
                        <span className="text-sm font-medium">
                          You could have saved {formatIndianCurrency(cart.total * discountPercentage / 100)} with your {discountTier} discount!
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Award className="text-yellow-500" />
            Rewards & Benefits
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className={`border-2 rounded-lg p-4 ${discountTier === 'Bronze' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'}`}>
              <div className="text-3xl mb-2">🥉</div>
              <h3 className="font-bold mb-1">Bronze</h3>
              <p className="text-sm text-gray-600 mb-2">Spend $50+</p>
              <p className="text-lg font-bold text-orange-600">5% OFF</p>
            </div>
            <div className={`border-2 rounded-lg p-4 ${discountTier === 'Silver' ? 'border-gray-500 bg-gray-50' : 'border-gray-200'}`}>
              <div className="text-3xl mb-2">🥈</div>
              <h3 className="font-bold mb-1">Silver</h3>
              <p className="text-sm text-gray-600 mb-2">Spend $150+</p>
              <p className="text-lg font-bold text-gray-600">10% OFF</p>
            </div>
            <div className={`border-2 rounded-lg p-4 ${discountTier === 'Gold' ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200'}`}>
              <div className="text-3xl mb-2">🏆</div>
              <h3 className="font-bold mb-1">Gold</h3>
              <p className="text-sm text-gray-600 mb-2">Spend $300+</p>
              <p className="text-lg font-bold text-yellow-600">15% OFF</p>
            </div>
            <div className={`border-2 rounded-lg p-4 ${discountTier === 'Platinum' ? 'border-gray-600 bg-gray-50' : 'border-gray-200'}`}>
              <div className="text-3xl mb-2">💎</div>
              <h3 className="font-bold mb-1">Platinum</h3>
              <p className="text-sm text-gray-600 mb-2">Spend $500+</p>
              <p className="text-lg font-bold text-gray-700">20% OFF</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
