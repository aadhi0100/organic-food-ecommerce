import fs from 'fs'
import path from 'path'
import type { User, Product, Order, CartItem } from '@/types'

const DATA_DIR = path.join(process.cwd(), 'data')

export const FileStorage = {
  // User Management
  users: {
    save: (user: User) => {
      const filePath = path.join(DATA_DIR, 'users', `${user.role}_${user.id}.txt`)
      const content = `ID: ${user.id}\nName: ${user.name}\nEmail: ${user.email}\nRole: ${user.role}\nPhone: ${user.phone || 'N/A'}\nAddress: ${user.address || 'N/A'}\nCreated: ${new Date().toISOString()}\n`
      fs.writeFileSync(filePath, content, 'utf-8')
    },
    
    getAll: (role?: string): User[] => {
      const usersDir = path.join(DATA_DIR, 'users')
      if (!fs.existsSync(usersDir)) return []
      
      const files = fs.readdirSync(usersDir)
      const users: User[] = []
      
      files.forEach(file => {
        if (role && !file.startsWith(role)) return
        const content = fs.readFileSync(path.join(usersDir, file), 'utf-8')
        const lines = content.split('\n')
        const user: any = {}
        lines.forEach(line => {
          const [key, ...value] = line.split(': ')
          if (key && value.length) user[key.toLowerCase()] = value.join(': ')
        })
        if (user.id) users.push(user as User)
      })
      return users
    },
    
    findByEmail: (email: string): User | null => {
      const users = FileStorage.users.getAll()
      return users.find(u => u.email === email) || null
    }
  },

  // Cart Management
  carts: {
    save: (userId: string, items: CartItem[]) => {
      const filePath = path.join(DATA_DIR, 'carts', `cart_${userId}.txt`)
      let content = `User ID: ${userId}\nUpdated: ${new Date().toISOString()}\n\nCart Items:\n`
      items.forEach((item, idx) => {
        content += `\nItem ${idx + 1}:\n`
        content += `  Product ID: ${item.productId}\n`
        content += `  Quantity: ${item.quantity}\n`
        if (item.product) {
          content += `  Product Name: ${item.product.name}\n`
          content += `  Price: ₹${item.product.price}\n`
          content += `  Subtotal: ₹${(item.product.price * item.quantity).toFixed(2)}\n`
        }
      })
      fs.writeFileSync(filePath, content, 'utf-8')
    },
    
    load: (userId: string): CartItem[] => {
      const filePath = path.join(DATA_DIR, 'carts', `cart_${userId}.txt`)
      if (!fs.existsSync(filePath)) return []
      
      const content = fs.readFileSync(filePath, 'utf-8')
      const items: CartItem[] = []
      const lines = content.split('\n')
      
      let currentItem: any = {}
      lines.forEach(line => {
        if (line.includes('Product ID:')) {
          currentItem.productId = line.split(': ')[1]
        } else if (line.includes('Quantity:') && !line.includes('Product')) {
          const quantityStr = line.split(': ')[1]
          currentItem.quantity = parseInt(quantityStr || '0')
          if (currentItem.productId) {
            items.push(currentItem)
            currentItem = {}
          }
        }
      })
      return items
    },
    
    clear: (userId: string) => {
      const filePath = path.join(DATA_DIR, 'carts', `cart_${userId}.txt`)
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
    }
  },

  // Order Management
  orders: {
    save: (order: Order) => {
      const filePath = path.join(DATA_DIR, 'orders', `order_${order.id}.txt`)
      let content = `Order ID: ${order.id}\nUser ID: ${order.userId}\nStatus: ${order.status}\nTotal: ₹${order.total.toFixed(2)}\nCreated: ${order.createdAt}\n\n`
      content += `Shipping Address:\n`
      content += `  Name: ${order.shippingAddress.fullName}\n`
      content += `  Street: ${order.shippingAddress.street}\n`
      content += `  City: ${order.shippingAddress.city}\n`
      content += `  State: ${order.shippingAddress.state}\n`
      content += `  ZIP: ${order.shippingAddress.zipCode}\n`
      content += `  Phone: ${order.shippingAddress.phone}\n\n`
      content += `Order Items:\n`
      order.items.forEach((item, idx) => {
        content += `\nItem ${idx + 1}:\n`
        content += `  Product ID: ${item.productId}\n`
        content += `  Quantity: ${item.quantity}\n`
        if (item.product) {
          content += `  Product: ${item.product.name}\n`
          content += `  Price: ₹${item.product.price}\n`
          content += `  Subtotal: ₹${(item.product.price * item.quantity).toFixed(2)}\n`
        }
      })
      fs.writeFileSync(filePath, content, 'utf-8')
    },
    
    getAll: (): Order[] => {
      const ordersDir = path.join(DATA_DIR, 'orders')
      if (!fs.existsSync(ordersDir)) return []
      
      const files = fs.readdirSync(ordersDir)
      return files.map(file => {
        const content = fs.readFileSync(path.join(ordersDir, file), 'utf-8')
        const lines = content.split('\n')
        const order: any = { items: [], shippingAddress: {} }
        
        lines.forEach(line => {
          if (line.startsWith('Order ID:')) order.id = line.split(': ')[1] || ''
          else if (line.startsWith('User ID:')) order.userId = line.split(': ')[1] || ''
          else if (line.startsWith('Status:')) order.status = line.split(': ')[1] || ''
          else if (line.startsWith('Total:')) order.total = parseFloat(line.split('₹')[1] || '0')
          else if (line.startsWith('Created:')) order.createdAt = line.split(': ')[1] || ''
        })
        return order as Order
      })
    },
    
    getByUserId: (userId: string): Order[] => {
      return FileStorage.orders.getAll().filter(o => o.userId === userId)
    }
  },

  // Product Management
  products: {
    saveAll: (products: Product[]) => {
      const filePath = path.join(DATA_DIR, 'products', 'products_catalog.txt')
      let content = `ORGANIC FOOD PRODUCTS CATALOG\nTotal Products: ${products.length}\nLast Updated: ${new Date().toISOString()}\n\n`
      content += '='.repeat(80) + '\n\n'
      
      products.forEach((product, idx) => {
        content += `Product ${idx + 1}:\n`
        content += `  ID: ${product.id}\n`
        content += `  Name: ${product.name}\n`
        content += `  Category: ${product.category}\n`
        content += `  Price: ₹${product.price.toFixed(2)}\n`
        content += `  Stock: ${product.stock} units\n`
        content += `  Rating: ${product.rating}/5 (${product.reviews} reviews)\n`
        content += `  Organic: ${product.organic ? 'Yes' : 'No'}\n`
        content += `  Featured: ${product.featured ? 'Yes' : 'No'}\n`
        content += `  Shop ID: ${product.shopId}\n`
        content += `  Description: ${product.description}\n`
        content += '\n' + '-'.repeat(80) + '\n\n'
      })
      
      fs.writeFileSync(filePath, content, 'utf-8')
    },
    
    getAll: (): Product[] => {
      return []
    }
  },

  // Initialize directories
  init: () => {
    const dirs = ['users', 'carts', 'orders', 'products']
    dirs.forEach(dir => {
      const dirPath = path.join(DATA_DIR, dir)
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true })
      }
    })
  }
}
