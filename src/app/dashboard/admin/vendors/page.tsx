'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import { useRouter } from 'next/navigation'
import { UserPlus, Search, DollarSign, Package, Store, Mail, Phone, MapPin, CheckCircle, XCircle } from 'lucide-react'
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
  const { t } = useLanguage()
  const router = useRouter()
  const [vendors, setVendors] = useState<VendorDetails[]>([])
  const [filteredVendors, setFilteredVendors] = useState<VendorDetails[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedVendor, setSelectedVendor] = useState<VendorDetails | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newVendor, setNewVendor] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    businessName: '',
  })

  const handleAddVendor = async () => {
    try {
      const res = await fetch('/api/admin/vendors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newVendor),
      })

      if (res.ok) {
        const data = await res.json()
        const vendor: VendorDetails = {
          ...data.vendor,
          shops: [],
          totalRevenue: 0,
          totalOrders: 0,
          avgRating: 0,
        }
        setVendors([...vendors, vendor])
        setShowAddModal(false)
        setNewVendor({ name: '', email: '', phone: '', address: '', businessName: '' })
        alert(t('vendorAddedSuccessfully'))
      }
    } catch {
      alert(t('failedToAddVendor'))
    }
  }

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/login')
      return
    }

    Promise.all([
      fetch('/api/shops').then((r) => r.json() as Promise<Shop[]>),
      fetch('/api/admin/vendors').then((r) => r.json() as Promise<{ vendors: any[] }>),
    ]).then(([shopsData, vendorsData]) => {
      const vendorList: VendorDetails[] = (vendorsData.vendors || []).map((v) => ({
        ...v,
        shops: shopsData.filter((s) => s.owner === v.email),
        totalRevenue: shopsData.filter((s) => s.owner === v.email).reduce((sum, s) => sum + s.revenue, 0),
        totalOrders: shopsData.filter((s) => s.owner === v.email).reduce((sum, s) => sum + s.totalOrders, 0),
        avgRating: 0,
      }))

      setVendors(vendorList)
      setFilteredVendors(vendorList)
    })
  }, [user, router])

  useEffect(() => {
    let filtered = vendors

    if (searchTerm) {
      filtered = filtered.filter(
        (v) =>
          v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          v.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter((v) => v.status === filterStatus)
    }

    setFilteredVendors(filtered)
  }, [searchTerm, filterStatus, vendors])

  const totalVendors = vendors.length
  const activeVendors = vendors.filter((v) => v.status === 'active').length
  const totalRevenue = vendors.reduce((sum, v) => sum + v.totalRevenue, 0)
  const totalOrders = vendors.reduce((sum, v) => sum + v.totalOrders, 0)

  const toggleVendorStatus = (vendorId: string) => {
    setVendors(
      vendors.map((v) =>
        v.id === vendorId ? { ...v, status: v.status === 'active' ? 'inactive' : ('active' as 'active' | 'inactive') } : v,
      ),
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mb-2 text-4xl font-bold">{t('vendorManagement')}</h1>
              <p className="text-gray-600">{t('manageAndMonitorAllVendors')}</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 rounded-lg bg-green-600 px-6 py-3 font-bold text-white transition hover:bg-green-700"
            >
              <UserPlus size={20} />
              {t('addVendor')}
            </button>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
          <div className="rounded-xl bg-white p-6 shadow-md">
            <div className="mb-4 flex items-center justify-between">
              <div className="rounded-lg bg-blue-100 p-3">
                <Store className="text-blue-600" size={24} />
              </div>
            </div>
            <h3 className="mb-1 text-sm text-gray-600">{t('totalVendors')}</h3>
            <p className="text-3xl font-bold">{totalVendors}</p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-md">
            <div className="mb-4 flex items-center justify-between">
              <div className="rounded-lg bg-green-100 p-3">
                <CheckCircle className="text-green-600" size={24} />
              </div>
            </div>
            <h3 className="mb-1 text-sm text-gray-600">{t('activeVendors')}</h3>
            <p className="text-3xl font-bold">{activeVendors}</p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-md">
            <div className="mb-4 flex items-center justify-between">
              <div className="rounded-lg bg-purple-100 p-3">
                <DollarSign className="text-purple-600" size={24} />
              </div>
            </div>
            <h3 className="mb-1 text-sm text-gray-600">{t('totalRevenue')}</h3>
            <p className="text-3xl font-bold">₹{totalRevenue.toLocaleString()}</p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-md">
            <div className="mb-4 flex items-center justify-between">
              <div className="rounded-lg bg-orange-100 p-3">
                <Package className="text-orange-600" size={24} />
              </div>
            </div>
            <h3 className="mb-1 text-sm text-gray-600">{t('totalOrders')}</h3>
            <p className="text-3xl font-bold">{totalOrders}</p>
          </div>
        </div>

        <div className="mb-8 rounded-xl bg-white p-6 shadow-md">
          <div className="mb-6 flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder={t('searchVendors')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border py-3 pl-10 pr-4 focus:ring-2 focus:ring-green-500"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded-lg border px-4 py-3 focus:ring-2 focus:ring-green-500"
            >
              <option value="all">{t('allStatus')}</option>
              <option value="active">{t('active')}</option>
              <option value="inactive">{t('inactive')}</option>
              <option value="pending">{t('pending')}</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 text-left">{t('vendor')}</th>
                  <th className="px-4 py-3 text-left">{t('contact')}</th>
                  <th className="px-4 py-3 text-left">{t('shops')}</th>
                  <th className="px-4 py-3 text-left">{t('revenue')}</th>
                  <th className="px-4 py-3 text-left">{t('orders')}</th>
                  <th className="px-4 py-3 text-left">{t('rating')}</th>
                  <th className="px-4 py-3 text-left">{t('status')}</th>
                  <th className="px-4 py-3 text-left">{t('actions')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredVendors.map((vendor) => (
                  <tr key={vendor.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-bold">{vendor.name}</p>
                        <p className="text-sm text-gray-600">{vendor.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm">
                        <p className="flex items-center gap-1">
                          <Phone size={14} /> {vendor.phone}
                        </p>
                        <p className="flex items-center gap-1 text-gray-600">
                          <MapPin size={14} /> {vendor.address}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-4 font-bold">{vendor.shops.length}</td>
                    <td className="px-4 py-4 font-bold text-green-600">₹{vendor.totalRevenue.toLocaleString()}</td>
                    <td className="px-4 py-4 font-bold">{vendor.totalOrders}</td>
                    <td className="px-4 py-4">
                      <span className="font-bold">⭐ {vendor.avgRating}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          vendor.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : vendor.status === 'inactive'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {t(vendor.status)}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedVendor(vendor)}
                          className="rounded bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 transition hover:bg-blue-200"
                        >
                          {t('view')}
                        </button>
                        <button
                          onClick={() => toggleVendorStatus(vendor.id)}
                          className={`rounded px-3 py-1 text-sm font-medium transition hover:opacity-80 ${
                            vendor.status === 'active' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {vendor.status === 'active' ? t('deactivate') : t('activate')}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white p-8">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 className="mb-2 text-3xl font-bold">{selectedVendor.name}</h2>
                <p className="text-gray-600">{selectedVendor.email}</p>
              </div>
              <button onClick={() => setSelectedVendor(null)} className="text-gray-500 hover:text-gray-700">
                ×
              </button>
            </div>

            <div className="mb-6 grid grid-cols-3 gap-4">
              <div className="rounded-lg bg-green-50 p-4">
                <p className="mb-1 text-sm text-gray-600">{t('totalRevenue')}</p>
                <p className="text-2xl font-bold text-green-600">₹{selectedVendor.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="rounded-lg bg-blue-50 p-4">
                <p className="mb-1 text-sm text-gray-600">{t('totalOrders')}</p>
                <p className="text-2xl font-bold text-blue-600">{selectedVendor.totalOrders}</p>
              </div>
              <div className="rounded-lg bg-purple-50 p-4">
                <p className="mb-1 text-sm text-gray-600">{t('avgRating')}</p>
                <p className="text-2xl font-bold text-purple-600">⭐ {selectedVendor.avgRating}</p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="mb-4 text-xl font-bold">
                {t('shops')} ({selectedVendor.shops.length})
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {selectedVendor.shops.map((shop) => (
                  <div key={shop.id} className="rounded-lg border p-4">
                    <div className="relative mb-3 h-32 overflow-hidden rounded-lg">
                      <Image src={shop.image} alt={shop.name} fill className="object-cover" />
                    </div>
                    <h4 className="mb-2 font-bold">{shop.name}</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t('revenue')}:</span>
                        <span className="font-bold text-green-600">₹{shop.revenue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t('orders')}:</span>
                        <span className="font-bold">{shop.totalOrders}</span>
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

            <div className="border-t pt-6">
              <h3 className="mb-4 text-xl font-bold">{t('contactInformation')}</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="mb-1 text-sm text-gray-600">{t('phone')}</p>
                  <p className="font-medium">{selectedVendor.phone}</p>
                </div>
                <div>
                  <p className="mb-1 text-sm text-gray-600">{t('address')}</p>
                  <p className="font-medium">{selectedVendor.address}</p>
                </div>
                <div>
                  <p className="mb-1 text-sm text-gray-600">{t('joinedDate')}</p>
                  <p className="font-medium">{new Date(selectedVendor.joinedDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="mb-1 text-sm text-gray-600">{t('status')}</p>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      selectedVendor.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {t(selectedVendor.status)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-2xl rounded-xl bg-white p-8">
            <h2 className="mb-6 text-2xl font-bold">{t('addNewVendor')}</h2>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">{t('name')}</label>
                <input
                  type="text"
                  value={newVendor.name}
                  onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })}
                  className="w-full rounded-lg border px-4 py-3 focus:ring-2 focus:ring-green-500"
                  placeholder={t('vendorNamePlaceholder')}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">{t('email')}</label>
                <input
                  type="email"
                  value={newVendor.email}
                  onChange={(e) => setNewVendor({ ...newVendor, email: e.target.value })}
                  className="w-full rounded-lg border px-4 py-3 focus:ring-2 focus:ring-green-500"
                  placeholder={t('vendorEmailPlaceholder')}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">{t('phone')} ({t('phoneIndianFormat')})</label>
                <input
                  type="tel"
                  value={newVendor.phone}
                  onChange={(e) => setNewVendor({ ...newVendor, phone: e.target.value })}
                  className="w-full rounded-lg border px-4 py-3 focus:ring-2 focus:ring-green-500"
                  placeholder="+91 12345 67890"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">{t('address')}</label>
                <input
                  type="text"
                  value={newVendor.address}
                  onChange={(e) => setNewVendor({ ...newVendor, address: e.target.value })}
                  className="w-full rounded-lg border px-4 py-3 focus:ring-2 focus:ring-green-500"
                  placeholder={t('vendorAddressPlaceholder')}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">{t('businessName')}</label>
                <input
                  type="text"
                  value={newVendor.businessName}
                  onChange={(e) => setNewVendor({ ...newVendor, businessName: e.target.value })}
                  className="w-full rounded-lg border px-4 py-3 focus:ring-2 focus:ring-green-500"
                  placeholder={t('businessNamePlaceholder')}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleAddVendor}
                  className="flex-1 rounded-lg bg-green-600 py-3 font-bold text-white transition hover:bg-green-700"
                >
                  {t('addVendor')}
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="rounded-lg border border-gray-300 px-6 py-3 font-bold transition hover:bg-gray-50"
                >
                  {t('cancel')}
                </button>
              </div>

              <p className="text-center text-xs text-gray-500">
                {t('dataWillBeSavedTo')}: data/users/vendor_[id].txt
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
