import type { Address, Order } from '@/types'
import { WAREHOUSE_INFO } from '@/lib/productCatalog'
import { calculatePricing } from '@/lib/pricing'
import { generateTrackingTimeline } from '@/lib/tracking'
import { ProductStore } from '@/lib/productStore'

export type InvoiceLineItem = {
  productId: string
  name: string
  quantity: number
  unitPrice: number
  lineSubtotal: number
  discountPercent: number
  discountAmount: number
  lineTotal: number
}

export type InvoiceData = {
  orderId: string
  orderDate: string
  customerName: string
  customerEmail: string
  customerPhone: string
  shippingAddress: Address
  items: InvoiceLineItem[]
  subtotal: number
  quantityDiscount: number
  bundleDiscount: number
  loyaltyDiscount: number
  couponDiscount: number
  shipping: number
  tax: number
  totalDiscount: number
  total: number
  deliveryDate: string
  trackingNumber: string
  paymentMethod: string
  warehouse: typeof WAREHOUSE_INFO
  trackingTimeline: ReturnType<typeof generateTrackingTimeline>
  discounts: Array<{
    label: string
    type: 'quantity' | 'bundle' | 'coupon' | 'loyalty' | 'shipping'
    amount: number
    percent?: number
  }>
}

async function resolveLineItems(order: Order) {
  const items = await Promise.all(
    order.items.map(async (item) => {
      const product = item.product || (await ProductStore.findById(item.productId))
      if (!product) return null
      const quantity = item.quantity || 1
      const lineSubtotal = product.price * quantity
      const discountPercent = quantity >= 10 ? 15 : quantity >= 6 ? 10 : quantity >= 3 ? 5 : 0
      const discountAmount = (lineSubtotal * discountPercent) / 100
      const lineTotal = lineSubtotal - discountAmount
      return {
        productId: product.id,
        name: product.name,
        quantity,
        unitPrice: product.price,
        lineSubtotal,
        discountPercent,
        discountAmount,
        lineTotal,
      }
    }),
  )
  return items.filter((item): item is NonNullable<typeof item> => Boolean(item))
}

export async function buildInvoiceData(order: Order): Promise<InvoiceData> {
  const items = await resolveLineItems(order)

  const calculated = calculatePricing(
    items.map((item) => ({
      productId: item.productId,
      name: item.name,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    })),
    {
      couponCode: '',
      customerSpend: 0,
    },
  )

  const subtotal = order.subtotal ?? calculated.subtotal
  const quantityDiscount = order.pricingBreakdown?.find((item) => item.type === 'quantity')?.amount ?? calculated.quantityDiscount
  const bundleDiscount = order.pricingBreakdown?.find((item) => item.type === 'bundle')?.amount ?? calculated.bundleDiscount
  const loyaltyDiscount = order.pricingBreakdown?.find((item) => item.type === 'loyalty')?.amount ?? calculated.loyaltyDiscount
  const couponDiscount = order.pricingBreakdown?.find((item) => item.type === 'coupon')?.amount ?? calculated.couponDiscount
  const shipping = order.shipping ?? calculated.shipping
  const tax = order.tax ?? calculated.tax
  const totalDiscount = order.discountTotal ?? calculated.totalDiscount
  const total = order.total || calculated.grandTotal

  return {
    orderId: order.id,
    orderDate: order.orderDate || order.createdAt,
    customerName: order.customerName || order.shippingAddress.fullName || 'Customer',
    customerEmail: order.customerEmail || '',
    customerPhone: order.customerPhone || order.shippingAddress.phone || '',
    shippingAddress: order.shippingAddress,
    items,
    subtotal,
    quantityDiscount,
    bundleDiscount,
    loyaltyDiscount,
    couponDiscount,
    shipping,
    tax,
    totalDiscount,
    total,
    deliveryDate: order.deliveryDate || new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    trackingNumber: order.trackingNumber || `ORG${order.id.slice(-10)}`,
    paymentMethod: order.paymentMethod || 'Cash on Delivery',
    warehouse: order.warehouse || WAREHOUSE_INFO,
    trackingTimeline: order.trackingTimeline || generateTrackingTimeline(order.orderDate || order.createdAt),
    discounts: order.pricingBreakdown || calculated.discounts,
  }
}
