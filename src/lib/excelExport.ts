import fs from 'fs'
import path from 'path'
import type { User, Order, CartItem, Product } from '@/types'

const DATA_DIR = path.join(process.cwd(), 'data')

export const ExcelExport = {
  // Export users to CSV format
  exportUsers: (users: User[]) => {
    const filePath = path.join(DATA_DIR, 'users_export.csv')
    let csv = 'ID,Name,Email,Role,Phone,Address,Created\n'
    
    users.forEach(user => {
      csv += `${user.id},"${user.name}","${user.email}",${user.role},"${user.phone || ''}","${user.address || ''}","${new Date().toISOString()}"\n`
    })
    
    fs.writeFileSync(filePath, csv, 'utf-8')
    return filePath
  },

  // Export orders to CSV format
  exportOrders: (orders: Order[]) => {
    const filePath = path.join(DATA_DIR, 'orders_export.csv')
    let csv = 'Order ID,User ID,Status,Total,Items Count,Created,Shipping Address\n'
    
    orders.forEach(order => {
      const address = `${order.shippingAddress.street} ${order.shippingAddress.city} ${order.shippingAddress.state} ${order.shippingAddress.zipCode}`
      csv += `${order.id},${order.userId},${order.status},₹${order.total.toFixed(2)},${order.items.length},"${order.createdAt}","${address}"\n`
    })
    
    fs.writeFileSync(filePath, csv, 'utf-8')
    return filePath
  },

  // Export products to CSV format
  exportProducts: (products: Product[]) => {
    const filePath = path.join(DATA_DIR, 'products_export.csv')
    let csv = 'ID,Name,Category,Price,Stock,Rating,Reviews,Organic,Featured,Shop ID\n'
    
    products.forEach(product => {
      csv += `${product.id},"${product.name}",${product.category},₹${product.price},${product.stock},${product.rating},${product.reviews},${product.organic},${product.featured},${product.shopId}\n`
    })
    
    fs.writeFileSync(filePath, csv, 'utf-8')
    return filePath
  },

  // Export cart data to CSV format
  exportCarts: (userId: string, items: CartItem[]) => {
    const filePath = path.join(DATA_DIR, `cart_${userId}_export.csv`)
    let csv = 'Product ID,Product Name,Quantity,Price,Subtotal\n'
    
    items.forEach(item => {
      if (item.product) {
        const subtotal = item.product.price * item.quantity
        csv += `${item.productId},"${item.product.name}",${item.quantity},₹${item.product.price},₹${subtotal.toFixed(2)}\n`
      }
    })
    
    fs.writeFileSync(filePath, csv, 'utf-8')
    return filePath
  }
}
