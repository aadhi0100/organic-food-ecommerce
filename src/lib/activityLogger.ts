// Activity Logger - Tracks all activities in the app
// This file stores: orders, messages, transactions, user activities, product views

export interface ActivityLog {
  id: string
  type: 'order' | 'message' | 'transaction' | 'user_action' | 'product_view' | 'cart_action'
  userId: string
  data: any
  timestamp: string
  ipAddress?: string
  userAgent?: string
}

class ActivityLogger {
  private logs: ActivityLog[] = []
  private logIdCounter = 1

  // Initialize from localStorage
  constructor() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('activity_logs')
      if (stored) {
        this.logs = JSON.parse(stored)
        this.logIdCounter = this.logs.length + 1
      }
    }
  }

  // Log any activity
  log(type: ActivityLog['type'], userId: string, data: any) {
    const activity: ActivityLog = {
      id: String(this.logIdCounter++),
      type,
      userId,
      data,
      timestamp: new Date().toISOString(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server'
    }
    
    this.logs.push(activity)
    this.save()
    
    // Also log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[${type}]`, data)
    }
    
    return activity
  }

  // Save to localStorage
  private save() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('activity_logs', JSON.stringify(this.logs))
    }
  }

  // Get all logs
  getAllLogs() {
    return this.logs
  }

  // Get logs by type
  getLogsByType(type: ActivityLog['type']) {
    return this.logs.filter(log => log.type === type)
  }

  // Get logs by user
  getLogsByUser(userId: string) {
    return this.logs.filter(log => log.userId === userId)
  }

  // Get recent logs
  getRecentLogs(limit: number = 50) {
    return this.logs.slice(-limit).reverse()
  }

  // Export logs as JSON
  exportLogs() {
    return JSON.stringify(this.logs, null, 2)
  }

  // Export logs as CSV
  exportLogsCSV() {
    const headers = ['ID', 'Type', 'User ID', 'Timestamp', 'Data']
    const rows = this.logs.map(log => [
      log.id,
      log.type,
      log.userId,
      log.timestamp,
      JSON.stringify(log.data)
    ])
    
    return [headers, ...rows].map(row => row.join(',')).join('\n')
  }

  // Clear old logs (keep last 1000)
  cleanup() {
    if (this.logs.length > 1000) {
      this.logs = this.logs.slice(-1000)
      this.save()
    }
  }

  // Get statistics
  getStats() {
    const stats = {
      totalLogs: this.logs.length,
      byType: {} as Record<string, number>,
      byUser: {} as Record<string, number>,
      recentActivity: this.getRecentLogs(10)
    }

    this.logs.forEach(log => {
      stats.byType[log.type] = (stats.byType[log.type] || 0) + 1
      stats.byUser[log.userId] = (stats.byUser[log.userId] || 0) + 1
    })

    return stats
  }
}

// Singleton instance
export const activityLogger = new ActivityLogger()

// Helper functions for common activities
export const logActivity = {
  // Order activities
  orderPlaced: (userId: string, orderData: any) => {
    return activityLogger.log('order', userId, {
      action: 'placed',
      ...orderData
    })
  },
  
  orderUpdated: (userId: string, orderId: string, status: string) => {
    return activityLogger.log('order', userId, {
      action: 'updated',
      orderId,
      status
    })
  },

  // Message activities
  messageSent: (userId: string, messageData: any) => {
    return activityLogger.log('message', userId, {
      action: 'sent',
      ...messageData
    })
  },

  // Transaction activities
  transactionCompleted: (userId: string, transactionData: any) => {
    return activityLogger.log('transaction', userId, {
      action: 'completed',
      ...transactionData
    })
  },

  // User activities
  userLogin: (userId: string, email: string) => {
    return activityLogger.log('user_action', userId, {
      action: 'login',
      email
    })
  },

  userLogout: (userId: string) => {
    return activityLogger.log('user_action', userId, {
      action: 'logout'
    })
  },

  userRegistered: (userId: string, email: string) => {
    return activityLogger.log('user_action', userId, {
      action: 'registered',
      email
    })
  },

  // Product activities
  productViewed: (userId: string, productId: string, productName: string) => {
    return activityLogger.log('product_view', userId, {
      productId,
      productName
    })
  },

  productSearched: (userId: string, query: string) => {
    return activityLogger.log('user_action', userId, {
      action: 'search',
      query
    })
  },

  // Cart activities
  addedToCart: (userId: string, productId: string, quantity: number) => {
    return activityLogger.log('cart_action', userId, {
      action: 'added',
      productId,
      quantity
    })
  },

  removedFromCart: (userId: string, productId: string) => {
    return activityLogger.log('cart_action', userId, {
      action: 'removed',
      productId
    })
  },

  cartCleared: (userId: string) => {
    return activityLogger.log('cart_action', userId, {
      action: 'cleared'
    })
  }
}

// Export logs to file
export const downloadLogs = (format: 'json' | 'csv' = 'json') => {
  const data = format === 'json' 
    ? activityLogger.exportLogs()
    : activityLogger.exportLogsCSV()
  
  const blob = new Blob([data], { type: format === 'json' ? 'application/json' : 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `activity-logs-${new Date().toISOString()}.${format}`
  a.click()
  URL.revokeObjectURL(url)
}

// View logs in console
export const viewLogs = () => {
  console.table(activityLogger.getRecentLogs(20))
  console.log('Statistics:', activityLogger.getStats())
}

// Auto cleanup on page load
if (typeof window !== 'undefined') {
  activityLogger.cleanup()
}
