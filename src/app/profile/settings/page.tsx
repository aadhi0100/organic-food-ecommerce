'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Camera,
  Check,
  Home,
  MapPin,
  Plus,
  Save,
  ShieldCheck,
  Trash2,
  User,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import type { Address, Order, User as AppUser } from '@/types'
import { formatIndianCurrency } from '@/utils/indianFormat'
import { SafeImage } from '@/components/SafeImage'

type ProfileState = {
  name: string
  phone: string
  address: string
}

type AddressForm = {
  fullName: string
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  phone: string
}

function translateApiMessage(message: string | undefined, t: (key: string, params?: Record<string, string | number>) => string) {
  if (!message) return ''

  const known: Record<string, string> = {
    'Unable to save profile': 'unableToSaveProfile',
    'Unable to save address': 'unableToSaveAddress',
    'Profile updated successfully': 'profileUpdatedSuccessfully',
    'Address saved successfully': 'addressSavedSuccessfully',
  }

  const key = known[message]
  return key ? t(key) : t(message)
}

export default function ProfileSettingsPage() {
  const router = useRouter()
  const { user, isLoading, refreshSession } = useAuth()
  const { t } = useLanguage()
  const [profile, setProfile] = useState<ProfileState>({ name: '', phone: '', address: '' })
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null)
  const [profilePreview, setProfilePreview] = useState('')
  const [addresses, setAddresses] = useState<Address[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [isSavingAddress, setIsSavingAddress] = useState(false)
  const [message, setMessage] = useState('')
  const [addressForm, setAddressForm] = useState<AddressForm>({
    fullName: '',
    street: '',
    city: 'Chennai',
    state: 'Tamil Nadu',
    zipCode: '600001',
    country: 'India',
    phone: '',
  })

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login?next=/profile/settings')
    }
  }, [isLoading, router, user])

  useEffect(() => {
    if (!user) return

    setProfile({
      name: user.name || '',
      phone: user.phone || '',
      address: user.address || '',
    })
    setAddressForm((current) => ({
      ...current,
      fullName: user.name || current.fullName,
      phone: user.phone || current.phone,
      street: user.address || current.street,
    }))
    setProfilePreview(user.profilePhoto || user.picture || '')

    Promise.all([
      fetch('/api/profile', { credentials: 'include' }).then((res) => res.json()),
      fetch(`/api/orders?userId=${encodeURIComponent(user.id)}`, { credentials: 'include' }).then((res) => res.json()),
      fetch('/api/profile/addresses', { credentials: 'include' }).then((res) => res.json()),
    ])
      .then(([profileData, ordersData, addressData]) => {
        const nextUser = (profileData?.user || user) as AppUser
        setProfile({
          name: nextUser.name || '',
          phone: nextUser.phone || '',
          address: nextUser.address || '',
        })
        setProfilePreview(nextUser.profilePhoto || nextUser.picture || '')
        setAddresses(Array.isArray(addressData?.addresses) ? addressData.addresses : nextUser.addresses || [])
        setOrders(Array.isArray(ordersData) ? ordersData : [])
      })
      .catch(() => {
        setAddresses(user.addresses || [])
        setOrders([])
      })
  }, [user])

  const totalSpent = useMemo(() => orders.reduce((sum, order) => sum + order.total, 0), [orders])
  const totalOrders = orders.length
  const currentAddressCount = addresses.length

  const handleProfileSave = async () => {
    if (!user) return
    setIsSavingProfile(true)
    setMessage('')

    try {
      const formData = new FormData()
      formData.set('name', profile.name)
      formData.set('phone', profile.phone)
      formData.set('address', profile.address)
      if (profilePhoto) {
        formData.set('profilePhoto', profilePhoto)
      }

      const response = await fetch('/api/profile', {
        method: 'PUT',
        body: formData,
        credentials: 'include',
      })

      const payload = await response.json().catch(() => null)
      if (!response.ok) {
        throw new Error(translateApiMessage(payload?.error, t) || t('unableToSaveProfile'))
      }

      await refreshSession()
      setMessage(t('profileUpdatedSuccessfully'))
    } catch (error) {
      setMessage(error instanceof Error ? translateApiMessage(error.message, t) || error.message : t('unableToSaveProfile'))
    } finally {
      setIsSavingProfile(false)
    }
  }



  const handleAddressSave = async () => {
    setIsSavingAddress(true)
    setMessage('')
    try {
      const response = await fetch('/api/profile/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          type: 'home',
          isDefault: true,
          ...addressForm,
        }),
      })
      const payload = await response.json().catch(() => null)
      if (!response.ok) {
        throw new Error(translateApiMessage(payload?.error, t) || t('unableToSaveAddress'))
      }
      setAddresses(Array.isArray(payload?.user?.addresses) ? payload.user.addresses : addresses)
      setMessage(t('addressSavedSuccessfully'))
      setAddressForm((current) => ({ ...current, street: '' }))
      await refreshSession()
    } catch (error) {
      setMessage(error instanceof Error ? translateApiMessage(error.message, t) || error.message : t('unableToSaveAddress'))
    } finally {
      setIsSavingAddress(false)
    }
  }

  const handleSetDefaultAddress = async (addressId: string) => {
    await fetch('/api/profile/addresses', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ addressId, setDefault: true }),
    })
    const response = await fetch('/api/profile/addresses', { credentials: 'include' })
    const payload = await response.json()
    setAddresses(Array.isArray(payload?.addresses) ? payload.addresses : [])
    await refreshSession()
  }

  const handleDeleteAddress = async (addressId: string) => {
    await fetch(`/api/profile/addresses?addressId=${encodeURIComponent(addressId)}`, {
      method: 'DELETE',
      credentials: 'include',
    })
    const response = await fetch('/api/profile/addresses', { credentials: 'include' })
    const payload = await response.json()
    setAddresses(Array.isArray(payload?.addresses) ? payload.addresses : [])
    await refreshSession()
  }

  if (isLoading || !user) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-green-200 border-t-green-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#dcfce7,_#f8fafc_45%,_#eef7ef_100%)] px-3 py-6 sm:px-4 sm:py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-green-700">{t('profileSettings')}</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">{t('manageYourAccount')}</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">{t('profileSettingsSubtitle')}</p>
          </div>
          <Link
            href="/dashboard/customer"
            className="w-full rounded-full border border-green-600 px-5 py-3 text-center text-sm font-semibold text-green-700 transition hover:bg-green-50 sm:w-auto"
          >
            {t('backToDashboard')}
          </Link>
        </div>

        {message && (
          <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800 sm:px-5 sm:py-4">
            {translateApiMessage(message, t) || message}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1.35fr_0.95fr]">
          <div className="space-y-6">
            <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-xl backdrop-blur">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-green-700">{t('overview')}</p>
                  <h2 className="mt-2 text-2xl font-bold text-slate-900">{t('accountSnapshot')}</h2>
                </div>
                <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-3">
                  <div className="rounded-2xl bg-slate-50 px-4 py-3">
                    <div className="text-xs uppercase tracking-[0.2em] text-slate-500">{t('orders')}</div>
                    <div className="mt-1 text-xl font-bold text-slate-900">{totalOrders}</div>
                  </div>
                  <div className="rounded-2xl bg-slate-50 px-4 py-3">
                    <div className="text-xs uppercase tracking-[0.2em] text-slate-500">{t('spent')}</div>
                    <div className="mt-1 text-xl font-bold text-slate-900">{formatIndianCurrency(totalSpent)}</div>
                  </div>
                  <div className="rounded-2xl bg-slate-50 px-4 py-3">
                    <div className="text-xs uppercase tracking-[0.2em] text-slate-500">{t('addresses')}</div>
                    <div className="mt-1 text-xl font-bold text-slate-900">{currentAddressCount}</div>
                  </div>
                </div>
              </div>
            </section>

            <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-xl backdrop-blur">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-green-700">{t('editProfile')}</p>
                  <h2 className="mt-2 text-2xl font-bold text-slate-900">{t('personalDetails')}</h2>
                </div>
                <button
                  onClick={handleProfileSave}
                  disabled={isSavingProfile}
                  className="inline-flex items-center gap-2 rounded-full bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {isSavingProfile ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" /> : <Save className="h-4 w-4" />}
                  {t('saveChanges')}
                </button>
              </div>

              <div className="grid gap-6 md:grid-cols-[120px_1fr] lg:grid-cols-[180px_1fr]">
                <div className="space-y-3 sm:space-y-4">
                  <div className="relative mx-auto h-32 w-32 overflow-hidden rounded-[1.5rem] border-4 border-white shadow-lg sm:h-40 sm:w-40">
                    {profilePreview ? (
                      <SafeImage
                        src={profilePreview}
                        alt={profile.name || t('profilePhoto')}
                        fill
                        className="object-cover"
                        sizes="160px"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-green-600 to-emerald-600 text-4xl font-black text-white sm:text-5xl">
                        {profile.name?.[0]?.toUpperCase() || 'U'}
                      </div>
                    )}
                  </div>
                  <label className="flex cursor-pointer items-center justify-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 sm:px-4 sm:py-3 sm:text-sm">
                    <Camera className="h-3 w-3 sm:h-4 sm:w-4" />
                    {t('uploadPhoto')}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(event) => {
                        const file = event.target.files?.[0] || null
                        setProfilePhoto(file)
                        if (file) {
                          setProfilePreview(URL.createObjectURL(file))
                        }
                      }}
                    />
                  </label>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="grid gap-2">
                    <span className="text-xs font-semibold text-slate-700 sm:text-sm">{t('fullName')}</span>
                    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 sm:px-4 sm:py-3">
                      <User className="h-3 w-3 shrink-0 text-slate-400 sm:h-4 sm:w-4" />
                      <input
                        value={profile.name}
                        onChange={(event) => setProfile((current) => ({ ...current, name: event.target.value }))}
                        className="w-full bg-transparent text-xs outline-none sm:text-sm"
                      />
                    </div>
                  </label>

                  <label className="grid gap-2">
                    <span className="text-xs font-semibold text-slate-700 sm:text-sm">{t('phoneNumber')}</span>
                    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 sm:px-4 sm:py-3">
                      <ShieldCheck className="h-3 w-3 shrink-0 text-slate-400 sm:h-4 sm:w-4" />
                      <input
                        value={profile.phone}
                        onChange={(event) => setProfile((current) => ({ ...current, phone: event.target.value }))}
                        className="w-full bg-transparent text-xs outline-none sm:text-sm"
                      />
                    </div>
                  </label>

                  <label className="grid gap-2 sm:col-span-2">
                    <span className="text-xs font-semibold text-slate-700 sm:text-sm">{t('address')}</span>
                    <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 sm:px-4 sm:py-3">
                      <MapPin className="mt-1 h-3 w-3 shrink-0 text-slate-400 sm:h-4 sm:w-4" />
                      <textarea
                        value={profile.address}
                        onChange={(event) => setProfile((current) => ({ ...current, address: event.target.value }))}
                        rows={3}
                        className="w-full resize-none bg-transparent text-xs outline-none sm:text-sm"
                      />
                    </div>
                  </label>

                  <div className="sm:col-span-2 flex flex-col gap-2 rounded-2xl bg-green-50 px-3 py-2 text-xs text-green-800 sm:flex-row sm:items-center sm:justify-between sm:px-4 sm:py-3 sm:text-sm">
                    <span className="inline-flex items-center gap-2 font-semibold">
                      <ShieldCheck className="h-3 w-3 sm:h-4 sm:w-4" />
                      {t('email')}: {user.email}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <Check className="h-3 w-3 sm:h-4 sm:w-4" />
                      {t('sessionConnected')}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-xl backdrop-blur">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-green-700">{t('addresses')}</p>
                  <h2 className="mt-2 text-2xl font-bold text-slate-900">{t('manageDeliveryLocations')}</h2>
                </div>
                <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600">
                  {addresses.length} {t('saved')}
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  value={addressForm.fullName}
                  onChange={(event) => setAddressForm((current) => ({ ...current, fullName: event.target.value }))}
                  placeholder={t('fullName')}
                  className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs outline-none sm:px-4 sm:py-3 sm:text-sm"
                />
                <input
                  value={addressForm.phone}
                  onChange={(event) => setAddressForm((current) => ({ ...current, phone: event.target.value }))}
                  placeholder={t('phone')}
                  className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs outline-none sm:px-4 sm:py-3 sm:text-sm"
                />
                <input
                  value={addressForm.street}
                  onChange={(event) => setAddressForm((current) => ({ ...current, street: event.target.value }))}
                  placeholder={t('streetAddress')}
                  className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs outline-none sm:col-span-2 sm:px-4 sm:py-3 sm:text-sm"
                />
                <input
                  value={addressForm.city}
                  onChange={(event) => setAddressForm((current) => ({ ...current, city: event.target.value }))}
                  placeholder={t('city')}
                  className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs outline-none sm:px-4 sm:py-3 sm:text-sm"
                />
                <input
                  value={addressForm.state}
                  onChange={(event) => setAddressForm((current) => ({ ...current, state: event.target.value }))}
                  placeholder={t('state')}
                  className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs outline-none sm:px-4 sm:py-3 sm:text-sm"
                />
                <input
                  value={addressForm.zipCode}
                  onChange={(event) => setAddressForm((current) => ({ ...current, zipCode: event.target.value }))}
                  placeholder={t('zipCode')}
                  className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs outline-none sm:px-4 sm:py-3 sm:text-sm"
                />
                <input
                  value={addressForm.country}
                  onChange={(event) => setAddressForm((current) => ({ ...current, country: event.target.value }))}
                  placeholder={t('country')}
                  className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs outline-none sm:col-span-2 sm:px-4 sm:py-3 sm:text-sm"
                />
              </div>

              <button
                onClick={handleAddressSave}
                disabled={isSavingAddress}
                className="w-full rounded-full bg-green-600 px-5 py-2 text-xs font-semibold text-white transition hover:bg-green-700 disabled:bg-slate-300 sm:mt-4 sm:inline-flex sm:w-auto sm:items-center sm:gap-2 sm:py-3"
              >
                {isSavingAddress ? <div className="h-3 w-3 animate-spin rounded-full border-2 border-white/40 border-t-white sm:h-4 sm:w-4" /> : <Plus className="h-3 w-3 sm:h-4 sm:w-4" />}
                {t('saveAddress')}
              </button>

              <div className="mt-4 grid gap-3 sm:mt-6 sm:grid-cols-2">
                {addresses.map((address) => (
                  <div
                    key={address.id || `${address.street}-${address.zipCode}`}
                    className={`rounded-3xl border p-3 sm:p-5 ${
                      address.isDefault ? 'border-green-200 bg-green-50' : 'border-slate-200 bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-base font-bold text-slate-900 sm:text-lg">{address.fullName}</h3>
                        <p className="mt-1 text-xs leading-5 text-slate-600 sm:mt-2 sm:text-sm sm:leading-6">
                          {address.street}
                          <br />
                          {address.city}, {address.state} {address.zipCode}
                          <br />
                          {address.country || 'India'}
                        </p>
                      </div>
                      {address.isDefault && (
                        <span className="whitespace-nowrap rounded-full bg-green-600 px-2 py-1 text-xs font-semibold text-white">
                          {t('default')}
                        </span>
                      )}
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1 sm:mt-4 sm:gap-2">
                      <button
                        onClick={() => address.id && handleSetDefaultAddress(address.id)}
                        className="inline-flex flex-1 items-center justify-center gap-1 rounded-full bg-white px-2 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100 sm:flex-initial sm:gap-2 sm:px-4 sm:py-2"
                      >
                        <Home className="h-3 w-3 sm:h-4 sm:w-4" />
                        {t('setDefault')}
                      </button>
                      <button
                        onClick={() => address.id && handleDeleteAddress(address.id)}
                        className="inline-flex flex-1 items-center justify-center gap-1 rounded-full bg-white px-2 py-1.5 text-xs font-semibold text-red-600 shadow-sm transition hover:bg-red-50 sm:flex-initial sm:gap-2 sm:px-4 sm:py-2"
                      >
                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                        {t('delete')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-slate-950 p-6 text-white shadow-xl">
              <p className="text-xs uppercase tracking-[0.25em] text-green-200">{t('orders')}</p>
              <h2 className="mt-2 text-2xl font-bold">{t('orderHistory')}</h2>
              <div className="mt-5 space-y-4">
                {orders.length === 0 ? (
                  <div className="rounded-3xl bg-white/10 p-5 text-sm text-slate-300">
                    {t('noOrdersYetStartShoppingToSeeInvoiceAndTrackingHistoryHere')}
                  </div>
                ) : (
                  orders.map((order) => (
                    <div key={order.id} className="rounded-3xl bg-white/10 p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-white">{t('order')} {order.id}</p>
                          <p className="mt-1 text-xs text-slate-300">
                            {new Date(order.createdAt).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                        <span className="rounded-full bg-green-500 px-3 py-1 text-xs font-semibold text-white">
                          {t(order.status)}
                        </span>
                      </div>
                      <div className="mt-4 flex items-center justify-between text-sm text-slate-200">
                        <span>{order.items.length} {t('items')}</span>
                        <strong>{formatIndianCurrency(order.total)}</strong>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Link
                          href={`/invoice/${order.id}`}
                          className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-900 transition hover:bg-slate-100"
                        >
                          {t('viewInvoice')}
                        </Link>
                        <a
                          href={`/api/orders/${order.id}/invoice`}
                          download={`Invoice-${order.id}.pdf`}
                          className="rounded-full border border-white/30 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/10"
                        >
                          ↓ {t('downloadPdf')}
                        </a>
                        {order.trackingNumber && (
                          <Link
                            href={`/track-order/${order.id}`}
                            className="rounded-full border border-white/30 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/10"
                          >
                            {t('track')}
                          </Link>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  )
}
