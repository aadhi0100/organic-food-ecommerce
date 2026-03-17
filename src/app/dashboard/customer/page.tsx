'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import { useRouter } from 'next/navigation'
import { ShoppingCart, Package, TrendingUp, Gift, Award, History, Tag, ShoppingBag, Store, Send } from 'lucide-react'
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
  const { t } = useLanguage()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [cartHistory, setCartHistory] = useState<CartHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [loyaltyPoints, setLoyaltyPoints] = useState(0)
  const [discountTier, setDiscountTier] = useState('Bronze')
  const [discountPercentage, setDiscountPercentage] = useState(0)
  const [totalCarts, setTotalCarts] = useState(0)
  const [showVendorRequest, setShowVendorRequest] = useState(false)
  const [vendorRequestSent, setVendorRequestSent] = useState(false)
  const [requestMessage, setRequestMessage] = useState('')

  useEffect(() => {
    if (!user || user.role !== 'customer') {
      router.push('/login')
      return
    }

    const requests = JSON.parse(localStorage.getItem('vendorRequests') || '[]')
    const userRequest = requests.find((r: any) => r.userId === user.id)
    if (userRequest) setVendorRequestSent(true)

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

    const savedCartHistory = localStorage.getItem(`cartHistory_${user.id}`)
    if (savedCartHistory) {
      const parsedHistory = JSON.parse(savedCartHistory)
      setCartHistory((prev) => [...parsedHistory, ...prev])
    }
  }, [user, router])

  const handleVendorRequest = () => {
    const request = {
      userId: user?.id,
      userName: user?.name,
      userEmail: user?.email,
      message: requestMessage,
      date: new Date().toISOString(),
      status: 'pending'
    }
    const requests = JSON.parse(localStorage.getItem('vendorRequests') || '[]')
    requests.push(request)
    localStorage.setItem('vendorRequests', JSON.stringify(requests))
    setVendorRequestSent(true)
    setShowVendorRequest(false)
    setRequestMessage('')
  }

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

        {!vendorRequestSent && (
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg p-6 text-white mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">Want to Sell Your Products?</h3>
                <p className="text-white/90 mb-4">Become a vendor and start selling organic products on our platform!</p>
                <button
                  onClick={() => setShowVendorRequest(true)}
                  className="bg-white text-purple-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition flex items-center gap-2"
                >
                  <Store size={20} />
                  Request to Become Vendor
                </button>
              </div>
              <div className="text-6xl hidden md:block">🏪</div>
            </div>
          </div>
        )}

        {vendorRequestSent && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-3 rounded-full">
                <Store className="text-green-600" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-green-800 text-lg">Vendor Request Submitted!</h3>
                <p className="text-green-700">Your request to become a vendor is under review. We'll contact you soon.</p>
              </div>
            </div>
          </div>
        )}

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
                  ₹{totalSpent.toFixed(0)} / ₹{discountTier === 'Platinum' ? '50,000+' : discountTier === 'Gold' ? '50,000' : discountTier === 'Silver' ? '30,000' : '15,000'}
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
            <h3 className="text-gray-600 text-sm mb-1">Total Items</h3>
            <p className="text-3xl font-bold">{orders.reduce((sum, o) => sum + (o.items?.length || 0), 0)}</p>
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
            <Package className="text-green-600" />
            Order History & Tracking
          </h2>
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="mx-auto text-gray-300 mb-4" size={64} />
              <p className="text-gray-600 mb-4">No orders yet</p>
              <Link href="/products">
                <button className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition">
                  Start Shopping
                </button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order, idx) => (
                <div key={idx} className="border-2 border-gray-200 rounded-lg p-6 hover:shadow-xl transition">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                    <div>
                      <h3 className="font-bold text-xl">Order #{order.id}</h3>
                      <p className="text-sm text-gray-600">
                        Placed on {new Date(order.orderDate || order.createdAt || new Date().toISOString()).toLocaleDateString('en-IN', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Total Amount</p>
                        <p className="text-2xl font-bold text-green-600">{formatIndianCurrency(order.total)}</p>
                      </div>
                      <span className={`px-4 py-1 rounded-full text-sm font-bold ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                        order.status === 'confirmed' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {order.status?.toUpperCase() || 'CONFIRMED'}
                      </span>
                    </div>
                  </div>

                  {/* Delivery Tracking */}
                  {order.trackingNumber && (
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-bold text-green-800 flex items-center gap-2">
                            <Package size={20} />
                            Delivery Tracking
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            Tracking Number: <span className="font-mono font-bold text-green-700">{order.trackingNumber}</span>
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-600">Expected Delivery</p>
                          <p className="font-bold text-green-700">
                            {new Date(order.deliveryDate || new Date().toISOString()).toLocaleDateString('en-IN', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      
                      {/* Delivery Progress */}
                      <div className="relative">
                        <div className="flex justify-between items-center">
                          <div className="flex flex-col items-center flex-1">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              order.status ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                            }`}>
                              ✓
                            </div>
                            <p className="text-xs mt-2 font-medium">Confirmed</p>
                          </div>
                          <div className={`flex-1 h-1 ${
                            order.status === 'shipped' || order.status === 'delivered' ? 'bg-green-500' : 'bg-gray-300'
                          }`}></div>
                          <div className="flex flex-col items-center flex-1">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              order.status === 'shipped' || order.status === 'delivered' ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                            }`}>
                              📦
                            </div>
                            <p className="text-xs mt-2 font-medium">Shipped</p>
                          </div>
                          <div className={`flex-1 h-1 ${
                            order.status === 'delivered' ? 'bg-green-500' : 'bg-gray-300'
                          }`}></div>
                          <div className="flex flex-col items-center flex-1">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              order.status === 'delivered' ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                            }`}>
                              🏠
                            </div>
                            <p className="text-xs mt-2 font-medium">Delivered</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Order Items */}
                  <div className="space-y-3">
                    {order.items.map((item, itemIdx) => (
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

                  {/* Shipping Address */}
                  {order.shippingAddress && (
                    <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-bold text-blue-800 mb-2">Shipping Address</h4>
                      <p className="text-sm text-gray-700">
                        {order.shippingAddress.street}, {order.shippingAddress.city}<br />
                        {order.shippingAddress.state} - {order.shippingAddress.zipCode}<br />
                        {order.shippingAddress.country || 'India'}
                      </p>
                    </div>
                  )}

                  {/* Download Invoice Button */}
                  <div className="mt-4 flex gap-3">
                    <a 
                      href={`/api/orders/${order.id}/invoice`}
                      download
                      className="flex-1 bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition text-center"
                    >
                      📄 Download Invoice
                    </a>
                    {order.trackingNumber && (
                      <button className="px-6 py-3 border-2 border-green-600 text-green-600 rounded-lg font-bold hover:bg-green-50 transition">
                        Track Order
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
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
              <p className="text-sm text-gray-600 mb-2">Spend ₹5,000+</p>
              <p className="text-lg font-bold text-orange-600">5% OFF</p>
            </div>
            <div className={`border-2 rounded-lg p-4 ${discountTier === 'Silver' ? 'border-gray-500 bg-gray-50' : 'border-gray-200'}`}>
              <div className="text-3xl mb-2">🥈</div>
              <h3 className="font-bold mb-1">Silver</h3>
              <p className="text-sm text-gray-600 mb-2">Spend ₹15,000+</p>
              <p className="text-lg font-bold text-gray-600">10% OFF</p>
            </div>
            <div className={`border-2 rounded-lg p-4 ${discountTier === 'Gold' ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200'}`}>
              <div className="text-3xl mb-2">🏆</div>
              <h3 className="font-bold mb-1">Gold</h3>
              <p className="text-sm text-gray-600 mb-2">Spend ₹30,000+</p>
              <p className="text-lg font-bold text-yellow-600">15% OFF</p>
            </div>
            <div className={`border-2 rounded-lg p-4 ${discountTier === 'Platinum' ? 'border-gray-600 bg-gray-50' : 'border-gray-200'}`}>
              <div className="text-3xl mb-2">💎</div>
              <h3 className="font-bold mb-1">Platinum</h3>
              <p className="text-sm text-gray-600 mb-2">Spend ₹50,000+</p>
              <p className="text-lg font-bold text-gray-700">20% OFF</p>
            </div>
          </div>
        </div>
      </div>

      {showVendorRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Become a Vendor</h2>
              <button onClick={() => setShowVendorRequest(false)}>
                <span className="text-2xl">&times;</span>
              </button>
            </div>

            <div className="mb-6">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                <h3 className="font-bold text-purple-800 mb-2">Benefits:</h3>
                <ul className="space-y-2 text-sm text-purple-700">
                  <li className="flex items-center gap-2"><span className="text-green-600">✓</span>Reach thousands of customers</li>
                  <li className="flex items-center gap-2"><span className="text-green-600">✓</span>Manage your own products</li>
                  <li className="flex items-center gap-2"><span className="text-green-600">✓</span>Track sales and revenue</li>
                  <li className="flex items-center gap-2"><span className="text-green-600">✓</span>Grow your organic business</li>
                </ul>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Why do you want to become a vendor?</label>
                <textarea
                  value={requestMessage}
                  onChange={(e) => setRequestMessage(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  rows={4}
                  placeholder="Tell us about your products..."
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleVendorRequest}
                disabled={!requestMessage.trim()}
                className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-bold hover:bg-purple-700 transition flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <Send size={20} />
                Submit Request
              </button>
              <button
                onClick={() => setShowVendorRequest(false)}
                className="px-6 py-3 border border-gray-300 rounded-lg font-bold hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
