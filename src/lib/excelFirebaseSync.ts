import * as XLSX from 'xlsx'
import { FirebaseService } from './firebaseService'
import { FileStorage } from './fileStorage'
import type { Product, User, Order } from '@/types'

export const ExcelFirebaseSync = {
  // Export Firebase data to Excel
  exportToExcel: async () => {
    const [products, users, orders] = await Promise.all([
      FirebaseService.products.getAll(),
      FirebaseService.users.getAll(),
      FirebaseService.orders.getAll()
    ])

    const wb = XLSX.utils.book_new()
    
    const productsWS = XLSX.utils.json_to_sheet(products)
    XLSX.utils.book_append_sheet(wb, productsWS, 'Products')
    
    const usersWS = XLSX.utils.json_to_sheet(users)
    XLSX.utils.book_append_sheet(wb, usersWS, 'Users')
    
    const ordersWS = XLSX.utils.json_to_sheet(orders)
    XLSX.utils.book_append_sheet(wb, ordersWS, 'Orders')
    
    XLSX.writeFile(wb, 'data/exports/database_export.xlsx')
    return 'data/exports/database_export.xlsx'
  },

  // Import Excel data to Firebase
  importFromExcel: async (filePath: string) => {
    const wb = XLSX.readFile(filePath)
    
    if (wb.SheetNames.includes('Products')) {
      const products = XLSX.utils.sheet_to_json(wb.Sheets['Products']) as Product[]
      for (const product of products) {
        await FirebaseService.products.add(product)
      }
    }
    
    if (wb.SheetNames.includes('Users')) {
      const users = XLSX.utils.sheet_to_json(wb.Sheets['Users']) as User[]
      for (const user of users) {
        await FirebaseService.users.add(user)
      }
    }
    
    return { success: true, message: 'Data imported successfully' }
  },

  // Sync local files to Firebase
  syncLocalToFirebase: async () => {
    const products = await FileStorage.products.getAll()
    for (const product of products) {
      await FirebaseService.products.add(product)
    }
  }
}
