'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Package, DollarSign, ShoppingCart, Users, TrendingUp, Store, MapPin, UserCheck, Activity } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import type { Order, Shop, User } from '@/types'

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

export default function AdminDashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<any>(null)
  const [shops, setShops] = useState<Shop[]>([])
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [vendors, setVendors] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/login')
      return
    }

    Promise.all([
      fetch('/api/admin/stats').then(r => r.json()),
      fetch('/api/shops').then(r => r.json()),
      fetch('/api/orders').then(r => r.json())
    ]).then(([statsData, shopsData, ordersData]) => {
      setStats(statsData)
      setShops(shopsData)
      setRecentOrders(ordersData.slice(0, 10))
      
      // Mock vendor data
      const vendorList: User[] = [
        { id: '2', email: 'vendor@organic.com', name: 'Vendor User', role: 'vendor', phone: '+1234567891', address: '456 Vendor Ave, NY' },
        { id: '3', email: 'vendor2@organic.com', name: 'Vendor Two', role: 'vendor', phone: '+1234567893', address: '789 Vendor Blvd, NY' },
      ]
      setVendors(vendorList)
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

  const categoryData = [
    { name: 'Fruits', value: 35, amount: 15000 },
    { name: 'Vegetables', value: 30, amount: 12000 },
    { name: 'Dairy', value: 20, amount: 8000 },
    { name: 'Grains', value: 10, amount: 5000 },
    { name: 'Others', value: 5, amount: 3000 },
  ]

  const vendorRevenueData = shops.map(shop => ({
    name: shop.name,
    revenue: shop.revenue,
    orders: shop.totalOrders
  }))

  const totalVendorRevenue = shops.reduce((sum, shop) => sum + shop.revenue, 0)
  const totalVendorOrders = shops.reduce((sum, shop) => sum + shop.totalOrders, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <DollarSign className="text-green-600" size={24} />
              </div>
              <span className="text-green-600 text-sm font-medium">+12.5%</span>
            </div>
            <h3 className="text-gray-600 text-sm mb-1">Total Revenue</h3>
            <p className="text-3xl font-bold">${stats?.totalRevenue?.toLocaleString() || 0}</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <ShoppingCart className="text-blue-600" size={24} />
              </div>
              <span className="text-blue-600 text-sm font-medium">+8.2%</span>
            </div>
            <h3 className="text-gray-600 text-sm mb-1">Total Orders</h3>
            <p className="text-3xl font-bold">{stats?.totalOrders || 0}</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Store className="text-purple-600" size={24} />
              </div>
              <span className="text-purple-600 text-sm font-medium">Active</span>
            </div>
            <h3 className="text-gray-600 text-sm mb-1">Total Vendors</h3>
            <p className="text-3xl font-bold">{vendors.length}</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-orange-100 p-3 rounded-lg">
                <Users className="text-orange-600" size={24} />
              </div>
              <span className="text-orange-600 text-sm font-medium">+15.3%</span>
            </div>
            <h3 className="text-gray-600 text-sm mb-1">Total Customers</h3>
            <p className="text-3xl font-bold">{stats?.totalCustomers || 0}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Vendor Revenue</h3>
              <Activity size={24} />
            </div>
            <p className="text-4xl font-bold mb-2">${totalVendorRevenue.toLocaleString()}</p>
            <p className="text-green-100">Total from all vendors</p>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Vendor Orders</h3>
              <ShoppingCart size={24} />
            </div>
            <p className="text-4xl font-bold mb-2">{totalVendorOrders.toLocaleString()}</p>
            <p className="text-blue-100">Orders processed by vendors</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Active Shops</h3>
              <Store size={24} />
            </div>
            <p className="text-4xl font-bold mb-2">{shops.length}</p>
            <p className="text-purple-100">Shops currently operating</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <TrendingUp className="text-green-600" />
              Monthly Revenue
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

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Store className="text-blue-600" />
              Vendor Revenue Distribution
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-6">Sales by Category</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: $${value}k`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="amount"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <UserCheck className="text-purple-600" />
              Vendor Performance
            </h2>
            <div className="space-y-4">
              {vendors.map((vendor, idx) => {
                const vendorShops = shops.filter(s => s.owner === vendor.email)
                const vendorRevenue = vendorShops.reduce((sum, s) => sum + s.revenue, 0)
                const vendorOrders = vendorShops.reduce((sum, s) => sum + s.totalOrders, 0)
                return (
                  <div key={vendor.id} className="border rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-lg">{vendor.name}</h3>
                        <p className="text-sm text-gray-600">{vendor.email}</p>
                      </div>
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                        Active
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <div>
                        <p className="text-xs text-gray-600">Shops</p>
                        <p className="text-xl font-bold">{vendorShops.length}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Orders</p>
                        <p className="text-xl font-bold">{vendorOrders}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Revenue</p>
                        <p className="text-xl font-bold text-green-600">${vendorRevenue.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Store className="text-green-600" />
            Shops Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {shops.map(shop => (
              <div key={shop.id} className="border rounded-lg p-4 hover:shadow-lg transition">
                <div className="relative h-32 mb-3 rounded-lg overflow-hidden">
                  <Image src={shop.image} alt={shop.name} fill className="object-cover" />
                </div>
                <h3 className="font-bold text-lg mb-2">{shop.name}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin size={14} />
                    <span className="truncate">{shop.location.address}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Orders:</span>
                    <span className="font-bold">{shop.totalOrders}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Revenue:</span>
                    <span className="font-bold text-green-600">${shop.revenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rating:</span>
                    <span className="font-bold">⭐ {shop.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Order ID</th>
                  <th className="text-left py-3 px-4">Customer</th>
                  <th className="text-left py-3 px-4">Items</th>
                  <th className="text-left py-3 px-4">Total</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">#{order.id}</td>
                    <td className="py-3 px-4">{order.shippingAddress.fullName}</td>
                    <td className="py-3 px-4">{order.items.length} items</td>
                    <td className="py-3 px-4 font-bold">${order.total.toFixed(2)}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                        order.status === 'processing' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
