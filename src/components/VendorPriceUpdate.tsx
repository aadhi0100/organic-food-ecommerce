'use client'

import { useState } from 'react'
import { DollarSign, Calendar, Percent, Save } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

function VendorPriceUpdate({ vendorId, products }: { vendorId: string; products: { id: string; name: string; price: number }[] }) {
  const [selectedProduct, setSelectedProduct] = useState('')
  const [dailyPrice, setDailyPrice] = useState('')
  const [discount, setDiscount] = useState('')
  const [reason, setReason] = useState('')
  const { t } = useLanguage()

  const handleUpdate = async () => {
    if (!selectedProduct || !dailyPrice) {
      alert(t('pleaseFillAllRequiredFields'))
      return
    }

    const product = products.find((p) => p.id === selectedProduct)
    if (!product) return

    const res = await fetch('/api/vendor/price-update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: selectedProduct,
        vendorId,
        basePrice: product.price,
        dailyPrice: parseFloat(dailyPrice),
        discount: discount ? parseFloat(discount) : 0,
        reason,
      }),
    })

    if (res.ok) {
      alert(t('priceUpdatedSuccessfully'))
      setSelectedProduct('')
      setDailyPrice('')
      setDiscount('')
      setReason('')
    } else {
      alert(t('failedToUpdatePrice'))
    }
  }

  return (
    <div className="rounded-xl bg-white p-6 shadow-md">
      <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold">
        <DollarSign className="text-green-600" />
        {t('dailyPriceUpdate')}
      </h2>

      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium">{t('selectProduct')}</label>
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="w-full rounded-lg border px-4 py-3 focus:ring-2 focus:ring-green-500"
          >
            <option value="">{t('chooseProduct')}</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({t('basePrice')}: ₹{p.price})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            {t('todayPrice')} (₹)
          </label>
          <input
            type="number"
            value={dailyPrice}
            onChange={(e) => setDailyPrice(e.target.value)}
            className="w-full rounded-lg border px-4 py-3 focus:ring-2 focus:ring-green-500"
            placeholder={t('enterTodaysPrice')}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">{t('discountPercentage')}</label>
          <input
            type="number"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            className="w-full rounded-lg border px-4 py-3 focus:ring-2 focus:ring-green-500"
            placeholder={t('optionalDiscount')}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">{t('reason')}</label>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full rounded-lg border px-4 py-3 focus:ring-2 focus:ring-green-500"
            placeholder={t('reasonPlaceholder')}
          />
        </div>

        <button
          onClick={handleUpdate}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 py-3 font-bold text-white transition hover:bg-green-700"
        >
          <Save size={20} />
          {t('updatePrice')}
        </button>
      </div>

      <div className="mt-6 rounded-lg bg-blue-50 p-4">
        <p className="text-sm text-blue-800">
          <Calendar className="mr-2 inline" size={16} />
          {t('priceUpdatesEffectiveForTodayOnly')}
        </p>
      </div>
    </div>
  )
}

export default VendorPriceUpdate
