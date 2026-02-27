import { NextResponse } from 'next/server'
import { PriceManager } from '@/lib/priceManager'

export async function POST(request: Request) {
  try {
    const { productId, vendorId, basePrice, dailyPrice, discount, reason } = await request.json()
    
    PriceManager.updateDailyPrice({
      productId,
      vendorId,
      basePrice,
      dailyPrice,
      date: new Date().toISOString().split('T')[0] || '',
      discount,
      reason,
    })
    
    return NextResponse.json({ success: true, message: 'Price updated successfully' })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update price' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')
    const vendorId = searchParams.get('vendorId')
    const basePrice = parseFloat(searchParams.get('basePrice') || '0')
    
    if (!productId || !vendorId) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
    }
    
    const priceInfo = PriceManager.getFinalPrice(productId, vendorId, basePrice)
    
    return NextResponse.json(priceInfo)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get price' }, { status: 500 })
  }
}
