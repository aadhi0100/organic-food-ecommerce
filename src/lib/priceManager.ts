import fs from 'fs'
import path from 'path'

const PRICE_UPDATES_DIR = path.join(process.cwd(), 'data', 'price-updates')

export interface DailyPrice {
  productId: string
  vendorId: string
  basePrice: number
  dailyPrice: number
  date: string
  discount?: number
  reason?: string
}

export interface WeeklyOffer {
  id: string
  productId: string
  vendorId: string
  discount: number
  startDate: string
  endDate: string
  active: boolean
}

export const PriceManager = {
  // Initialize directory
  init: () => {
    if (!fs.existsSync(PRICE_UPDATES_DIR)) {
      fs.mkdirSync(PRICE_UPDATES_DIR, { recursive: true })
    }
  },

  // Update daily price
  updateDailyPrice: (update: DailyPrice) => {
    PriceManager.init()
    const today = new Date().toISOString().split('T')[0] || ''
    const filePath = path.join(PRICE_UPDATES_DIR, `${today}.json`)
    
    let updates: DailyPrice[] = []
    if (fs.existsSync(filePath)) {
      updates = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    }
    
    const index = updates.findIndex(u => u.productId === update.productId && u.vendorId === update.vendorId)
    if (index >= 0) {
      updates[index] = { ...update, date: today }
    } else {
      updates.push({ ...update, date: today })
    }
    
    fs.writeFileSync(filePath, JSON.stringify(updates, null, 2))
  },

  // Get today's price
  getTodayPrice: (productId: string, vendorId: string, basePrice: number): number => {
    PriceManager.init()
    const today = new Date().toISOString().split('T')[0] || ''
    const filePath = path.join(PRICE_UPDATES_DIR, `${today}.json`)
    
    if (!fs.existsSync(filePath)) return basePrice
    
    const updates: DailyPrice[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    const update = updates.find(u => u.productId === productId && u.vendorId === vendorId)
    
    return update ? update.dailyPrice : basePrice
  },

  // Create weekly offer
  createWeeklyOffer: (offer: WeeklyOffer) => {
    PriceManager.init()
    const filePath = path.join(PRICE_UPDATES_DIR, 'weekly-offers.json')
    
    let offers: WeeklyOffer[] = []
    if (fs.existsSync(filePath)) {
      offers = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    }
    
    offers.push(offer)
    fs.writeFileSync(filePath, JSON.stringify(offers, null, 2))
  },

  // Get active weekly offers
  getActiveWeeklyOffers: (productId: string, vendorId: string): WeeklyOffer | null => {
    PriceManager.init()
    const filePath = path.join(PRICE_UPDATES_DIR, 'weekly-offers.json')
    
    if (!fs.existsSync(filePath)) return null
    
    const offers: WeeklyOffer[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    const today = new Date()
    
    return offers.find(o => 
      o.productId === productId && 
      o.vendorId === vendorId && 
      o.active &&
      new Date(o.startDate) <= today && 
      new Date(o.endDate) >= today
    ) || null
  },

  // Calculate final price with all discounts
  getFinalPrice: (productId: string, vendorId: string, basePrice: number): { price: number, discount: number, reason: string } => {
    let finalPrice = PriceManager.getTodayPrice(productId, vendorId, basePrice)
    let totalDiscount = 0
    let reason = ''

    // Check weekly offer
    const weeklyOffer = PriceManager.getActiveWeeklyOffers(productId, vendorId)
    if (weeklyOffer) {
      const discount = (finalPrice * weeklyOffer.discount) / 100
      finalPrice -= discount
      totalDiscount += weeklyOffer.discount
      reason = 'Weekly Offer'
    }

    return { price: finalPrice, discount: totalDiscount, reason }
  }
}
