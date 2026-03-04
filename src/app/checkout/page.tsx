'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/hooks/useCart'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import { formatPrice } from '@/utils/format'
import Image from 'next/image'
import { CreditCard, MapPin, User as UserIcon } from 'lucide-react'
import type { Address } from '@/types'
import LocationPicker from '@/components/LocationPicker'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotal, clearCart } = useCart()
  const { user, isLoading } = useAuth()
  const { t } = useLanguage()
  const [isProcessing, setIsProcessing] = useState(false)
  const [address, setAddress] = useState<Address>({
    fullName: '',
    street: '',
    city: 'Chennai',
    state: 'Tamil Nadu',
    zipCode: '',
    phone: '+91 9445231232',
  })
  const [useNewAddress, setUseNewAddress] = useState(false)
  const [deliveryLocation, setDeliveryLocation] = useState<{ lat: number; lng: number; address: string } | null>(null)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login?redirect=/checkout')
    }
    if (user) {
      setAddress(prev => ({ ...prev, fullName: user.name || '' }))
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart')
    }
  }, [items, router])

  const total = getTotal()
  const deliveryCharges = 40
  const tax = (total + deliveryCharges) * 0.18
  const finalTotal = total + deliveryCharges + tax

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      router.push('/login?redirect=/checkout')
      return
    }

    setIsProcessing(true)

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          customerName: address.fullName,
          customerEmail: user.email,
          customerPhone: address.phone,
          items,
          total: finalTotal,
          orderDate: new Date().toISOString(),
          status: 'confirmed',
          paymentMethod: 'Cash on Delivery',
          shippingAddress: {
            street: address.street,
            city: address.city,
            state: address.state,
            zipCode: address.zipCode,
            country: 'India'
          },
        }),
      })

      if (response.ok) {
        const order = await response.json()
        clearCart()
        router.push(`/order-success?orderId=${order.id}`)
      } else {
        alert('Order failed. Please try again.')
      }
    } catch (error) {
      alert('Order failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (items.length === 0) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">{t('checkout')}</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <MapPin className="text-green-600" />
              {t('shippingAddress')}
            </h2>
            
            <div className="mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useNewAddress}
                  onChange={(e) => setUseNewAddress(e.target.checked)}
                  className="w-4 h-4 text-green-600"
                />
                <span className="font-medium">Use different address</span>
              </label>
            </div>

            {!useNewAddress ? (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium">{address.fullName}</p>
                <p className="text-gray-600">{address.phone}</p>
                <p className="text-gray-600">{address.city}, {address.state}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">{t('name')}</label>
                  <input
                    type="text"
                    required
                    value={address.fullName}
                    onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">{t('address')}</label>
                  <input
                    type="text"
                    required
                    value={address.street}
                    onChange={(e) => setAddress({ ...address, street: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">{t('city')}</label>
                  <input
                    type="text"
                    required
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">{t('state')}</label>
                  <input
                    type="text"
                    required
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">{t('zipCode')}</label>
                  <input
                    type="text"
                    required
                    value={address.zipCode}
                    onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">{t('phone')}</label>
                  <input
                    type="tel"
                    required
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    placeholder="+91 9445231232"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}

            <div className="mt-6">
              <label className="block text-sm font-medium mb-2">Pin Delivery Location</label>
              <LocationPicker
                onLocationSelect={(location) => {
                  setDeliveryLocation(location)
                  setAddress(prev => ({ ...prev, street: location.address }))
                }}
                initialLocation={deliveryLocation || undefined}
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <CreditCard className="text-green-600" />
              {t('paymentMethod')}
            </h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-4 border-2 border-green-600 rounded-lg cursor-pointer">
                <input type="radio" name="payment" defaultChecked className="w-4 h-4" />
                <span className="font-medium">{t('cashOnDelivery')}</span>
              </label>
              <label className="flex items-center gap-3 p-4 border-2 border-gray-300 rounded-lg cursor-pointer opacity-50">
                <input type="radio" name="payment" disabled className="w-4 h-4" />
                <span className="font-medium">Credit Card (Coming Soon)</span>
              </label>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-2xl font-bold mb-6">{t('orderSummary')}</h2>

            <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
              {items.map((item) => (
                <div key={item.productId} className="flex gap-3">
                  <div className="relative w-16 h-16 bg-gray-100 rounded flex-shrink-0">
                    <Image
                      src={item.product?.image || '/images/placeholder.jpg'}
                      alt={item.product?.name || 'Product'}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.product?.name}</p>
                    <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-bold text-sm">
                    {formatPrice((item.product?.price || 0) * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-3 mb-6 border-t pt-4">
              <div className="flex justify-between">
                <span className="text-gray-600">{t('subtotal')}</span>
                <span className="font-medium">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t('deliveryCharges')}</span>
                <span className="font-medium">₹40.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t('tax')} (18%)</span>
                <span className="font-medium">{formatPrice(tax)}</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-xl font-bold">
                <span>{t('total')}</span>
                <span className="text-green-600">{formatPrice(finalTotal)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-green-600 text-white py-4 rounded-lg font-bold hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isProcessing ? `${t('placeOrder')}...` : t('placeOrder')}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
