import type { Product, User, Order, Message, Transaction, Shop } from '@/types'
import { enhancedProducts } from './enhancedProducts'
import { FileStorage } from './fileStorage'

// Enhanced Products with real images from Unsplash
export const mockProducts: Product[] = enhancedProducts.length > 0 ? enhancedProducts : [
  { 
    id: '1', 
    name: 'Organic Apples', 
    price: 5, 
    description: 'Fresh organic apples from local farms. Crisp, sweet, and packed with nutrients. Perfect for snacking or baking.',
    image: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=500',
    category: 'Fruits', 
    stock: 50, 
    rating: 4.5, 
    reviews: 120, 
    organic: true, 
    featured: true,
    shopId: '1',
    images: [
      'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=500',
      'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500',
      'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=500'
    ]
  },
  { 
    id: '2', 
    name: 'Organic Bananas', 
    price: 3, 
    description: 'Sweet organic bananas rich in potassium. Naturally ripened for perfect sweetness.',
    image: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=500',
    category: 'Fruits', 
    stock: 80, 
    rating: 4.7, 
    reviews: 95, 
    organic: true, 
    featured: false,
    shopId: '1',
    images: [
      'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=500',
      'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500'
    ]
  },
  { 
    id: '3', 
    name: 'Organic Carrots', 
    price: 3, 
    description: 'Crunchy organic carrots loaded with beta-carotene. Great for salads and cooking.',
    image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=500',
    category: 'Vegetables', 
    stock: 60, 
    rating: 4.6, 
    reviews: 78, 
    organic: true, 
    featured: true,
    shopId: '2',
    images: [
      'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=500',
      'https://images.unsplash.com/photo-1582515073490-39981397c445?w=500'
    ]
  },
  { 
    id: '4', 
    name: 'Organic Spinach', 
    price: 4, 
    description: 'Fresh organic spinach leaves packed with iron and vitamins. Perfect for smoothies and salads.',
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500',
    category: 'Vegetables', 
    stock: 40, 
    rating: 4.8, 
    reviews: 102, 
    organic: true, 
    featured: false,
    shopId: '2',
    images: [
      'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500',
      'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500'
    ]
  },
  { 
    id: '5', 
    name: 'Organic Tomatoes', 
    price: 5, 
    description: 'Juicy organic tomatoes bursting with flavor. Vine-ripened for maximum taste.',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500',
    category: 'Vegetables', 
    stock: 55, 
    rating: 4.4, 
    reviews: 88, 
    organic: true, 
    featured: true,
    shopId: '2',
    images: [
      'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500',
      'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=500',
      'https://images.unsplash.com/photo-1561136594-7f68413baa99?w=500'
    ]
  },
  { 
    id: '6', 
    name: 'Organic Milk', 
    price: 7, 
    description: 'Fresh organic whole milk from grass-fed cows. Rich, creamy, and nutritious.',
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500',
    category: 'Dairy', 
    stock: 30, 
    rating: 4.9, 
    reviews: 156, 
    organic: true, 
    featured: false,
    shopId: '3',
    images: [
      'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500',
      'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500'
    ]
  },
  { 
    id: '7', 
    name: 'Organic Eggs', 
    price: 8, 
    description: 'Free-range organic eggs from happy hens. Rich in protein and omega-3.',
    image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=500',
    category: 'Dairy', 
    stock: 45, 
    rating: 4.7, 
    reviews: 134, 
    organic: true, 
    featured: true,
    shopId: '3',
    images: [
      'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=500',
      'https://images.unsplash.com/photo-1518569656558-1f25e69d93d7?w=500'
    ]
  },
  { 
    id: '8', 
    name: 'Organic Bread', 
    price: 6, 
    description: 'Whole grain organic bread baked fresh daily. No preservatives or additives.',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500',
    category: 'Bakery', 
    stock: 25, 
    rating: 4.5, 
    reviews: 67, 
    organic: true, 
    featured: false,
    shopId: '4',
    images: [
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500',
      'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=500'
    ]
  },
  { 
    id: '9', 
    name: 'Organic Honey', 
    price: 13, 
    description: 'Pure organic honey from wildflower meadows. Natural sweetener with health benefits.',
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784422?w=500',
    category: 'Pantry', 
    stock: 35, 
    rating: 4.9, 
    reviews: 201, 
    organic: true, 
    featured: true,
    shopId: '4',
    images: [
      'https://images.unsplash.com/photo-1587049352846-4a222e784422?w=500',
      'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=500'
    ]
  },
  { 
    id: '10', 
    name: 'Organic Quinoa', 
    price: 9, 
    description: 'Premium organic quinoa - complete protein source. Perfect for healthy meals.',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500',
    category: 'Grains', 
    stock: 50, 
    rating: 4.6, 
    reviews: 89, 
    organic: true, 
    featured: false,
    shopId: '4',
    images: [
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500',
      'https://images.unsplash.com/photo-1612457935-5f1f9f6d6f1e?w=500'
    ]
  },
  { 
    id: '11', 
    name: 'Organic Avocados', 
    price: 7, 
    description: 'Creamy organic avocados rich in healthy fats. Perfect for toast and salads.',
    image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=500',
    category: 'Fruits', 
    stock: 40, 
    rating: 4.8, 
    reviews: 145, 
    organic: true, 
    featured: true,
    shopId: '1',
    images: [
      'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=500',
      'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=500'
    ]
  },
  { 
    id: '12', 
    name: 'Organic Blueberries', 
    price: 10, 
    description: 'Sweet organic blueberries packed with antioxidants. Great for smoothies.',
    image: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=500',
    category: 'Fruits', 
    stock: 30, 
    rating: 4.9, 
    reviews: 178, 
    organic: true, 
    featured: true,
    shopId: '1',
    images: [
      'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=500',
      'https://images.unsplash.com/photo-1588165171080-c89acfa5ee83?w=500'
    ]
  },
]

export const mockShops: Shop[] = [
  {
    id: '1',
    name: 'Fresh Fruits Farm',
    owner: 'vendor@organic.com',
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
    owner: 'vendor@organic.com',
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
    owner: 'vendor2@organic.com',
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
    owner: 'vendor2@organic.com',
    description: 'Organic pantry essentials and baked goods',
    location: { lat: 40.7614, lng: -73.9776, address: '321 Pantry Ave, New York, NY 10004' },
    rating: 4.6,
    totalOrders: 850,
    revenue: 35000,
    image: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=500',
    status: 'active'
  },
]

export const mockUsers: User[] = [
  { id: '1', email: 'admin@organic.com', name: 'Admin User', role: 'admin', password: 'admin123', phone: '+1234567890', address: '123 Admin St, NY' },
  { id: '2', email: 'vendor@organic.com', name: 'Vendor User', role: 'vendor', password: 'vendor123', phone: '+1234567891', address: '456 Vendor Ave, NY' },
  { id: '3', email: 'vendor2@organic.com', name: 'Vendor Two', role: 'vendor', password: 'vendor123', phone: '+1234567893', address: '789 Vendor Blvd, NY' },
  { id: '4', email: 'customer@organic.com', name: 'Customer User', role: 'customer', password: 'customer123', phone: '+1234567892', address: '789 Customer Rd, NY' },
  { id: '5', email: 'customer2@organic.com', name: 'John Smith', role: 'customer', password: 'customer123', phone: '+1234567894', address: '321 Main St, NY' },
]

// Initialize file storage on server start
if (typeof window === 'undefined') {
  try {
    FileStorage.init()
    mockUsers.forEach(user => FileStorage.users.save(user))
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
  users: {
    findByEmail: async (email: string) => mockUsers.find(u => u.email === email),
    create: async (user: Omit<User, 'id'>) => {
      const newUser = { ...user, id: String(mockUsers.length + 1) }
      mockUsers.push(newUser)
      storage.save('users', mockUsers)
      return newUser
    },
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
        ...order,
        id: String(orderIdCounter++),
        createdAt: new Date().toISOString(),
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
        paymentMethod: 'cash',
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
    findAll: async () => orders,
    findById: async (id: string) => orders.find(o => o.id === id),
    updateStatus: async (id: string, status: Order['status']) => {
      const order = orders.find(o => o.id === id)
      if (order) {
        order.status = status
        storage.save('orders', orders)
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
      const totalCustomers = mockUsers.filter(u => u.role === 'customer').length
      
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
