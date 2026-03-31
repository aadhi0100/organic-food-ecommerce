'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import { useRouter } from 'next/navigation'
import { User, Mail, Phone, MapPin, Save, Edit, Building, DollarSign, Package, TrendingUp } from 'lucide-react'
import Image from 'next/image'
import type { Shop } from '@/types'
import { formatIndianCurrency } from '@/utils/indianFormat'

export default function VendorProfile() {
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
    businessName: '',
    taxId: '',
    bankAccount: '',
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
      bankAccount: '****' + user.id.slice(-4),
    })

    fetch('/api/shops')
      .then((r) => r.json())
      .then((shopsData) => {
        const vendorShops = shopsData.filter((s: Shop) => s.owner === user.email)
        setShops(vendorShops)
      })
  }, [user, router])

  const handleSave = () => {
    setEditing(false)
    alert(t('profileUpdatedSuccessfully'))
  }

  const totalRevenue = shops.reduce((sum, s) => sum + s.revenue, 0)
  const totalOrders = shops.reduce((sum, s) => sum + s.totalOrders, 0)
  const avgRating = shops.length > 0 ? shops.reduce((sum, s) => sum + s.rating, 0) / shops.length : 0

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <h1 className="mb-2 text-4xl font-bold">{t('vendorProfile')}</h1>
            <p className="text-gray-600">{t('manageYourBusinessInformation')}</p>
          </div>

          <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="rounded-xl bg-gradient-to-br from-green-500 to-green-600 p-6 text-white shadow-lg">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold">{t('totalRevenue')}</h3>
                <DollarSign size={24} />
              </div>
              <p className="mb-2 text-4xl font-bold">{formatIndianCurrency(totalRevenue)}</p>
              <p className="text-green-100 text-sm">{t('fromAllShops')}</p>
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
                <h3 className="text-lg font-bold">{t('avgRating')}</h3>
                <TrendingUp size={24} />
              </div>
              <p className="mb-2 text-4xl font-bold">{avgRating.toFixed(1)} ⭐</p>
              <p className="text-purple-100 text-sm">{t('acrossShops', { count: shops.length })}</p>
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
                <h2 className="mb-6 text-2xl font-bold">{t('businessInformation')}</h2>

                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium">{t('businessName')}</label>
                    <div className="flex items-center gap-3">
                      <Building className="text-gray-400" size={20} />
                      <input
                        type="text"
                        value={profile.businessName}
                        onChange={(e) => setProfile({ ...profile, businessName: e.target.value })}
                        disabled={!editing}
                        className="flex-1 rounded-lg border px-4 py-3 focus:ring-2 focus:ring-green-500 disabled:bg-gray-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">{t('taxId')}</label>
                    <input
                      type="text"
                      value={profile.taxId}
                      disabled
                      className="w-full rounded-lg border bg-gray-50 px-4 py-3"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">{t('bankAccount')}</label>
                    <input
                      type="text"
                      value={profile.bankAccount}
                      disabled
                      className="w-full rounded-lg border bg-gray-50 px-4 py-3"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-xl bg-white p-6 shadow-md">
                <h2 className="mb-6 text-xl font-bold">{t('myShops')}</h2>
                <div className="space-y-4">
                  {shops.map((shop) => (
                    <div key={shop.id} className="rounded-lg border p-4 transition hover:shadow-md">
                      <div className="relative mb-3 h-32 overflow-hidden rounded-lg">
                        <Image src={shop.image} alt={shop.name} fill className="object-cover" />
                      </div>
                      <h3 className="mb-2 font-bold">{shop.name}</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">{t('revenue')}:</span>
                          <span className="font-bold text-green-600">{formatIndianCurrency(shop.revenue)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">{t('orders')}:</span>
                          <span className="font-bold">{shop.totalOrders}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">{t('rating')}:</span>
                          <span className="font-bold">⭐ {shop.rating}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">{t('status')}:</span>
                          <span className="rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                            {t(shop.status)}
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
