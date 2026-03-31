import type { Message, Order, Product, Shop, Transaction } from '@/types'
import { ProductStore } from '@/lib/productStore'
import { OrderStore } from '@/lib/orderStore'
import { TransactionStore } from '@/lib/transactionStore'
import { UserStore } from '@/lib/userStore'

export const mockProducts = ProductStore.list()

export const mockShops: Shop[] = [
  {
    id: '1',
    name: 'Fresh Fruits Farm',
    owner: 'vendor-1',
    description: 'Premium organic fruits directly from our farm',
    location: { lat: 13.0827, lng: 80.2707, address: 'No. 12, Anna Salai, Teynampet, Chennai, Tamil Nadu 600018' },
    rating: 4.8,
    totalOrders: 1250,
    revenue: 45000,
    image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=500',
    status: 'active',
  },
  {
    id: '2',
    name: 'Green Valley Vegetables',
    owner: 'vendor-1',
    description: 'Fresh organic vegetables grown with care',
    location: { lat: 13.0569, lng: 80.2425, address: 'No. 45, Mount Road, Guindy, Chennai, Tamil Nadu 600032' },
    rating: 4.7,
    totalOrders: 980,
    revenue: 38000,
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500',
    status: 'active',
  },
  {
    id: '3',
    name: 'Dairy Delight',
    owner: 'vendor-2',
    description: 'Organic dairy products from grass-fed cows',
    location: { lat: 13.0418, lng: 80.2341, address: 'No. 78, GST Road, Chromepet, Chennai, Tamil Nadu 600044' },
    rating: 4.9,
    totalOrders: 1500,
    revenue: 52000,
    image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=500',
    status: 'active',
  },
  {
    id: '4',
    name: 'Organic Pantry',
    owner: 'vendor-2',
    description: 'Organic pantry essentials and baked goods',
    location: { lat: 13.1067, lng: 80.2206, address: 'No. 23, Poonamallee High Road, Arumbakkam, Chennai, Tamil Nadu 600106' },
    rating: 4.6,
    totalOrders: 850,
    revenue: 35000,
    image: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=500',
    status: 'active',
  },
]

let messages: Message[] = []
let messageIdCounter = 1

function generateMonthlyRevenue(transactions: Transaction[]) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return months.map((month, index) => {
    const revenue = transactions
      .filter((transaction) => new Date(transaction.createdAt).getMonth() === index)
      .reduce((sum, transaction) => sum + transaction.amount, 0)
    return {
      month,
      revenue,
    }
  })
}

async function updateShopRevenue(shopId: string, amount: number) {
  const shop = mockShops.find((entry) => entry.id === shopId)
  if (!shop) return
  shop.revenue += amount
  shop.totalOrders += 1
}

export const db = {
  products: {
    findMany: async (filter?: { category?: string; search?: string; shopId?: string }) => {
      return ProductStore.findMany(filter)
    },
    findById: async (id: string) => {
      return ProductStore.findById(id)
    },
    findFeatured: async () => {
      return ProductStore.findFeatured()
    },
    updateStock: async (id: string, quantity: number) => {
      return ProductStore.updateStock(id, -quantity)
    },
    upsert: async (product: Product) => {
      return ProductStore.upsert(product)
    },
  },
  shops: {
    findMany: async () => mockShops,
    findById: async (id: string) => mockShops.find((shop) => shop.id === id),
    findByOwner: async (email: string) => mockShops.filter((shop) => shop.owner === email),
    updateRevenue: async (shopId: string, amount: number) => {
      await updateShopRevenue(shopId, amount)
    },
  },
  orders: {
    create: async (order: Omit<Order, 'id' | 'createdAt'> & { cartId?: string; couponCode?: string; deliveryType?: 'express' | 'standard' | 'economy' }) => {
      const saved = await OrderStore.create({
        userId: order.userId,
        cartId: order.cartId,
        customerName: order.customerName || '',
        customerEmail: order.customerEmail || '',
        customerPhone: order.customerPhone || order.shippingAddress.phone,
        shippingAddress: order.shippingAddress,
        paymentMethod: order.paymentMethod || 'Cash on Delivery',
        items: order.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        couponCode: order.couponCode,
        deliveryType: order.deliveryType,
        orderDate: order.orderDate || new Date().toISOString(),
      })

      for (const item of saved.items) {
        const product = item.product || (await ProductStore.findById(item.productId))
        if (product?.shopId) {
          await updateShopRevenue(product.shopId, product.price * item.quantity)
        }
      }

      return saved
    },
    findByUserId: async (userId: string) => OrderStore.listByUser(userId),
    getAll: async () => OrderStore.list(),
    findById: async (id: string) => OrderStore.findById(id),
    updateStatus: async (id: string, status: Order['status']) => OrderStore.updateStatus(id, status),
  },
  messages: {
    create: async (message: Omit<Message, 'id' | 'createdAt'>) => {
      const nextMessage: Message = {
        ...message,
        id: String(messageIdCounter++),
        createdAt: new Date().toISOString(),
        read: false,
      }
      messages.push(nextMessage)
      return nextMessage
    },
    findAll: async () => messages,
    findByUserId: async (userId: string) => messages.filter((message) => message.userId === userId),
    markAsRead: async (id: string) => {
      const message = messages.find((entry) => entry.id === id)
      if (message) {
        message.read = true
      }
    },
  },
  transactions: {
    create: async (transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
      return TransactionStore.create(transaction)
    },
    findAll: async () => TransactionStore.findAll(),
    findByUserId: async (userId: string) => TransactionStore.findByUserId(userId),
    findByOrderId: async (orderId: string) => TransactionStore.findByOrderId(orderId),
  },
  analytics: {
    getDashboardStats: async () => {
      const orders = OrderStore.list()
      const transactions = TransactionStore.findAll()
      const products = ProductStore.list()
      const totalRevenue = transactions.reduce((sum, transaction) => sum + transaction.amount, 0)
      const totalOrders = orders.length
      const totalProducts = products.length
      const totalCustomers = UserStore.findAll().filter((user) => user.role === 'customer').length

      return {
        totalRevenue,
        totalOrders,
        totalProducts,
        totalCustomers,
        recentOrders: orders.slice(-10).reverse(),
        topProducts: [...products].sort((a, b) => b.rating - a.rating).slice(0, 5),
        monthlyRevenue: generateMonthlyRevenue(transactions),
      }
    },
  },
}
