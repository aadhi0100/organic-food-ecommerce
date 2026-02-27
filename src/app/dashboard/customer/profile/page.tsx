'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { User, Mail, Phone, MapPin, Save, Edit, CreditCard, Calendar, DollarSign, Package, Award, Receipt } from 'lucide-react'
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
    zipCode: ''
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
      city: 'New York',
      state: 'NY',
      zipCode: '10001'
    })

    fetch('/api/orders')
      .then(r => r.json())
      .then((ordersData: Order[]) => {
        const userOrders = ordersData.filter(o => o.userId === user.id)
        setOrders(userOrders)
        
        const paymentHistory: PaymentHistory[] = userOrders.map(order => ({
          orderId: order.id,
          date: order.createdAt,
          amount: order.total,
          method: 'Credit Card',
          status: 'Completed'
        }))
        setPayments(paymentHistory)
      })
  }, [user, router])

  const handleSave = () => {
    setEditing(false)
    alert('Profile updated successfully!')
  }

  const totalSpent = orders.reduce((sum, o) => sum + o.total, 0)
  const totalOrders = orders.length
  const loyaltyPoints = Math.floor(totalSpent * 10)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">My Profile</h1>
            <p className="text-gray-600">Manage your account information</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Total Spent</h3>
                <DollarSign size={24} />
              </div>
              <p className="text-4xl font-bold mb-2">{formatIndianCurrency(totalSpent)}</p>
              <p className="text-green-100 text-sm">Lifetime purchases</p>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Total Orders</h3>
                <Package size={24} />
              </div>
              <p className="text-4xl font-bold mb-2">{totalOrders}</p>
              <p className="text-blue-100 text-sm">Completed orders</p>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Loyalty Points</h3>
                <Award size={24} />
              </div>
              <p className="text-4xl font-bold mb-2">{loyaltyPoints}</p>
              <p className="text-purple-100 text-sm">Reward points</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl shadow-md p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Personal Information</h2>
                  <button
                    onClick={() => editing ? handleSave() : setEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  >
                    {editing ? <><Save size={18} /> Save</> : <><Edit size={18} /> Edit</>}
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name</label>
                    <div className="flex items-center gap-3">
                      <User className="text-gray-400" size={20} />
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        disabled={!editing}
                        className="flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 disabled:bg-gray-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <div className="flex items-center gap-3">
                      <Mail className="text-gray-400" size={20} />
                      <input
                        type="email"
                        value={profile.email}
                        disabled
                        className="flex-1 px-4 py-3 border rounded-lg bg-gray-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Phone</label>
                    <div className="flex items-center gap-3">
                      <Phone className="text-gray-400" size={20} />
                      <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        disabled={!editing}
                        className="flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 disabled:bg-gray-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Address</label>
                    <div className="flex items-center gap-3">
                      <MapPin className="text-gray-400" size={20} />
                      <input
                        type="text"
                        value={profile.address}
                        onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                        disabled={!editing}
                        className="flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 disabled:bg-gray-50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">City</label>
                      <input
                        type="text"
                        value={profile.city}
                        onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                        disabled={!editing}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 disabled:bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">State</label>
                      <input
                        type="text"
                        value={profile.state}
                        onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                        disabled={!editing}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 disabled:bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">ZIP Code</label>
                      <input
                        type="text"
                        value={profile.zipCode}
                        onChange={(e) => setProfile({ ...profile, zipCode: e.target.value })}
                        disabled={!editing}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 disabled:bg-gray-50"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-8">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Receipt className="text-green-600" />
                  Payment History
                </h2>
                
                {payments.length === 0 ? (
                  <div className="text-center py-12">
                    <CreditCard className="mx-auto text-gray-300 mb-4" size={64} />
                    <p className="text-gray-600">No payment history yet</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4">Order ID</th>
                          <th className="text-left py-3 px-4">Date</th>
                          <th className="text-left py-3 px-4">Amount</th>
                          <th className="text-left py-3 px-4">Method</th>
                          <th className="text-left py-3 px-4">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {payments.map((payment, idx) => (
                          <tr key={idx} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4 font-medium">#{payment.orderId}</td>
                            <td className="py-3 px-4 text-sm text-gray-600">
                              {new Date(payment.date).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4 font-bold text-green-600">
                              {formatIndianCurrency(payment.amount)}
                            </td>
                            <td className="py-3 px-4 text-sm">{payment.method}</td>
                            <td className="py-3 px-4">
                              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
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
              <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
                <h2 className="text-xl font-bold mb-6">Quick Stats</h2>
                <div className="space-y-4">
                  <div className="border-b pb-4">
                    <p className="text-sm text-gray-600 mb-1">Member Since</p>
                    <p className="font-bold">January 2024</p>
                  </div>
                  <div className="border-b pb-4">
                    <p className="text-sm text-gray-600 mb-1">Average Order</p>
                    <p className="font-bold text-green-600">
                      {formatIndianCurrency(totalOrders > 0 ? totalSpent / totalOrders : 0)}
                    </p>
                  </div>
                  <div className="border-b pb-4">
                    <p className="text-sm text-gray-600 mb-1">Loyalty Tier</p>
                    <p className="font-bold">
                      {totalSpent >= 50000 ? '💎 Platinum' :
                       totalSpent >= 30000 ? '🏆 Gold' :
                       totalSpent >= 15000 ? '🥈 Silver' :
                       totalSpent >= 5000 ? '🥉 Bronze' : '⭐ New Member'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Current Discount</p>
                    <p className="font-bold text-green-600">
                      {totalSpent >= 50000 ? '20% OFF' :
                       totalSpent >= 30000 ? '15% OFF' :
                       totalSpent >= 15000 ? '10% OFF' :
                       totalSpent >= 5000 ? '5% OFF' : '0% OFF'}
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
