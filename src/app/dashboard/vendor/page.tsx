'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import { useRouter } from 'next/navigation'
import { Package, Plus, Edit, Trash2, TrendingUp, DollarSign, ShoppingBag, AlertCircle, Save, X } from 'lucide-react'
import { formatIndianCurrency } from '@/utils/indianFormat'
import type { Product, Shop } from '@/types'
import { SafeImage } from '@/components/SafeImage'

export default function VendorDashboard() {
  const { user } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [shops, setShops] = useState<Shop[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: 'Fruits',
    stock: '',
    image: '',
    shopId: '',
  })

  const categoryOptions = [
    { key: 'fruits', value: 'Fruits' },
    { key: 'vegetables', value: 'Vegetables' },
    { key: 'dairy', value: 'Dairy' },
    { key: 'bakery', value: 'Bakery' },
    { key: 'grains', value: 'Grains' },
    { key: 'nuts', value: 'Nuts' },
    { key: 'beverages', value: 'Beverages' },
    { key: 'pantry', value: 'Pantry' },
    { key: 'snacks', value: 'Snacks' },
  ]

  useEffect(() => {
    if (!user || user.role !== 'vendor') {
      router.push('/login')
      return
    }

    Promise.all([
      fetch('/api/products').then((r) => r.json()),
      fetch('/api/shops').then((r) => r.json()),
    ]).then(([productsData, shopsData]) => {
      const vendorShops = shopsData.filter((s: Shop) => s.owner === user.email)
      const vendorProducts = productsData.filter((p: Product) => vendorShops.some((s: Shop) => s.id === p.shopId))
      setShops(vendorShops)
      setProducts(vendorProducts)
      setLoading(false)
    })
  }, [user, router])

  const resetForm = () => {
    setFormData({ name: '', price: '', description: '', category: 'Fruits', stock: '', image: '', shopId: shops[0]?.id || '' })
  }

  const handleAddProduct = async () => {
    const newProduct: Product = {
      id: String(Date.now()),
      name: formData.name,
      price: parseFloat(formData.price),
      description: formData.description,
      category: formData.category,
      stock: parseInt(formData.stock),
      image: formData.image || '/images/products/default.jpg',
      shopId: formData.shopId,
      rating: 4.5,
      reviews: 0,
      organic: true,
      featured: false,
      images: [formData.image || '/images/products/default.jpg'],
    }
    try {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      })
      setProducts([...products, newProduct])
    } catch {
      // optimistic update already applied
    }
    setShowAddModal(false)
    resetForm()
  }

  const handleUpdateProduct = async () => {
    if (!editingProduct) return
    const updated = products.map((p) =>
      p.id === editingProduct.id
        ? { ...p, ...formData, price: parseFloat(formData.price), stock: parseInt(formData.stock) }
        : p,
    )
    const updatedProduct = updated.find(p => p.id === editingProduct.id)!
    try {
      await fetch(`/api/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProduct),
      })
    } catch {
      // optimistic update already applied
    }
    setProducts(updated)
    setEditingProduct(null)
    resetForm()
  }

  const handleDeleteProduct = (id: string) => {
    if (confirm(t('confirmDeleteProduct'))) {
      setProducts(products.filter((p) => p.id !== id))
    }
  }

  const handleEditClick = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      price: String(product.price),
      description: product.description,
      category: product.category,
      stock: String(product.stock),
      image: product.image,
      shopId: product.shopId,
    })
  }

  const totalRevenue = products.reduce((sum, p) => sum + p.price * (100 - p.stock), 0)
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0)
  const lowStockProducts = products.filter((p) => p.stock < 20)

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-green-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-3 py-6 sm:px-4 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="mb-1 text-3xl font-bold text-gray-900 sm:mb-2 sm:text-4xl">{t('vendorDashboard')}</h1>
          <p className="text-sm text-gray-600 sm:text-base">{t('manageProductsAndInventory')}</p>
        </div>

        <div className="mb-6 grid gap-4 sm:mb-8 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl bg-white p-4 shadow-md sm:p-6">
            <div className="mb-3 flex items-center justify-between sm:mb-4">
              <div className="rounded-lg bg-green-100 p-2 sm:p-3">
                <Package className="text-green-600" size={20} />
              </div>
            </div>
            <h3 className="mb-0.5 text-xs text-gray-600 sm:mb-1 sm:text-sm">{t('totalProducts')}</h3>
            <p className="text-2xl font-bold text-gray-900 sm:text-3xl">{products.length}</p>
          </div>

          <div className="rounded-xl bg-white p-4 shadow-md sm:p-6">
            <div className="mb-3 flex items-center justify-between sm:mb-4">
              <div className="rounded-lg bg-blue-100 p-2 sm:p-3">
                <ShoppingBag className="text-blue-600" size={20} />
              </div>
            </div>
            <h3 className="mb-0.5 text-xs text-gray-600 sm:mb-1 sm:text-sm">{t('totalStock')}</h3>
            <p className="text-2xl font-bold text-gray-900 sm:text-3xl">{totalStock}</p>
          </div>

          <div className="rounded-xl bg-white p-4 shadow-md sm:p-6">
            <div className="mb-3 flex items-center justify-between sm:mb-4">
              <div className="rounded-lg bg-purple-100 p-2 sm:p-3">
                <DollarSign className="text-purple-600" size={20} />
              </div>
            </div>
            <h3 className="mb-0.5 text-xs text-gray-600 sm:mb-1 sm:text-sm">{t('estRevenue')}</h3>
            <p className="text-2xl font-bold text-gray-900 sm:text-3xl">₹{totalRevenue.toFixed(0)}</p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-md">
            <div className="mb-4 flex items-center justify-between">
              <div className="rounded-lg bg-red-100 p-3">
                <AlertCircle className="text-red-600" size={24} />
              </div>
            </div>
            <h3 className="mb-1 text-sm text-gray-600">{t('lowStock')}</h3>
            <p className="text-3xl font-bold">{lowStockProducts.length}</p>
          </div>
        </div>

        {lowStockProducts.length > 0 && (
          <div className="mb-8 rounded-xl border border-red-200 bg-red-50 p-4">
            <div className="mb-2 flex items-center gap-2">
              <AlertCircle className="text-red-600" size={20} />
              <h3 className="font-bold text-red-800">{t('lowStockAlert')}</h3>
            </div>
            <p className="text-sm text-red-700">{t('lowStockProductsMessage', { count: lowStockProducts.length })}</p>
          </div>
        )}

        <div className="mb-8 rounded-xl bg-white p-6 shadow-md">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">{t('productInventory')}</h2>
            <button
              onClick={() => {
                setShowAddModal(true)
                setFormData({ ...formData, shopId: shops[0]?.id || '' })
              }}
              className="flex items-center gap-2 rounded-lg bg-green-600 px-6 py-3 font-bold text-white transition hover:bg-green-700"
            >
              <Plus size={20} />
              {t('addProduct')}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 text-left">{t('image')}</th>
                  <th className="px-4 py-3 text-left">{t('product')}</th>
                  <th className="px-4 py-3 text-left">{t('category')}</th>
                  <th className="px-4 py-3 text-left">{t('price')}</th>
                  <th className="px-4 py-3 text-left">{t('stock')}</th>
                  <th className="px-4 py-3 text-left">{t('status')}</th>
                  <th className="px-4 py-3 text-left">{t('actions')}</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="relative h-16 w-16 overflow-hidden rounded-lg">
                        <SafeImage src={product.image} alt={product.name} fill className="object-cover" />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-bold">{product.name}</div>
                      <div className="max-w-xs truncate text-sm text-gray-600">{product.description}</div>
                    </td>
                    <td className="px-4 py-3">{t(product.category.toLowerCase())}</td>
                    <td className="px-4 py-3 font-bold">{formatIndianCurrency(product.price)}</td>
                    <td className="px-4 py-3">
                      <span className={`font-bold ${product.stock < 20 ? 'text-red-600' : 'text-green-600'}`}>{product.stock}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          product.stock === 0
                            ? 'bg-red-100 text-red-700'
                            : product.stock < 20
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {product.stock === 0 ? t('outOfStock') : product.stock < 20 ? t('lowStock') : t('inStock')}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditClick(product)}
                          className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="rounded-lg p-2 text-red-600 transition hover:bg-red-50"
                        >
                          <Trash2 size={18} />
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

      {(showAddModal || editingProduct) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">{editingProduct ? t('editProduct') : t('addNewProduct')}</h2>
              <button onClick={() => { setShowAddModal(false); setEditingProduct(null); resetForm() }}>
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">{t('productName')}</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-lg border px-4 py-3 focus:ring-2 focus:ring-green-500"
                  placeholder={t('productNamePlaceholder')}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">{t('priceInRupees')}</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full rounded-lg border-2 border-green-300 px-4 py-3 focus:border-green-500 focus:ring-2 focus:ring-green-500"
                    placeholder={t('pricePlaceholder')}
                  />
                  <p className="mt-1 text-xs text-gray-500">{t('enterPriceInRupees')}</p>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">{t('stock')}</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full rounded-lg border px-4 py-3 focus:ring-2 focus:ring-green-500"
                    placeholder={t('stockPlaceholder')}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">{t('category')}</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full rounded-lg border px-4 py-3 focus:ring-2 focus:ring-green-500"
                  >
                    {categoryOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {t(option.key)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">{t('shop')}</label>
                  <select
                    value={formData.shopId}
                    onChange={(e) => setFormData({ ...formData, shopId: e.target.value })}
                    className="w-full rounded-lg border px-4 py-3 focus:ring-2 focus:ring-green-500"
                  >
                    {shops.map((shop) => (
                      <option key={shop.id} value={shop.id}>
                        {shop.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">{t('description')}</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-lg border px-4 py-3 focus:ring-2 focus:ring-green-500"
                  rows={3}
                  placeholder={t('descriptionPlaceholder')}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">{t('imageUrl')}</label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full rounded-lg border px-4 py-3 focus:ring-2 focus:ring-green-500"
                  placeholder={t('imageUrlPlaceholder')}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={editingProduct ? handleUpdateProduct : handleAddProduct}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-600 py-3 font-bold text-white transition hover:bg-green-700"
                >
                  <Save size={20} />
                  {editingProduct ? t('updateProduct') : t('addProduct')}
                </button>
                <button
                  onClick={() => { setShowAddModal(false); setEditingProduct(null); resetForm() }}
                  className="rounded-lg border border-gray-300 px-6 py-3 font-bold transition hover:bg-gray-50"
                >
                  {t('cancel')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
