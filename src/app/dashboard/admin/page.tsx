'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import { useNotification } from '@/context/NotificationContext'
import { useRouter } from 'next/navigation'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Package, DollarSign, ShoppingCart, Users, TrendingUp, Store, MapPin, UserCheck, Activity, Trash2, X, Save } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import type { Order, Shop, User } from '@/types'

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

export default function AdminDashboard() {
  const { user } = useAuth()
  const { t } = useLanguage()
  const { notify } = useNotification()
  const router = useRouter()
  const [stats, setStats] = useState<{
    totalRevenue: number
    totalOrders: number
    totalProducts: number
    totalCustomers: number
    monthlyRevenue: { month: string; revenue: number }[]
  } | null>(null)
  const [shops, setShops] = useState<Shop[]>([])
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [vendors, setVendors] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddVendor, setShowAddVendor] = useState(false)
  const [vendorForm, setVendorForm] = useState({ name: '', email: '', phone: '', address: '', businessName: '' })

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/login')
      return
    }

    Promise.all([
      fetch('/api/admin/stats').then((r) => r.json()),
      fetch('/api/shops').then((r) => r.json()),
      fetch('/api/orders').then((r) => r.json()),
      fetch('/api/admin/vendors').then((r) => r.json()),
    ]).then(([statsData, shopsData, ordersData, vendorsData]) => {
      setStats(statsData)
      setShops(shopsData)
      setRecentOrders(ordersData.slice(0, 10))
      setVendors(Array.isArray(vendorsData?.vendors) ? vendorsData.vendors : [])
      setLoading(false)
    })
  }, [user, router])

  const handleAddVendor = async () => {
    try {
      const res = await fetch('/api/admin/vendors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vendorForm),
      })
      const data = await res.json()
      if (data.vendor) {
        setVendors((prev) => [...prev, data.vendor])
      }
    } catch {
      notify('error', 'Failed to add vendor')
    }
    setShowAddVendor(false)
    setVendorForm({ name: '', email: '', phone: '', address: '', businessName: '' })
  }

  const handleDeleteVendor = async (id: string) => {
    if (confirm(t('deleteVendor'))) {
      try {
        await fetch(`/api/admin/vendors?id=${encodeURIComponent(id)}`, { method: 'DELETE' })
        setVendors((prev) => prev.filter((v) => v.id !== id))
      } catch {
        notify('error', 'Failed to delete vendor')
      }
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-green-600" />
      </div>
    )
  }

  const categoryData = [
    { name: t('fruits'), value: 35, amount: 15000 },
    { name: t('vegetables'), value: 30, amount: 12000 },
    { name: t('dairy'), value: 20, amount: 8000 },
    { name: t('grains'), value: 10, amount: 5000 },
    { name: t('others'), value: 5, amount: 3000 },
  ]

  const vendorRevenueData = shops.map((shop) => ({
    name: shop.name,
    revenue: shop.revenue,
    orders: shop.totalOrders,
  }))

  const totalVendorRevenue = shops.reduce((sum, shop) => sum + shop.revenue, 0)
  const totalVendorOrders = shops.reduce((sum, shop) => sum + shop.totalOrders, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">{t('adminDashboard')}</h1>
              <p className="text-sm sm:text-base text-gray-600">
                {t('welcomeBack')}, {user?.name}
              </p>
            </div>
            <button
              onClick={() => notify('info', t('reportGenerationComingSoon'))}
              className="rounded-lg px-4 py-2.5 text-sm sm:px-6 sm:py-3 sm:text-base bg-green-600 font-bold text-white transition hover:bg-green-700"
            >
              {t('downloadReport')}
            </button>
          </div>
        </div>

        <div className="grid-responsive mb-8 gap-6">
          <div className="rounded-xl bg-white p-6 shadow-md">
            <div className="mb-4 flex items-center justify-between">
              <div className="rounded-lg bg-green-100 p-3">
                <DollarSign className="text-green-600" size={24} />
              </div>
              <span className="text-sm font-medium text-green-600">+12.5%</span>
            </div>
            <h3 className="mb-1 text-sm text-gray-600">{t('totalRevenue')}</h3>
            <p className="text-3xl font-bold">₹{stats?.totalRevenue?.toLocaleString('en-IN') || 0}</p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-md">
            <div className="mb-4 flex items-center justify-between">
              <div className="rounded-lg bg-blue-100 p-3">
                <ShoppingCart className="text-blue-600" size={24} />
              </div>
              <span className="text-sm font-medium text-blue-600">+8.2%</span>
            </div>
            <h3 className="mb-1 text-sm text-gray-600">{t('totalOrders')}</h3>
            <p className="text-3xl font-bold">{stats?.totalOrders || 0}</p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-md">
            <div className="mb-4 flex items-center justify-between">
              <div className="rounded-lg bg-purple-100 p-3">
                <Store className="text-purple-600" size={24} />
              </div>
              <span className="text-sm font-medium text-purple-600">{t('active')}</span>
            </div>
            <h3 className="mb-1 text-sm text-gray-600">{t('totalVendors')}</h3>
            <p className="text-3xl font-bold">{vendors.length}</p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-md">
            <div className="mb-4 flex items-center justify-between">
              <div className="rounded-lg bg-orange-100 p-3">
                <Users className="text-orange-600" size={24} />
              </div>
              <span className="text-sm font-medium text-orange-600">+15.3%</span>
            </div>
            <h3 className="mb-1 text-sm text-gray-600">{t('totalCustomers')}</h3>
            <p className="text-3xl font-bold">{stats?.totalCustomers || 0}</p>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-xl bg-gradient-to-br from-green-500 to-green-600 p-6 text-white shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold">{t('vendorRevenue')}</h3>
              <Activity size={24} />
            </div>
            <p className="mb-2 text-4xl font-bold">₹{totalVendorRevenue.toLocaleString('en-IN')}</p>
            <p className="text-green-100">{t('totalFromAllVendors')}</p>
          </div>

          <div className="rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold">{t('vendorOrders')}</h3>
              <ShoppingCart size={24} />
            </div>
            <p className="mb-2 text-4xl font-bold">{totalVendorOrders.toLocaleString()}</p>
            <p className="text-blue-100">{t('ordersProcessedByVendors')}</p>
          </div>

          <div className="rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 p-6 text-white shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold">{t('activeShops')}</h3>
              <Store size={24} />
            </div>
            <p className="mb-2 text-4xl font-bold">{shops.length}</p>
            <p className="text-purple-100">{t('shopsCurrentlyOperating')}</p>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-xl bg-white p-6 shadow-md">
            <h2 className="mb-6 flex items-center gap-2 text-xl font-bold">
              <TrendingUp className="text-green-600" />
              {t('monthlyRevenue')}
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats?.monthlyRevenue || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-md">
            <h2 className="mb-6 flex items-center gap-2 text-xl font-bold">
              <Store className="text-blue-600" />
              {t('vendorRevenueDistribution')}
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={vendorRevenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-xl bg-white p-6 shadow-md">
            <h2 className="mb-6 text-xl font-bold">{t('salesByCategory')}</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ₹${value}k`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="amount"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length] || '#8884d8'} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-md">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-xl font-bold">
                <UserCheck className="text-purple-600" />
                {t('vendorManagement')}
              </h2>
              <button
                onClick={() => setShowAddVendor(true)}
                className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 font-bold text-white transition hover:bg-green-700"
              >
                <Users size={18} />
                {t('addVendor')}
              </button>
            </div>
            <div className="space-y-4">
              {vendors.map((vendor) => {
                const vendorShops = shops.filter((s) => s.owner === vendor.email)
                const vendorRevenue = vendorShops.reduce((sum, s) => sum + s.revenue, 0)
                const vendorOrders = vendorShops.reduce((sum, s) => sum + s.totalOrders, 0)
                return (
                  <div key={vendor.id} className="rounded-lg border p-4 transition hover:shadow-md">
                    <div className="mb-2 flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-bold">{vendor.name}</h3>
                        <p className="text-sm text-gray-600">{vendor.email}</p>
                      </div>
                      <div className="flex gap-2">
                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                          {t('active')}
                        </span>
                        <button
                          onClick={() => handleDeleteVendor(vendor.id)}
                          className="rounded p-1 text-red-600 transition hover:bg-red-50"
                          title={t('deleteVendor')}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-gray-600">{t('shops')}</p>
                        <p className="text-xl font-bold">{vendorShops.length}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">{t('orders')}</p>
                        <p className="text-xl font-bold">{vendorOrders}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">{t('revenue')}</p>
                        <p className="text-xl font-bold text-green-600">₹{vendorRevenue.toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="mb-8 rounded-xl bg-white p-6 shadow-md">
          <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold">
            <Store className="text-green-600" />
            {t('shopsOverview')}
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {shops.map((shop) => (
              <div key={shop.id} className="rounded-lg border p-4 transition hover:shadow-lg">
                <div className="relative mb-3 h-32 overflow-hidden rounded-lg">
                  <Image src={shop.image} alt={shop.name} fill className="object-cover" />
                </div>
                <h3 className="mb-2 text-lg font-bold">{shop.name}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin size={14} />
                    <span className="truncate">{shop.location.address}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('orders')}:</span>
                    <span className="font-bold">{shop.totalOrders}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('revenue')}:</span>
                    <span className="font-bold text-green-600">₹{shop.revenue.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('rating')}:</span>
                    <span className="font-bold">⭐ {shop.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-md">
          <h2 className="mb-6 text-2xl font-bold">{t('recentOrders')}</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 text-left">{t('orderId')}</th>
                  <th className="px-4 py-3 text-left">{t('customer')}</th>
                  <th className="px-4 py-3 text-left">{t('items')}</th>
                  <th className="px-4 py-3 text-left">{t('total')}</th>
                  <th className="px-4 py-3 text-left">{t('status')}</th>
                  <th className="px-4 py-3 text-left">{t('date')}</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">#{order.id}</td>
                    <td className="px-4 py-3">{order.shippingAddress.fullName}</td>
                    <td className="px-4 py-3">{order.items.length} {t('items')}</td>
                    <td className="px-4 py-3 font-bold">₹{order.total.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          order.status === 'delivered'
                            ? 'bg-green-100 text-green-700'
                            : order.status === 'shipped'
                              ? 'bg-blue-100 text-blue-700'
                              : order.status === 'processing'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {t(order.status || 'confirmed')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showAddVendor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">{t('addNewVendor')}</h2>
              <button onClick={() => setShowAddVendor(false)}>
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">{t('name')}</label>
                <input
                  type="text"
                  value={vendorForm.name}
                  onChange={(e) => setVendorForm({ ...vendorForm, name: e.target.value })}
                  className="w-full rounded-lg border px-4 py-3 focus:ring-2 focus:ring-green-500"
                  placeholder={t('vendorNamePlaceholder')}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">{t('email')}</label>
                <input
                  type="email"
                  value={vendorForm.email}
                  onChange={(e) => setVendorForm({ ...vendorForm, email: e.target.value })}
                  className="w-full rounded-lg border px-4 py-3 focus:ring-2 focus:ring-green-500"
                  placeholder={t('vendorEmailPlaceholder')}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">{t('phone')} ({t('phoneIndianFormat')})</label>
                <input
                  type="tel"
                  value={vendorForm.phone}
                  onChange={(e) => setVendorForm({ ...vendorForm, phone: e.target.value })}
                  className="w-full rounded-lg border px-4 py-3 focus:ring-2 focus:ring-green-500"
                  placeholder="+91 1234567890"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">{t('address')}</label>
                <input
                  type="text"
                  value={vendorForm.address}
                  onChange={(e) => setVendorForm({ ...vendorForm, address: e.target.value })}
                  className="w-full rounded-lg border px-4 py-3 focus:ring-2 focus:ring-green-500"
                  placeholder={t('vendorAddressPlaceholder')}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">{t('businessName')}</label>
                <input
                  type="text"
                  value={vendorForm.businessName}
                  onChange={(e) => setVendorForm({ ...vendorForm, businessName: e.target.value })}
                  className="w-full rounded-lg border px-4 py-3 focus:ring-2 focus:ring-green-500"
                  placeholder={t('businessNamePlaceholder')}
                />
              </div>

              <div className="flex flex-col-reverse gap-4 pt-4 sm:flex-row">
                <button
                  onClick={handleAddVendor}
                  className="flex-1 rounded-lg bg-green-600 py-3 font-bold text-white transition hover:bg-green-700"
                >
                  {t('addVendor')}
                </button>
                <button
                  onClick={() => setShowAddVendor(false)}
                  className="rounded-lg border border-gray-300 px-6 py-3 font-bold transition hover:bg-gray-50"
                >
                  {t('cancel')}
                </button>
              </div>


            </div>
          </div>
        </div>
      )}
    </div>
  )
}
