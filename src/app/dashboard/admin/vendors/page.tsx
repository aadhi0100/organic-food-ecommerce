'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { UserPlus, Search, Filter, DollarSign, Package, Store, TrendingUp, Mail, Phone, MapPin, CheckCircle, XCircle } from 'lucide-react'
import Image from 'next/image'
import type { User, Shop } from '@/types'

interface VendorDetails extends User {
  shops: Shop[]
  totalRevenue: number
  totalOrders: number
  avgRating: number
  status: 'active' | 'inactive' | 'pending'
  joinedDate: string
}

export default function AdminVendors() {
  const { user } = useAuth()
  const router = useRouter()
  const [vendors, setVendors] = useState<VendorDetails[]>([])
  const [filteredVendors, setFilteredVendors] = useState<VendorDetails[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedVendor, setSelectedVendor] = useState<VendorDetails | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newVendor, setNewVendor] = useState({
    name: '', email: '', phone: '', address: '', businessName: ''
  })

  const handleAddVendor = async () => {
    try {
      const res = await fetch('/api/admin/vendors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newVendor)
      })
      
      if (res.ok) {
        const data = await res.json()
        const vendor: VendorDetails = {
          ...data.vendor,
          shops: [],
          totalRevenue: 0,
          totalOrders: 0,
          avgRating: 0
        }
        setVendors([...vendors, vendor])
        setShowAddModal(false)
        setNewVendor({ name: '', email: '', phone: '', address: '', businessName: '' })
        alert('Vendor added successfully! Data saved to data/users/')
      }
    } catch (error) {
      alert('Failed to add vendor')
    }
  }

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/login')
      return
    }

    Promise.all([
      fetch('/api/shops').then(r => r.json() as Promise<Shop[]>),
      fetch('/api/admin/vendors').then(r => r.json() as Promise<{ vendors: any[] }>),
    ]).then(([shopsData, vendorsData]) => {
      const vendorList: VendorDetails[] = (vendorsData.vendors || []).map((v) => ({
        ...v,
        shops: shopsData.filter(s => s.owner === v.email),
        totalRevenue: shopsData.filter(s => s.owner === v.email).reduce((sum, s) => sum + s.revenue, 0),
        totalOrders: shopsData.filter(s => s.owner === v.email).reduce((sum, s) => sum + s.totalOrders, 0),
        avgRating: 0,
      }))

      setVendors(vendorList)
      setFilteredVendors(vendorList)
    })
  }, [user, router])

  useEffect(() => {
    let filtered = vendors

    if (searchTerm) {
      filtered = filtered.filter(v => 
        v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(v => v.status === filterStatus)
    }

    setFilteredVendors(filtered)
  }, [searchTerm, filterStatus, vendors])

  const totalVendors = vendors.length
  const activeVendors = vendors.filter(v => v.status === 'active').length
  const totalRevenue = vendors.reduce((sum, v) => sum + v.totalRevenue, 0)
  const totalOrders = vendors.reduce((sum, v) => sum + v.totalOrders, 0)

  const toggleVendorStatus = (vendorId: string) => {
    setVendors(vendors.map(v => 
      v.id === vendorId 
        ? { ...v, status: v.status === 'active' ? 'inactive' : 'active' as 'active' | 'inactive' }
        : v
    ))
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2">Vendor Management</h1>
              <p className="text-gray-600">Manage and monitor all vendors</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition"
            >
              <UserPlus size={20} />
              Add Vendor
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Store className="text-blue-600" size={24} />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm mb-1">Total Vendors</h3>
            <p className="text-3xl font-bold">{totalVendors}</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle className="text-green-600" size={24} />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm mb-1">Active Vendors</h3>
            <p className="text-3xl font-bold">{activeVendors}</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <DollarSign className="text-purple-600" size={24} />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm mb-1">Total Revenue</h3>
            <p className="text-3xl font-bold">${totalRevenue.toLocaleString()}</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-orange-100 p-3 rounded-lg">
                <Package className="text-orange-600" size={24} />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm mb-1">Total Orders</h3>
            <p className="text-3xl font-bold">{totalOrders}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search vendors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Vendor</th>
                  <th className="text-left py-3 px-4">Contact</th>
                  <th className="text-left py-3 px-4">Shops</th>
                  <th className="text-left py-3 px-4">Revenue</th>
                  <th className="text-left py-3 px-4">Orders</th>
                  <th className="text-left py-3 px-4">Rating</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredVendors.map(vendor => (
                  <tr key={vendor.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-bold">{vendor.name}</p>
                        <p className="text-sm text-gray-600">{vendor.email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm">
                        <p className="flex items-center gap-1">
                          <Phone size={14} /> {vendor.phone}
                        </p>
                        <p className="flex items-center gap-1 text-gray-600">
                          <MapPin size={14} /> {vendor.address}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-bold">{vendor.shops.length}</td>
                    <td className="py-4 px-4 font-bold text-green-600">
                      ${vendor.totalRevenue.toLocaleString()}
                    </td>
                    <td className="py-4 px-4 font-bold">{vendor.totalOrders}</td>
                    <td className="py-4 px-4">
                      <span className="font-bold">⭐ {vendor.avgRating}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        vendor.status === 'active' ? 'bg-green-100 text-green-700' :
                        vendor.status === 'inactive' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {vendor.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedVendor(vendor)}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition text-sm font-medium"
                        >
                          View
                        </button>
                        <button
                          onClick={() => toggleVendorStatus(vendor.id)}
                          className={`px-3 py-1 rounded hover:opacity-80 transition text-sm font-medium ${
                            vendor.status === 'active' 
                              ? 'bg-red-100 text-red-700' 
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {vendor.status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedVendor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-3xl font-bold mb-2">{selectedVendor.name}</h2>
                <p className="text-gray-600">{selectedVendor.email}</p>
              </div>
              <button onClick={() => setSelectedVendor(null)} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">${selectedVendor.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Total Orders</p>
                <p className="text-2xl font-bold text-blue-600">{selectedVendor.totalOrders}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Avg Rating</p>
                <p className="text-2xl font-bold text-purple-600">⭐ {selectedVendor.avgRating}</p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-bold mb-4">Shops ({selectedVendor.shops.length})</h3>
              <div className="grid grid-cols-2 gap-4">
                {selectedVendor.shops.map(shop => (
                  <div key={shop.id} className="border rounded-lg p-4">
                    <div className="relative h-32 mb-3 rounded-lg overflow-hidden">
                      <Image src={shop.image} alt={shop.name} fill className="object-cover" />
                    </div>
                    <h4 className="font-bold mb-2">{shop.name}</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Revenue:</span>
                        <span className="font-bold text-green-600">${shop.revenue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Orders:</span>
                        <span className="font-bold">{shop.totalOrders}</span>
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

            <div className="border-t pt-6">
              <h3 className="text-xl font-bold mb-4">Contact Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Phone</p>
                  <p className="font-medium">{selectedVendor.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Address</p>
                  <p className="font-medium">{selectedVendor.address}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Joined Date</p>
                  <p className="font-medium">{new Date(selectedVendor.joinedDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Status</p>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    selectedVendor.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {selectedVendor.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-8">
            <h2 className="text-2xl font-bold mb-6">Add New Vendor</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  value={newVendor.name}
                  onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="Vendor Name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={newVendor.email}
                  onChange={(e) => setNewVendor({ ...newVendor, email: e.target.value })}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="vendor@example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Phone (Indian Format)</label>
                <input
                  type="tel"
                  value={newVendor.phone}
                  onChange={(e) => setNewVendor({ ...newVendor, phone: e.target.value })}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="+91 12345 67890"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Address</label>
                <input
                  type="text"
                  value={newVendor.address}
                  onChange={(e) => setNewVendor({ ...newVendor, address: e.target.value })}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="Mumbai, Maharashtra, India"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Business Name</label>
                <input
                  type="text"
                  value={newVendor.businessName}
                  onChange={(e) => setNewVendor({ ...newVendor, businessName: e.target.value })}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="Business Name"
                />
              </div>
              
              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleAddVendor}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition"
                >
                  Add Vendor
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-3 border border-gray-300 rounded-lg font-bold hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
              
              <p className="text-xs text-gray-500 text-center">
                Data will be saved to: data/users/vendor_[id].txt
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
