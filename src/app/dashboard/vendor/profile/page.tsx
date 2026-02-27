'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { User, Mail, Phone, MapPin, Store, Save, Edit, Building, DollarSign, Package, TrendingUp } from 'lucide-react'
import Image from 'next/image'
import type { Shop } from '@/types'
import { formatIndianCurrency } from '@/utils/indianFormat'

export default function VendorProfile() {
  const { user } = useAuth()
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [shops, setShops] = useState<Shop[]>([])
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    businessName: '',
    taxId: '',
    bankAccount: ''
  })

  useEffect(() => {
    if (!user || user.role !== 'vendor') {
      router.push('/login')
      return
    }

    setProfile({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || '',
      businessName: 'Organic Farms LLC',
      taxId: 'TAX-' + user.id,
      bankAccount: '****' + user.id.slice(-4)
    })

    fetch('/api/shops')
      .then(r => r.json())
      .then(shopsData => {
        const vendorShops = shopsData.filter((s: Shop) => s.owner === user.email)
        setShops(vendorShops)
      })
  }, [user, router])

  const handleSave = () => {
    setEditing(false)
    alert('Profile updated successfully!')
  }

  const totalRevenue = shops.reduce((sum, s) => sum + s.revenue, 0)
  const totalOrders = shops.reduce((sum, s) => sum + s.totalOrders, 0)
  const avgRating = shops.length > 0 ? shops.reduce((sum, s) => sum + s.rating, 0) / shops.length : 0

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Vendor Profile</h1>
            <p className="text-gray-600">Manage your business information</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Total Revenue</h3>
                <DollarSign size={24} />
              </div>
              <p className="text-4xl font-bold mb-2">{formatIndianCurrency(totalRevenue)}</p>
              <p className="text-green-100 text-sm">From all shops</p>
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
                <h3 className="text-lg font-bold">Avg Rating</h3>
                <TrendingUp size={24} />
              </div>
              <p className="text-4xl font-bold mb-2">{avgRating.toFixed(1)} ⭐</p>
              <p className="text-purple-100 text-sm">Across {shops.length} shops</p>
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
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-8">
                <h2 className="text-2xl font-bold mb-6">Business Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Business Name</label>
                    <div className="flex items-center gap-3">
                      <Building className="text-gray-400" size={20} />
                      <input
                        type="text"
                        value={profile.businessName}
                        onChange={(e) => setProfile({ ...profile, businessName: e.target.value })}
                        disabled={!editing}
                        className="flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 disabled:bg-gray-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Tax ID</label>
                    <input
                      type="text"
                      value={profile.taxId}
                      disabled
                      className="w-full px-4 py-3 border rounded-lg bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Bank Account</label>
                    <input
                      type="text"
                      value={profile.bankAccount}
                      disabled
                      className="w-full px-4 py-3 border rounded-lg bg-gray-50"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
                <h2 className="text-xl font-bold mb-6">My Shops</h2>
                <div className="space-y-4">
                  {shops.map(shop => (
                    <div key={shop.id} className="border rounded-lg p-4 hover:shadow-md transition">
                      <div className="relative h-32 mb-3 rounded-lg overflow-hidden">
                        <Image src={shop.image} alt={shop.name} fill className="object-cover" />
                      </div>
                      <h3 className="font-bold mb-2">{shop.name}</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Revenue:</span>
                          <span className="font-bold text-green-600">{formatIndianCurrency(shop.revenue)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Orders:</span>
                          <span className="font-bold">{shop.totalOrders}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Rating:</span>
                          <span className="font-bold">⭐ {shop.rating}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                            {shop.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
