'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { User, Mail, Phone, MapPin, Save, Edit, Shield, Activity, Users, Store, DollarSign, Package } from 'lucide-react'
import type { Shop } from '@/types'

export default function AdminProfile() {
  const { user } = useAuth()
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [shops, setShops] = useState<Shop[]>([])
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    role: 'admin',
    adminLevel: 'Super Admin',
    department: 'Operations'
  })

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/login')
      return
    }

    setProfile({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || '',
      role: 'admin',
      adminLevel: 'Super Admin',
      department: 'Operations'
    })

    fetch('/api/shops')
      .then(r => r.json())
      .then(shopsData => setShops(shopsData))
  }, [user, router])

  const handleSave = () => {
    setEditing(false)
    alert('Profile updated successfully!')
  }

  const totalRevenue = shops.reduce((sum, s) => sum + s.revenue, 0)
  const totalOrders = shops.reduce((sum, s) => sum + s.totalOrders, 0)
  const totalVendors = shops.length

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Admin Profile</h1>
            <p className="text-gray-600">System administrator account</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Platform Revenue</h3>
                <DollarSign size={24} />
              </div>
              <p className="text-4xl font-bold mb-2">₹{totalRevenue.toLocaleString('en-IN')}</p>
              <p className="text-green-100 text-sm">Total from all vendors</p>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Total Orders</h3>
                <Package size={24} />
              </div>
              <p className="text-4xl font-bold mb-2">{totalOrders}</p>
              <p className="text-blue-100 text-sm">Platform-wide orders</p>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Active Vendors</h3>
                <Store size={24} />
              </div>
              <p className="text-4xl font-bold mb-2">{totalVendors}</p>
              <p className="text-purple-100 text-sm">Registered vendors</p>
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
                <h2 className="text-2xl font-bold mb-6">Admin Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Role</label>
                    <div className="flex items-center gap-3">
                      <Shield className="text-gray-400" size={20} />
                      <input
                        type="text"
                        value={profile.role}
                        disabled
                        className="flex-1 px-4 py-3 border rounded-lg bg-gray-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Admin Level</label>
                    <input
                      type="text"
                      value={profile.adminLevel}
                      disabled
                      className="w-full px-4 py-3 border rounded-lg bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Department</label>
                    <input
                      type="text"
                      value={profile.department}
                      onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                      disabled={!editing}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 disabled:bg-gray-50"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
                <h2 className="text-xl font-bold mb-6">Admin Privileges</h2>
                <div className="space-y-4">
                  <div className="border-b pb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="text-green-600" size={20} />
                      <p className="font-bold">User Management</p>
                    </div>
                    <p className="text-sm text-gray-600">Full access to manage all users</p>
                  </div>
                  <div className="border-b pb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Store className="text-blue-600" size={20} />
                      <p className="font-bold">Vendor Management</p>
                    </div>
                    <p className="text-sm text-gray-600">Approve and manage vendors</p>
                  </div>
                  <div className="border-b pb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="text-purple-600" size={20} />
                      <p className="font-bold">Order Management</p>
                    </div>
                    <p className="text-sm text-gray-600">View and manage all orders</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="text-orange-600" size={20} />
                      <p className="font-bold">Analytics Access</p>
                    </div>
                    <p className="text-sm text-gray-600">Full platform analytics</p>
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
