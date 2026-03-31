export type PricingLineItem = {
  productId: string
  name: string
  quantity: number
  unitPrice: number
  lineSubtotal: number
  discountPercent: number
  discountAmount: number
  lineTotal: number
}

export type PricingDiscount = {
  label: string
  type: 'quantity' | 'bundle' | 'coupon' | 'loyalty' | 'shipping'
  amount: number
  percent?: number
}

export type PricingSummary = {
  subtotal: number
  itemsTotal: number
  quantityDiscount: number
  bundleDiscount: number
  couponDiscount: number
  loyaltyDiscount: number
  shipping: number
  tax: number
  totalDiscount: number
  grandTotal: number
  discounts: PricingDiscount[]
  lines: PricingLineItem[]
}

export type PricingInputItem = {
  productId: string
  name: string
  quantity: number
  unitPrice: number
}

const COUPON_CODES: Record<string, number> = {
  LOYAL5: 5,
  LOYAL10: 10,
  LOYAL15: 15,
  LOYAL20: 20,
  WELCOME10: 10,
  SAVE15: 15,
}

function roundMoney(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100
}

export function getQuantityDiscountPercent(quantity: number) {
  if (quantity >= 10) return 15
  if (quantity >= 6) return 10
  if (quantity >= 3) return 5
  return 0
}

export function getLoyaltyDiscountPercent(totalSpent: number) {
  if (totalSpent >= 50000) return 20
  if (totalSpent >= 30000) return 15
  if (totalSpent >= 15000) return 10
  if (totalSpent >= 5000) return 5
  return 0
}

export function getCouponDiscountPercent(code?: string) {
  const normalized = (code || '').trim().toUpperCase()
  return COUPON_CODES[normalized] || 0
}

export function calculatePricing(
  items: PricingInputItem[],
  options?: {
    couponCode?: string
    customerSpend?: number
  },
): PricingSummary {
  const normalizedLines = items
    .filter((item) => item.quantity > 0 && item.unitPrice >= 0)
    .map((item) => {
      const lineSubtotal = roundMoney(item.unitPrice * item.quantity)
      const discountPercent = getQuantityDiscountPercent(item.quantity)
      const discountAmount = roundMoney((lineSubtotal * discountPercent) / 100)
      const lineTotal = roundMoney(lineSubtotal - discountAmount)
      return {
        productId: item.productId,
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        lineSubtotal,
        discountPercent,
        discountAmount,
        lineTotal,
      }
    })

  const itemsTotal = roundMoney(
    normalizedLines.reduce((sum, line) => sum + line.lineSubtotal, 0),
  )
  const quantityDiscount = roundMoney(
    normalizedLines.reduce((sum, line) => sum + line.discountAmount, 0),
  )
  const subtotalAfterQuantityDiscount = roundMoney(
    normalizedLines.reduce((sum, line) => sum + line.lineTotal, 0),
  )

  const distinctProducts = normalizedLines.length
  const totalQuantity = normalizedLines.reduce((sum, line) => sum + line.quantity, 0)

  let bundlePercent = 0
  if (totalQuantity >= 15 || distinctProducts >= 5) bundlePercent = 8
  else if (totalQuantity >= 8 || distinctProducts >= 3) bundlePercent = 5

  const bundleDiscount = roundMoney(
    (subtotalAfterQuantityDiscount * bundlePercent) / 100,
  )

  const loyaltyPercent = getLoyaltyDiscountPercent(options?.customerSpend || 0)
  const loyaltyBase = roundMoney(subtotalAfterQuantityDiscount - bundleDiscount)
  const loyaltyDiscount = roundMoney((loyaltyBase * loyaltyPercent) / 100)

  const couponPercent = getCouponDiscountPercent(options?.couponCode)
  const couponBase = roundMoney(loyaltyBase - loyaltyDiscount)
  const couponDiscount = roundMoney((couponBase * couponPercent) / 100)

  const afterDiscounts = roundMoney(
    subtotalAfterQuantityDiscount - bundleDiscount - loyaltyDiscount - couponDiscount,
  )

  const shipping = afterDiscounts >= 1000 || afterDiscounts === 0 ? 0 : 49
  const tax = roundMoney(afterDiscounts * 0.05)
  const totalDiscount = roundMoney(
    quantityDiscount + bundleDiscount + loyaltyDiscount + couponDiscount,
  )
  const grandTotal = roundMoney(afterDiscounts + shipping + tax)

  const discounts: PricingDiscount[] = []
  if (quantityDiscount > 0) {
    discounts.push({
      label: 'Quantity discount',
      type: 'quantity',
      amount: quantityDiscount,
    })
  }
  if (bundleDiscount > 0) {
    discounts.push({
      label: 'Bundle bonus',
      type: 'bundle',
      amount: bundleDiscount,
      percent: bundlePercent,
    })
  }
  if (loyaltyDiscount > 0) {
    discounts.push({
      label: 'Loyalty discount',
      type: 'loyalty',
      amount: loyaltyDiscount,
      percent: loyaltyPercent,
    })
  }
  if (couponDiscount > 0) {
    discounts.push({
      label: options?.couponCode ? `Coupon ${options.couponCode.toUpperCase()}` : 'Coupon discount',
      type: 'coupon',
      amount: couponDiscount,
      percent: couponPercent,
    })
  }
  if (shipping === 0 && afterDiscounts > 0) {
    discounts.push({
      label: 'Free shipping',
      type: 'shipping',
      amount: 0,
    })
  }

  return {
    subtotal: subtotalAfterQuantityDiscount,
    itemsTotal,
    quantityDiscount,
    bundleDiscount,
    couponDiscount,
    loyaltyDiscount,
    shipping,
    tax,
    totalDiscount,
    grandTotal,
    discounts,
    lines: normalizedLines,
  }
}
