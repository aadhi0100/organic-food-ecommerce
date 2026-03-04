'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import { useRouter } from 'next/navigation'
import { Package, Plus, Edit, Trash2, TrendingUp, DollarSign, ShoppingBag, AlertCircle, Save, X } from 'lucide-react'
import Image from 'next/image'
import { formatIndianCurrency } from '@/utils/indianFormat'
import type { Product, Shop } from '@/types'

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
    name: '', price: '', description: '', category: 'Fruits', stock: '', image: '', shopId: ''
  })

  useEffect(() => {
    if (!user || user.role !== 'vendor') {
      router.push('/login')
      return
    }

    Promise.all([
      fetch('/api/products').then(r => r.json()),
      fetch('/api/shops').then(r => r.json())
    ]).then(([productsData, shopsData]) => {
      const vendorShops = shopsData.filter((s: Shop) => s.owner === user.email)
      const vendorProducts = productsData.filter((p: Product) => 
        vendorShops.some((s: Shop) => s.id === p.shopId)
      )
      setShops(vendorShops)
      setProducts(vendorProducts)
      setLoading(false)
    })
  }, [user, router])

  const handleAddProduct = () => {
    const newProduct: Product = {
      id: String(Date.now()),
      name: formData.name,
      price: parseFloat(formData.price),
      description: formData.description,
      category: formData.category,
      stock: parseInt(formData.stock),
      image: formData.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500',
      shopId: formData.shopId,
      rating: 4.5,
      reviews: 0,
      organic: true,
      featured: false,
      images: [formData.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500']
    }
    setProducts([...products, newProduct])
    setShowAddModal(false)
    resetForm()
  }

  const handleUpdateProduct = () => {
    if (!editingProduct) return
    const updated = products.map(p => 
      p.id === editingProduct.id 
        ? { ...p, ...formData, price: parseFloat(formData.price), stock: parseInt(formData.stock) }
        : p
    )
    setProducts(updated)
    setEditingProduct(null)
    resetForm()
  }

  const handleDeleteProduct = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== id))
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
      shopId: product.shopId
    })
  }

  const resetForm = () => {
    setFormData({ name: '', price: '', description: '', category: 'Fruits', stock: '', image: '', shopId: shops[0]?.id || '' })
  }

  const totalRevenue = products.reduce((sum, p) => sum + (p.price * (100 - p.stock)), 0)
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0)
  const lowStockProducts = products.filter(p => p.stock < 20)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{t('vendorDashboard')}</h1>
          <p className="text-gray-600">{t('manageProductsAndInventory')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <Package className="text-green-600" size={24} />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm mb-1">{t('totalProducts')}</h3>
            <p className="text-3xl font-bold">{products.length}</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <ShoppingBag className="text-blue-600" size={24} />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm mb-1">{t('totalStock')}</h3>
            <p className="text-3xl font-bold">{totalStock}</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <DollarSign className="text-purple-600" size={24} />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm mb-1">{t('estRevenue')}</h3>
            <p className="text-3xl font-bold">₹{totalRevenue.toFixed(0)}</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-red-100 p-3 rounded-lg">
                <AlertCircle className="text-red-600" size={24} />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm mb-1">{t('lowStock')}</h3>
            <p className="text-3xl font-bold">{lowStockProducts.length}</p>
          </div>
        </div>

        {lowStockProducts.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="text-red-600" size={20} />
              <h3 className="font-bold text-red-800">{t('lowStockAlert')}</h3>
            </div>
            <p className="text-red-700 text-sm">
              {lowStockProducts.length} product(s) have stock below 20 units. Please restock soon.
            </p>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">{t('productInventory')}</h2>
            <button
              onClick={() => { setShowAddModal(true); setFormData({ ...formData, shopId: shops[0]?.id || '' }) }}
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition flex items-center gap-2"
            >
              <Plus size={20} />
              {t('addProduct')}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">{t('image')}</th>
                  <th className="text-left py-3 px-4">{t('product')}</th>
                  <th className="text-left py-3 px-4">{t('category')}</th>
                  <th className="text-left py-3 px-4">{t('price')}</th>
                  <th className="text-left py-3 px-4">{t('stock')}</th>
                  <th className="text-left py-3 px-4">{t('status')}</th>
                  <th className="text-left py-3 px-4">{t('actions')}</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                        <Image src={product.image} alt={product.name} fill className="object-cover" />
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold">{product.name}</div>
                      <div className="text-sm text-gray-600 truncate max-w-xs">{product.description}</div>
                    </td>
                    <td className="py-3 px-4">{product.category}</td>
                    <td className="py-3 px-4 font-bold">{formatIndianCurrency(product.price)}</td>
                    <td className="py-3 px-4">
                      <span className={`font-bold ${product.stock < 20 ? 'text-red-600' : 'text-green-600'}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        product.stock === 0 ? 'bg-red-100 text-red-700' :
                        product.stock < 20 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {product.stock === 0 ? t('outOfStock') : product.stock < 20 ? t('lowStock') : t('inStock')}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditClick(product)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{editingProduct ? t('editProduct') : t('addNewProduct')}</h2>
              <button onClick={() => { setShowAddModal(false); setEditingProduct(null); resetForm() }}>
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">{t('productName')}</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="Organic Apples"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">{t('priceInRupees')}</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="499.00"
                  />
                  <p className="text-xs text-gray-500 mt-1">{t('enterPriceInRupees')}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{t('stock')}</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">{t('category')}</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    <option>Fruits</option>
                    <option>Vegetables</option>
                    <option>Dairy</option>
                    <option>Bakery</option>
                    <option>Grains</option>
                    <option>Nuts</option>
                    <option>Beverages</option>
                    <option>Pantry</option>
                    <option>Snacks</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{t('shop')}</label>
                  <select
                    value={formData.shopId}
                    onChange={(e) => setFormData({ ...formData, shopId: e.target.value })}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    {shops.map(shop => (
                      <option key={shop.id} value={shop.id}>{shop.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('description')}</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500"
                  rows={3}
                  placeholder="Fresh organic apples from local farms..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('imageUrl')}</label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={editingProduct ? handleUpdateProduct : handleAddProduct}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition flex items-center justify-center gap-2"
                >
                  <Save size={20} />
                  {editingProduct ? t('updateProduct') : t('addProduct')}
                </button>
                <button
                  onClick={() => { setShowAddModal(false); setEditingProduct(null); resetForm() }}
                  className="px-6 py-3 border border-gray-300 rounded-lg font-bold hover:bg-gray-50 transition"
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
