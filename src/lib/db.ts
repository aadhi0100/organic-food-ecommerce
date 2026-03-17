import type { Product, Order, Message, Transaction, Shop } from '@/types'
import { FileStorage } from './fileStorage'
import { allProducts } from './allProducts'
import { PRODUCT_IMAGE_PATHS } from './productImages.generated'

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function basenameNoExt(p: string) {
  const base = p.split('/').pop() || p
  return base.replace(/\.[a-z0-9]+$/i, '')
}

function scoreImageMatch(productSlug: string, imageBase: string) {
  // Prefer exact-ish matches first, then partial matches.
  if (imageBase === productSlug) return 100
  if (imageBase.startsWith(productSlug + '-')) return 90
  if (imageBase.startsWith(productSlug)) return 80
  if (imageBase.includes(productSlug)) return 70

  // Some files include prefixes like "organic-" or "fresh-". Try matching without them.
  const stripped = productSlug.replace(/^(organic|fresh)-/, '')
  if (stripped && imageBase === stripped) return 60
  if (stripped && imageBase.startsWith(stripped + '-')) return 55
  if (stripped && imageBase.includes(stripped)) return 50

  return 0
}

function pickImagesForProductName(name: string) {
  const productSlug = slugify(name)
  const scored = PRODUCT_IMAGE_PATHS.map((p) => {
    const base = basenameNoExt(p)
    return { p, score: scoreImageMatch(productSlug, base), base }
  }).filter((x) => x.score > 0)

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score
    // Prefer shorter/cleaner names (often without numeric suffix).
    if (a.base.length !== b.base.length) return a.base.length - b.base.length
    return a.p.localeCompare(b.p)
  })

  if (scored.length === 0) {
    // Safe fallback: always exists in the repo.
    return ['/images/products/apples.jpg']
  }

  return scored.slice(0, 4).map((x) => x.p)
}

export const mockProducts: Product[] = (allProducts as Product[]).map((p) => {
  const images = pickImagesForProductName(String((p as any).name || ''))
  return {
    ...p,
    image: images[0] || '/images/products/apples.jpg',
    images,
  }
})

export const mockShops: Shop[] = [
  {
    id: '1',
    name: 'Fresh Fruits Farm',
    owner: 'vendor-1',
    description: 'Premium organic fruits directly from our farm',
    location: { lat: 40.7128, lng: -74.0060, address: '123 Farm Road, New York, NY 10001' },
    rating: 4.8,
    totalOrders: 1250,
    revenue: 45000,
    image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=500',
    status: 'active'
  },
  {
    id: '2',
    name: 'Green Valley Vegetables',
    owner: 'vendor-1',
    description: 'Fresh organic vegetables grown with care',
    location: { lat: 40.7580, lng: -73.9855, address: '456 Green Street, New York, NY 10002' },
    rating: 4.7,
    totalOrders: 980,
    revenue: 38000,
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500',
    status: 'active'
  },
  {
    id: '3',
    name: 'Dairy Delight',
    owner: 'vendor-2',
    description: 'Organic dairy products from grass-fed cows',
    location: { lat: 40.7489, lng: -73.9680, address: '789 Dairy Lane, New York, NY 10003' },
    rating: 4.9,
    totalOrders: 1500,
    revenue: 52000,
    image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=500',
    status: 'active'
  },
  {
    id: '4',
    name: 'Organic Pantry',
    owner: 'vendor-2',
    description: 'Organic pantry essentials and baked goods',
    location: { lat: 40.7614, lng: -73.9776, address: '321 Pantry Ave, New York, NY 10004' },
    rating: 4.6,
    totalOrders: 850,
    revenue: 35000,
    image: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=500',
    status: 'active'
  },
]

// Initialize file storage on server start
if (typeof window === 'undefined') {
  try {
    FileStorage.init()
    FileStorage.products.saveAll(mockProducts)
  } catch (error) {
    console.log('File storage initialization skipped')
  }
}

let orders: Order[] = []
let messages: Message[] = []
let transactions: Transaction[] = []
let orderIdCounter = 1
let messageIdCounter = 1
let transactionIdCounter = 1

// Data persistence using localStorage simulation
const storage = {
  save: (key: string, data: any) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(data))
    }
  },
  load: (key: string) => {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem(key)
      return data ? JSON.parse(data) : null
    }
    return null
  }
}

export const db = {
  products: {
    findMany: async (filter?: { category?: string; search?: string; shopId?: string }) => {
      let filtered = [...mockProducts]
      if (filter?.category) {
        filtered = filtered.filter(p => p.category === filter.category)
      }
      if (filter?.search) {
        const search = filter.search.toLowerCase()
        filtered = filtered.filter(p => 
          p.name.toLowerCase().includes(search) || 
          p.description.toLowerCase().includes(search)
        )
      }
      if (filter?.shopId) {
        filtered = filtered.filter(p => p.shopId === filter.shopId)
      }
      return filtered
    },
    findById: async (id: string) => mockProducts.find(p => p.id === id),
    findFeatured: async () => mockProducts.filter(p => p.featured),
    updateStock: async (id: string, quantity: number) => {
      const product = mockProducts.find(p => p.id === id)
      if (product) {
        product.stock -= quantity
      }
    }
  },
  shops: {
    findMany: async () => mockShops,
    findById: async (id: string) => mockShops.find(s => s.id === id),
    findByOwner: async (email: string) => mockShops.filter(s => s.owner === email),
    updateRevenue: async (shopId: string, amount: number) => {
      const shop = mockShops.find(s => s.id === shopId)
      if (shop) {
        shop.revenue += amount
        shop.totalOrders += 1
      }
    }
  },
  orders: {
    create: async (order: Omit<Order, 'id' | 'createdAt'>) => {
      const newOrder: Order = {
        id: `ORD${Date.now()}`,
        userId: order.userId,
        items: order.items,
        total: order.total,
        status: order.status,
        shippingAddress: order.shippingAddress,
        createdAt: new Date().toISOString(),
        orderDate: order.orderDate || new Date().toISOString(),
        customerName: order.customerName || '',
        customerEmail: order.customerEmail || '',
        customerPhone: order.customerPhone || '',
        deliveryDate: order.deliveryDate || '',
        trackingNumber: order.trackingNumber || '',
        paymentMethod: order.paymentMethod || 'cash',
      }
      orders.push(newOrder)
      storage.save('orders', orders)
      
      // Save to file storage
      if (typeof window === 'undefined') {
        try {
          FileStorage.orders.save(newOrder)
        } catch (error) {
          console.log('File storage save skipped')
        }
      }
      
      // Create transaction
      await db.transactions.create({
        orderId: newOrder.id,
        amount: newOrder.total,
        status: 'completed',
        paymentMethod: order.paymentMethod || 'cash',
        userId: newOrder.userId
      })
      
      // Update shop revenue
      for (const item of newOrder.items) {
        const product = await db.products.findById(item.productId)
        if (product?.shopId) {
          await db.shops.updateRevenue(product.shopId, (product.price * item.quantity))
        }
      }
      
      return newOrder
    },
    findByUserId: async (userId: string) => orders.filter(o => o.userId === userId),
    getAll: async () => {
      // Load from file storage if available
      if (typeof window === 'undefined') {
        try {
          const fileOrders = FileStorage.orders.getAll()
          if (fileOrders.length > 0) {
            orders = fileOrders
          }
        } catch (error) {
          console.log('File storage load skipped')
        }
      }
      return orders
    },
    findById: async (id: string) => {
      // Load from file storage if available
      if (typeof window === 'undefined') {
        try {
          const fileOrders = FileStorage.orders.getAll()
          if (fileOrders.length > 0) {
            orders = fileOrders
          }
        } catch (error) {
          console.log('File storage load skipped')
        }
      }
      return orders.find(o => o.id === id)
    },
    updateStatus: async (id: string, status: Order['status']) => {
      const order = orders.find(o => o.id === id)
      if (order) {
        order.status = status
        storage.save('orders', orders)
        if (typeof window === 'undefined') {
          try {
            FileStorage.orders.save(order)
          } catch (error) {
            console.log('File storage update skipped')
          }
        }
      }
    }
  },
  messages: {
    create: async (message: Omit<Message, 'id' | 'createdAt'>) => {
      const newMessage: Message = {
        ...message,
        id: String(messageIdCounter++),
        createdAt: new Date().toISOString(),
        read: false
      }
      messages.push(newMessage)
      storage.save('messages', messages)
      return newMessage
    },
    findAll: async () => messages,
    findByUserId: async (userId: string) => messages.filter(m => m.userId === userId),
    markAsRead: async (id: string) => {
      const message = messages.find(m => m.id === id)
      if (message) {
        message.read = true
        storage.save('messages', messages)
      }
    }
  },
  transactions: {
    create: async (transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
      const newTransaction: Transaction = {
        ...transaction,
        id: String(transactionIdCounter++),
        createdAt: new Date().toISOString(),
      }
      transactions.push(newTransaction)
      storage.save('transactions', transactions)
      return newTransaction
    },
    findAll: async () => transactions,
    findByUserId: async (userId: string) => transactions.filter(t => t.userId === userId),
    findByOrderId: async (orderId: string) => transactions.find(t => t.orderId === orderId),
  },
  analytics: {
    getDashboardStats: async () => {
      const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0)
      const totalOrders = orders.length
      const totalProducts = mockProducts.length
      const totalCustomers = 0
      
      return {
        totalRevenue,
        totalOrders,
        totalProducts,
        totalCustomers,
        recentOrders: orders.slice(-10).reverse(),
        topProducts: mockProducts.sort((a, b) => b.rating - a.rating).slice(0, 5),
        monthlyRevenue: generateMonthlyRevenue()
      }
    }
  }
}

function generateMonthlyRevenue() {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return months.map(month => ({
    month,
    revenue: Math.floor(Math.random() * 10000) + 5000
  }))
}
