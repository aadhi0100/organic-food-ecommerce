'use client'

import { useState, useEffect } from 'react'
import { useCart } from '@/hooks/useCart'
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'
import Image from 'next/image'
import { Trash2, Plus, Minus, ShoppingBag, History, TrendingUp, Calendar, DollarSign, Package } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { Order } from '@/types'

interface CartHistoryItem {
  date: string
  items: number
  total: number
  orderId: string
}

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const [cartHistory, setCartHistory] = useState<CartHistoryItem[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [totalSpent, setTotalSpent] = useState(0)
  const [averageCart, setAverageCart] = useState(0)
  const [discountCode, setDiscountCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [deliveryOption, setDeliveryOption] = useState<'standard' | 'express' | 'same-day'>('standard')

  useEffect(() => {
    if (user) {
      fetch('/api/orders')
        .then(r => r.json())
        .then((orders: Order[]) => {
          const userOrders = orders.filter(o => o.userId === user.id)
          const history: CartHistoryItem[] = userOrders.map(order => ({
            date: order.createdAt,
            items: order.items.length,
            total: order.total,
            orderId: order.id
          }))
          setCartHistory(history)
          
          const spent = userOrders.reduce((sum, o) => sum + o.total, 0)
          setTotalSpent(spent)
          setAverageCart(userOrders.length > 0 ? spent / userOrders.length : 0)
          
          // Auto-apply discount based on spending
          if (spent >= 500) setDiscount(20)
          else if (spent >= 300) setDiscount(15)
          else if (spent >= 150) setDiscount(10)
          else if (spent >= 50) setDiscount(5)
        })
    }
  }, [user])

  const subtotal = getTotal()
  const discountAmount = (subtotal * discount) / 100
  const afterDiscount = subtotal - discountAmount
  
  // GST and CGST (9% each = 18% total in India)
  const cgst = afterDiscount * 0.09
  const sgst = afterDiscount * 0.09
  const totalTax = cgst + sgst
  
  // Delivery charges
  const deliveryCharges = deliveryOption === 'same-day' ? 100 : deliveryOption === 'express' ? 60 : 40
  
  const finalTotal = afterDiscount + totalTax + deliveryCharges

  const applyDiscountCode = () => {
    const code = discountCode.toUpperCase()
    if (code === 'LOYAL5') setDiscount(5)
    else if (code === 'LOYAL10') setDiscount(10)
    else if (code === 'LOYAL15') setDiscount(15)
    else if (code === 'LOYAL20') setDiscount(20)
    else if (code === 'WELCOME10') setDiscount(10)
    else if (code === 'SAVE15') setDiscount(15)
    else alert('Invalid discount code')
  }

  if (items.length === 0 && !showHistory) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <ShoppingBag className="mx-auto text-gray-300 mb-6" size={80} />
            <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-8">Add some organic products to get started!</p>
            
            {user && cartHistory.length > 0 && (
              <button
                onClick={() => setShowHistory(true)}
                className="mb-6 text-green-600 hover:text-green-700 font-medium flex items-center gap-2 mx-auto"
              >
                <History size={20} />
                View Cart History ({cartHistory.length} orders)
              </button>
            )}
            
            <Link href="/products">
              <button className="bg-green-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-green-700 transition">
                Browse Products
              </button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Shopping Cart</h1>
          {user && cartHistory.length > 0 && (
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium"
            >
              <History size={20} />
              {showHistory ? 'View Current Cart' : 'View History'}
            </button>
          )}
        </div>

        {showHistory ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <DollarSign className="text-green-600" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Spent</p>
                    <p className="text-2xl font-bold">₹{totalSpent.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Package className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Orders</p>
                    <p className="text-2xl font-bold">{cartHistory.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <TrendingUp className="text-purple-600" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Avg Cart Value</p>
                    <p className="text-2xl font-bold">₹{averageCart.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold mb-6">Previous Carts</h2>
              <div className="space-y-4">
                {cartHistory.map((cart, idx) => (
                  <div key={idx} className="border rounded-lg p-6 hover:shadow-lg transition">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className="bg-green-100 p-3 rounded-lg">
                          <Calendar className="text-green-600" size={24} />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">Order #{cart.orderId}</h3>
                          <p className="text-sm text-gray-600">
                            {new Date(cart.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">{cart.items} items</p>
                        <p className="text-2xl font-bold text-green-600">₹{cart.total.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map(item => item.product && (
                <div key={item.productId} className="bg-white rounded-xl shadow-md p-6 flex gap-6">
                  <div className="relative w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold mb-2">{item.product.name}</h3>
                        <p className="text-gray-600 text-sm mb-2">{item.product.description}</p>
                        <p className="text-green-600 font-bold text-lg">₹{item.product.price}</p>
                      </div>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-2">
                        <button
                          onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                          className="w-8 h-8 flex items-center justify-center bg-white rounded hover:bg-gray-50 transition"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="font-bold w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center bg-white rounded hover:bg-gray-50 transition"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <div className="text-right flex-1">
                        <p className="text-sm text-gray-600">Subtotal</p>
                        <p className="text-xl font-bold">₹{(item.product.price * item.quantity)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
                <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-bold">₹{subtotal.toFixed(2)}</span>
                  </div>
                  
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({discount}%)</span>
                      <span className="font-bold">-₹{discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">CGST (9%)</span>
                    <span className="font-medium">₹{cgst.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">SGST (9%)</span>
                    <span className="font-medium">₹{sgst.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery Charges</span>
                    <span className="font-medium">₹{deliveryCharges.toFixed(2)}</span>
                  </div>
                  
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-xl">
                      <span className="font-bold">Total</span>
                      <span className="font-bold text-green-600">₹{finalTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Delivery Option</label>
                  <div className="space-y-2">
                    <label className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="delivery"
                          value="standard"
                          checked={deliveryOption === 'standard'}
                          onChange={(e) => setDeliveryOption(e.target.value as any)}
                          className="w-4 h-4 text-green-600"
                        />
                        <div>
                          <p className="font-medium">Standard Delivery</p>
                          <p className="text-xs text-gray-600">3-5 business days</p>
                        </div>
                      </div>
                      <span className="font-bold text-green-600">₹40</span>
                    </label>
                    
                    <label className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="delivery"
                          value="express"
                          checked={deliveryOption === 'express'}
                          onChange={(e) => setDeliveryOption(e.target.value as any)}
                          className="w-4 h-4 text-green-600"
                        />
                        <div>
                          <p className="font-medium">Express Delivery</p>
                          <p className="text-xs text-gray-600">1-2 business days</p>
                        </div>
                      </div>
                      <span className="font-bold text-blue-600">₹60</span>
                    </label>
                    
                    <label className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="delivery"
                          value="same-day"
                          checked={deliveryOption === 'same-day'}
                          onChange={(e) => setDeliveryOption(e.target.value as any)}
                          className="w-4 h-4 text-green-600"
                        />
                        <div>
                          <p className="font-medium">Same Day Delivery</p>
                          <p className="text-xs text-gray-600">Within 24 hours</p>
                        </div>
                      </div>
                      <span className="font-bold text-orange-600">₹100</span>
                    </label>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Discount Code</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      placeholder="Enter code"
                      className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                    <button
                      onClick={applyDiscountCode}
                      className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition font-medium"
                    >
                      Apply
                    </button>
                  </div>
                  {discount > 0 && (
                    <p className="text-sm text-green-600 mt-2">✓ {discount}% discount applied!</p>
                  )}
                </div>

                {user && totalSpent > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <p className="text-sm font-medium text-green-800 mb-1">Loyalty Rewards</p>
                    <p className="text-xs text-green-700">
                      You've spent ₹{totalSpent.toFixed(2)} total. 
                      {totalSpent >= 50000 ? ' You have 20% off!' :
                       totalSpent >= 30000 ? ' You have 15% off!' :
                       totalSpent >= 15000 ? ' You have 10% off!' :
                       totalSpent >= 5000 ? ' You have 5% off!' :
                       ` Spend ₹${(5000 - totalSpent).toFixed(2)} more for 5% off!`}
                    </p>
                  </div>
                )}

                <Link href="/checkout">
                  <button 
                    onClick={() => {
                      if (user && items.length > 0) {
                        const cartSnapshot = {
                          date: new Date().toISOString(),
                          items: items,
                          total: finalTotal
                        }
                        const existingHistory = JSON.parse(localStorage.getItem(`cartHistory_${user.id}`) || '[]')
                        existingHistory.push(cartSnapshot)
                        localStorage.setItem(`cartHistory_${user.id}`, JSON.stringify(existingHistory))
                      }
                    }}
                    className="w-full bg-green-600 text-white py-4 rounded-lg font-bold hover:bg-green-700 transition mb-3"
                  >
                    Proceed to Checkout
                  </button>
                </Link>
                
                <Link href="/products">
                  <button className="w-full border border-gray-300 py-4 rounded-lg font-bold hover:bg-gray-50 transition">
                    Continue Shopping
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
