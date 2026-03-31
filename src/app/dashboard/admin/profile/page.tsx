'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import { useRouter } from 'next/navigation'
import { User, Mail, Phone, MapPin, Save, Edit, Shield, Activity, Users, Store, DollarSign, Package } from 'lucide-react'
import type { Shop } from '@/types'

export default function AdminProfile() {
  const { user } = useAuth()
  const { t } = useLanguage()
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
    department: 'Operations',
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
      department: 'Operations',
    })

    fetch('/api/shops')
      .then((r) => r.json())
      .then((shopsData) => setShops(shopsData))
  }, [user, router])

  const handleSave = () => {
    setEditing(false)
    alert(t('profileUpdatedSuccessfully'))
  }

  const totalRevenue = shops.reduce((sum, s) => sum + s.revenue, 0)
  const totalOrders = shops.reduce((sum, s) => sum + s.totalOrders, 0)
  const totalVendors = shops.length

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <h1 className="mb-2 text-4xl font-bold">{t('adminProfile')}</h1>
            <p className="text-gray-600">{t('systemAdministratorAccount')}</p>
          </div>

          <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="rounded-xl bg-gradient-to-br from-green-500 to-green-600 p-6 text-white shadow-lg">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold">{t('platformRevenue')}</h3>
                <DollarSign size={24} />
              </div>
              <p className="mb-2 text-4xl font-bold">₹{totalRevenue.toLocaleString('en-IN')}</p>
              <p className="text-green-100 text-sm">{t('totalFromAllVendors')}</p>
            </div>

            <div className="rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white shadow-lg">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold">{t('totalOrders')}</h3>
                <Package size={24} />
              </div>
              <p className="mb-2 text-4xl font-bold">{totalOrders}</p>
              <p className="text-blue-100 text-sm">{t('platformWideOrders')}</p>
            </div>

            <div className="rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 p-6 text-white shadow-lg">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold">{t('activeVendors')}</h3>
                <Store size={24} />
              </div>
              <p className="mb-2 text-4xl font-bold">{totalVendors}</p>
              <p className="text-purple-100 text-sm">{t('registeredVendors')}</p>
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
                </div>
              </div>

              <div className="rounded-xl bg-white p-8 shadow-md">
                <h2 className="mb-6 text-2xl font-bold">{t('adminInformation')}</h2>

                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium">{t('role')}</label>
                    <div className="flex items-center gap-3">
                      <Shield className="text-gray-400" size={20} />
                      <input
                        type="text"
                        value={profile.role}
                        disabled
                        className="flex-1 rounded-lg border bg-gray-50 px-4 py-3"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">{t('adminLevel')}</label>
                    <input
                      type="text"
                      value={profile.adminLevel}
                      disabled
                      className="w-full rounded-lg border bg-gray-50 px-4 py-3"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">{t('department')}</label>
                    <input
                      type="text"
                      value={profile.department}
                      onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                      disabled={!editing}
                      className="w-full rounded-lg border px-4 py-3 focus:ring-2 focus:ring-green-500 disabled:bg-gray-50"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-xl bg-white p-6 shadow-md">
                <h2 className="mb-6 text-xl font-bold">{t('adminPrivileges')}</h2>
                <div className="space-y-4">
                  <div className="border-b pb-4">
                    <div className="mb-2 flex items-center gap-2">
                      <Users className="text-green-600" size={20} />
                      <p className="font-bold">{t('userManagement')}</p>
                    </div>
                    <p className="text-sm text-gray-600">{t('fullAccessToManageAllUsers')}</p>
                  </div>
                  <div className="border-b pb-4">
                    <div className="mb-2 flex items-center gap-2">
                      <Store className="text-blue-600" size={20} />
                      <p className="font-bold">{t('vendorManagement')}</p>
                    </div>
                    <p className="text-sm text-gray-600">{t('approveAndManageVendors')}</p>
                  </div>
                  <div className="border-b pb-4">
                    <div className="mb-2 flex items-center gap-2">
                      <Package className="text-purple-600" size={20} />
                      <p className="font-bold">{t('orderManagement')}</p>
                    </div>
                    <p className="text-sm text-gray-600">{t('viewAndManageAllOrders')}</p>
                  </div>
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <Activity className="text-orange-600" size={20} />
                      <p className="font-bold">{t('analyticsAccess')}</p>
                    </div>
                    <p className="text-sm text-gray-600">{t('fullPlatformAnalytics')}</p>
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
