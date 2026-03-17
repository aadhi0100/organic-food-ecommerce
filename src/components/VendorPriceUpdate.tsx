'use client'

import { useState } from 'react'
import { DollarSign, Calendar, Percent, Save } from 'lucide-react'

function VendorPriceUpdate({ vendorId, products }: any) {
  const [selectedProduct, setSelectedProduct] = useState('')
  const [dailyPrice, setDailyPrice] = useState('')
  const [discount, setDiscount] = useState('')
  const [reason, setReason] = useState('')

  const handleUpdate = async () => {
    if (!selectedProduct || !dailyPrice) {
      alert('Please fill all required fields')
      return
    }

    const product = products.find((p: any) => p.id === selectedProduct)
    
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
      alert('Price updated successfully!')
      setSelectedProduct('')
      setDailyPrice('')
      setDiscount('')
      setReason('')
    } else {
      alert('Failed to update price')
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <DollarSign className="text-green-600" />
        Daily Price Update
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Select Product</label>
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500"
          >
            <option value="">Choose a product</option>
            {products.map((p: any) => (
              <option key={p.id} value={p.id}>
                {p.name} (Base: ₹{p.price})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Today's Price (₹)</label>
          <input
            type="number"
            value={dailyPrice}
            onChange={(e) => setDailyPrice(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500"
            placeholder="Enter today's price"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Discount (%)</label>
          <input
            type="number"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500"
            placeholder="Optional discount"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Reason</label>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500"
            placeholder="e.g., Fresh stock, Market rate"
          />
        </div>

        <button
          onClick={handleUpdate}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition flex items-center justify-center gap-2"
        >
          <Save size={20} />
          Update Price
        </button>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <Calendar className="inline mr-2" size={16} />
          Price updates are effective for today only. Update daily for best results.
        </p>
      </div>
    </div>
  )
}

export default VendorPriceUpdate
