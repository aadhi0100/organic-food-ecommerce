'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import { useRouter } from 'next/navigation'
import { User, Mail, Phone, MapPin, Save, Edit, CreditCard, DollarSign, Package, Award, Receipt } from 'lucide-react'
import type { Order } from '@/types'
import { formatIndianCurrency } from '@/utils/indianFormat'

interface PaymentHistory {
  orderId: string
  date: string
  amount: number
  method: string
  status: string
}

export default function CustomerProfile() {
  const { user } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])
  const [payments, setPayments] = useState<PaymentHistory[]>([])
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  })

  useEffect(() => {
    if (!user || user.role !== 'customer') {
      router.push('/login')
      return
    }

    setProfile({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || '',
      city: 'Chennai',
      state: 'Tamil Nadu',
      zipCode: '600001',
    })

    fetch('/api/orders')
      .then((r) => r.json())
      .then((ordersData: Order[]) => {
        const userOrders = ordersData.filter((o) => o.userId === user.id)
        setOrders(userOrders)

        const paymentHistory: PaymentHistory[] = userOrders.map((order) => ({
          orderId: order.id,
          date: order.createdAt,
          amount: order.total,
          method: t('creditCard'),
          status: t('completed'),
        }))
        setPayments(paymentHistory)
      })
  }, [user, router, t])

  const handleSave = () => {
    setEditing(false)
    alert(t('profileUpdated'))
  }

  const totalSpent = orders.reduce((sum, o) => sum + o.total, 0)
  const totalOrders = orders.length
  const loyaltyPoints = Math.floor(totalSpent * 10)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <h1 className="mb-2 text-4xl font-bold">{t('myProfile')}</h1>
            <p className="text-gray-600">{t('manageAccountInfo')}</p>
          </div>

          <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="rounded-xl bg-gradient-to-br from-green-500 to-green-600 p-6 text-white shadow-lg">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold">{t('totalSpent')}</h3>
                <DollarSign size={24} />
              </div>
              <p className="mb-2 text-4xl font-bold">{formatIndianCurrency(totalSpent)}</p>
              <p className="text-green-100 text-sm">{t('lifetimePurchases')}</p>
            </div>

            <div className="rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white shadow-lg">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold">{t('totalOrders')}</h3>
                <Package size={24} />
              </div>
              <p className="mb-2 text-4xl font-bold">{totalOrders}</p>
              <p className="text-blue-100 text-sm">{t('completedOrders')}</p>
            </div>

            <div className="rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 p-6 text-white shadow-lg">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold">{t('points')}</h3>
                <Award size={24} />
              </div>
              <p className="mb-2 text-4xl font-bold">{loyaltyPoints}</p>
              <p className="text-purple-100 text-sm">{t('rewardPoints')}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <div className="rounded-xl bg-white p-8 shadow-md">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-2xl font-bold">{t('personalInformation')}</h2>
                  <button
                    onClick={() => (editing ? handleSave() : setEditing(true))}
                    className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white transition hover:bg-green-700"
                  >
                    {editing ? <><Save size={18} /> {t('save')}</> : <><Edit size={18} /> {t('edit')}</>}
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium">{t('fullName')}</label>
                    <div className="flex items-center gap-3">
                      <User className="text-gray-400" size={20} />
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        disabled={!editing}
                        className="flex-1 rounded-lg border px-4 py-3 focus:ring-2 focus:ring-green-500 disabled:bg-gray-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">{t('email')}</label>
                    <div className="flex items-center gap-3">
                      <Mail className="text-gray-400" size={20} />
                      <input
                        type="email"
                        value={profile.email}
                        disabled
                        className="flex-1 rounded-lg border bg-gray-50 px-4 py-3"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">{t('phone')}</label>
                    <div className="flex items-center gap-3">
                      <Phone className="text-gray-400" size={20} />
                      <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        disabled={!editing}
                        className="flex-1 rounded-lg border px-4 py-3 focus:ring-2 focus:ring-green-500 disabled:bg-gray-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">{t('address')}</label>
                    <div className="flex items-center gap-3">
                      <MapPin className="text-gray-400" size={20} />
                      <input
                        type="text"
                        value={profile.address}
                        onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                        disabled={!editing}
                        className="flex-1 rounded-lg border px-4 py-3 focus:ring-2 focus:ring-green-500 disabled:bg-gray-50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium">{t('city')}</label>
                      <input
                        type="text"
                        value={profile.city}
                        onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                        disabled={!editing}
                        className="w-full rounded-lg border px-4 py-3 focus:ring-2 focus:ring-green-500 disabled:bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium">{t('state')}</label>
                      <input
                        type="text"
                        value={profile.state}
                        onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                        disabled={!editing}
                        className="w-full rounded-lg border px-4 py-3 focus:ring-2 focus:ring-green-500 disabled:bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium">{t('zipCode')}</label>
                      <input
                        type="text"
                        value={profile.zipCode}
                        onChange={(e) => setProfile({ ...profile, zipCode: e.target.value })}
                        disabled={!editing}
                        className="w-full rounded-lg border px-4 py-3 focus:ring-2 focus:ring-green-500 disabled:bg-gray-50"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-white p-8 shadow-md">
                <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold">
                  <Receipt className="text-green-600" />
                  {t('paymentHistory')}
                </h2>

                {payments.length === 0 ? (
                  <div className="py-12 text-center">
                    <CreditCard className="mx-auto mb-4 text-gray-300" size={64} />
                    <p className="text-gray-600">{t('noPaymentHistory')}</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="px-4 py-3 text-left">{t('orderId')}</th>
                          <th className="px-4 py-3 text-left">{t('date')}</th>
                          <th className="px-4 py-3 text-left">{t('totalAmount')}</th>
                          <th className="px-4 py-3 text-left">{t('method')}</th>
                          <th className="px-4 py-3 text-left">{t('status')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {payments.map((payment, idx) => (
                          <tr key={idx} className="border-b hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium">#{payment.orderId}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {new Date(payment.date).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3 font-bold text-green-600">{formatIndianCurrency(payment.amount)}</td>
                            <td className="px-4 py-3 text-sm">{payment.method}</td>
                            <td className="px-4 py-3">
                              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                                {payment.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-xl bg-white p-6 shadow-md">
                <h2 className="mb-6 text-xl font-bold">{t('quickStats')}</h2>
                <div className="space-y-4">
                  <div className="border-b pb-4">
                    <p className="mb-1 text-sm text-gray-600">{t('memberSince')}</p>
                    <p className="font-bold">January 2024</p>
                  </div>
                  <div className="border-b pb-4">
                    <p className="mb-1 text-sm text-gray-600">{t('averageOrder')}</p>
                    <p className="font-bold text-green-600">
                      {formatIndianCurrency(totalOrders > 0 ? totalSpent / totalOrders : 0)}
                    </p>
                  </div>
                  <div className="border-b pb-4">
                    <p className="mb-1 text-sm text-gray-600">{t('loyaltyTier')}</p>
                    <p className="font-bold">
                      {totalSpent >= 50000 ? `💎 ${t('platinum')}` :
                       totalSpent >= 30000 ? `🏆 ${t('gold')}` :
                       totalSpent >= 15000 ? `🥈 ${t('silver')}` :
                       totalSpent >= 5000 ? `🥉 ${t('bronze')}` : `⭐ ${t('newMember')}`}
                    </p>
                  </div>
                  <div>
                    <p className="mb-1 text-sm text-gray-600">{t('currentDiscount')}</p>
                    <p className="font-bold text-green-600">
                      {totalSpent >= 50000 ? t('discount20Off') :
                       totalSpent >= 30000 ? t('discount15Off') :
                       totalSpent >= 15000 ? t('discount10Off') :
                       totalSpent >= 5000 ? t('discount5Off') : '0% OFF'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
