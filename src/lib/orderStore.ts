import fs from 'fs'
import path from 'path'
import type { Address, CartItem, Order, Product } from '@/types'
import { dataPath, ensureDir, readJsonFile, writeJsonFile } from '@/lib/storage'
import { IS_VERCEL, fsGet, fsSet, fsList } from '@/lib/firestoreAdapter'

const FS_ORDERS = 'orders'
import { ProductStore } from '@/lib/productStore'
import { CartStore } from '@/lib/cartStore'
import { TransactionStore } from '@/lib/transactionStore'
import { UserStore } from '@/lib/userStore'
import { calculatePricing } from '@/lib/pricing'
import { generateTrackingTimeline, getTrackingProgress, type DeliveryType } from '@/lib/tracking'
import { WAREHOUSE_INFO } from '@/lib/productCatalog'

type StoredOrder = Order & {
  subtotal?: number
  discountTotal?: number
  tax?: number
  shipping?: number
  pricingBreakdown?: Array<{
    label: string
    type: 'quantity' | 'bundle' | 'coupon' | 'loyalty' | 'shipping'
    amount: number
    percent?: number
  }>
  trackingTimeline?: ReturnType<typeof generateTrackingTimeline>
  warehouse?: {
    name: string
    address: string
    city: string
    state: string
    country: string
  }
  invoiceUrl?: string
}

const ORDERS_ROOT = dataPath('orders')
const ORDERS_BY_ID = dataPath('orders', 'by-id')
const ORDERS_BY_USER = dataPath('orders', 'by-user')
const ORDERS_INDEX = dataPath('orders', 'index.json')

function orderDir(orderId: string) {
  return path.join(ORDERS_BY_ID, orderId)
}

function orderFile(orderId: string) {
  return path.join(orderDir(orderId), 'order.json')
}

function userOrderFile(userId: string, orderId: string) {
  return path.join(ORDERS_BY_USER, userId, `${orderId}.json`)
}

function loadIndex() {
  return readJsonFile<string[]>(ORDERS_INDEX, [])
}

function saveIndex(orderIds: string[]) {
  writeJsonFile(ORDERS_INDEX, orderIds)
}

function readOrder(orderId: string) {
  return readJsonFile<StoredOrder | null>(orderFile(orderId), null)
}

function persistOrder(order: StoredOrder) {
  ensureDir(ORDERS_ROOT)
  ensureDir(ORDERS_BY_ID)
  ensureDir(ORDERS_BY_USER)
  ensureDir(orderDir(order.id))
  ensureDir(path.join(ORDERS_BY_USER, order.userId))
  const nextOrder: StoredOrder = {
    ...order,
    invoiceUrl: order.invoiceUrl || `/invoice/${order.id}`,
  }
  writeJsonFile(orderFile(nextOrder.id), nextOrder)
  writeJsonFile(userOrderFile(nextOrder.userId, nextOrder.id), nextOrder)
  const ids = loadIndex().filter((id) => id !== nextOrder.id)
  ids.push(nextOrder.id)
  saveIndex(ids)
  return nextOrder
}

async function rollbackReservedItems(items: CartItem[]) {
  for (const item of items) {
    await ProductStore.releaseStock(item.productId, item.quantity)
  }
}

function mapStatusFromTracking(orderDate: string) {
  const { activeStage } = getTrackingProgress(orderDate)
  switch (activeStage?.key) {
    case 'warehouse':
      return 'confirmed'
    case 'packaging':
      return 'processing'
    case 'on_the_way':
      return 'shipped'
    case 'delivered':
      return 'delivered'
    default:
      return 'confirmed'
  }
}

async function buildLineItems(items: CartItem[]) {
  const resolved = await Promise.all(
    items.map(async (item) => {
      const product = (await ProductStore.findById(item.productId)) as Product | null
      if (!product) return null
      return {
        productId: item.productId,
        quantity: item.quantity,
        product,
        name: product.name,
        price: product.price,
      }
    }),
  )
  return resolved.filter((item): item is NonNullable<typeof item> => Boolean(item))
}

// ─── Firestore helpers ───────────────────────────────────────────────────────────────────

async function fsSaveOrder(order: StoredOrder): Promise<void> {
  await fsSet(FS_ORDERS, order.id, order)
}

async function fsGetOrder(id: string): Promise<StoredOrder | null> {
  return fsGet<StoredOrder>(FS_ORDERS, id)
}

async function fsListOrders(): Promise<StoredOrder[]> {
  return fsList<StoredOrder>(FS_ORDERS)
}

export const OrderStore = {
  init: () => {
    ensureDir(ORDERS_ROOT)
    ensureDir(ORDERS_BY_ID)
    ensureDir(ORDERS_BY_USER)
    if (!fs.existsSync(ORDERS_INDEX)) {
      saveIndex([])
    }
  },

  create: async (input: {
    userId: string
    cartId?: string
    customerName: string
    customerEmail?: string
    customerPhone: string
    shippingAddress: Address
    paymentMethod: string
    items: Array<{ productId: string; quantity: number }>
    couponCode?: string
    orderDate?: string
    deliveryType?: DeliveryType
  }) => {
    const orderDate = input.orderDate || new Date().toISOString()

    let itemsForOrder: CartItem[] = []
    let cartSnapshot: StoredOrder | null = null
    let reservedFallback: CartItem[] = []

    if (input.cartId) {
      const cart = await CartStore.getCart(input.cartId, input.userId)
      if (cart && cart.items.length > 0) {
        itemsForOrder = cart.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          product: item.product,
        }))
      }
      cartSnapshot = null
    }

    if (itemsForOrder.length === 0) {
      const fallbackItems = await buildLineItems(
        input.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          product: undefined,
        })),
      )
      for (const item of fallbackItems) {
        const reserved = await ProductStore.reserveStock(item.productId, item.quantity)
        if (!reserved) {
          await rollbackReservedItems(reservedFallback)
          throw new Error(`Insufficient stock for ${item.name}`)
        }
        reservedFallback.push({
          productId: item.productId,
          quantity: item.quantity,
          product: reserved,
        })
      }
      itemsForOrder = reservedFallback
    }

    const resolvedItems = await buildLineItems(itemsForOrder)
    if (resolvedItems.length === 0) {
      throw new Error('No items available for order')
    }

    const customerOrders = await OrderStore.listByUser(input.userId)
    const customerSpend = customerOrders.reduce((sum, order) => sum + order.total, 0)
    const pricing = calculatePricing(
      resolvedItems.map((item) => ({
        productId: item.productId,
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.product.price,
      })),
      {
        couponCode: input.couponCode,
        customerSpend,
      },
    )

    const deliveryType: DeliveryType = input.deliveryType || 'standard'
    const trackingTimeline = generateTrackingTimeline(orderDate, deliveryType)
    const trackingNumber = `ORG${Date.now().toString().slice(-10)}`
    const deliveryDate = trackingTimeline[trackingTimeline.length - 1]?.timestamp || new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString()
    const orderId = `ORD${Date.now().toString().slice(-10)}`

    const order: StoredOrder = {
      id: orderId,
      userId: input.userId,
      cartId: input.cartId,
      items: resolvedItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        product: item.product,
      })),
      total: pricing.grandTotal,
      subtotal: pricing.subtotal,
      discountTotal: pricing.totalDiscount,
      tax: pricing.tax,
      shipping: pricing.shipping,
      pricingBreakdown: pricing.discounts,
      status: mapStatusFromTracking(orderDate),
      shippingAddress: input.shippingAddress,
      createdAt: new Date().toISOString(),
      orderDate,
      customerName: input.customerName,
      customerEmail: input.customerEmail || '',
      customerPhone: input.customerPhone,
      deliveryDate,
      trackingNumber,
      paymentMethod: input.paymentMethod,
      invoiceUrl: `/invoice/${orderId}`,
      deliveryType,
      trackingTimeline,
      warehouse: WAREHOUSE_INFO,
    }

    if (IS_VERCEL) {
      await fsSaveOrder(order)
    } else {
      persistOrder(order)
    }

    TransactionStore.create({
      orderId: order.id,
      amount: order.total,
      status: 'completed',
      paymentMethod: input.paymentMethod,
      userId: input.userId,
    })

    await UserStore.appendOrderHistory(input.userId, {
      orderId: order.id,
      date: order.createdAt,
      total: order.total,
      status: order.status,
    })

    if (input.cartId) {
      await CartStore.finalizeCart(input.cartId, input.userId)
    }

    return order
  },

  list: async () => {
    if (IS_VERCEL) return fsListOrders()
    const ids = loadIndex()
    const orders = ids
      .map((id) => readOrder(id))
      .filter((order): order is StoredOrder => Boolean(order))
    if (orders.length > 0) return orders
    const files = fs.existsSync(ORDERS_BY_ID) ? fs.readdirSync(ORDERS_BY_ID) : []
    const fromDisk = files
      .map((file) => readJsonFile<StoredOrder | null>(path.join(ORDERS_BY_ID, file, 'order.json'), null))
      .filter((order): order is StoredOrder => Boolean(order))
    if (fromDisk.length > 0) saveIndex(fromDisk.map((order) => order.id))
    return fromDisk
  },

  listByUser: async (userId: string) => {
    const all = await OrderStore.list()
    return all.filter((order) => order.userId === userId)
  },

  findById: async (orderId: string) => {
    if (IS_VERCEL) return fsGetOrder(orderId)
    return readOrder(orderId) || (await OrderStore.list()).find((order) => order.id === orderId) || null
  },

  updateStatus: async (orderId: string, status: Order['status']) => {
    const current = await OrderStore.findById(orderId)
    if (!current) return null
    const updated = { ...current, status }
    if (IS_VERCEL) { await fsSaveOrder(updated); return updated }
    return persistOrder(updated)
  },

  getTrackingState: async (orderId: string) => {
    const order = await OrderStore.findById(orderId)
    if (!order) return null
    const deliveryType: DeliveryType = (order.deliveryType as DeliveryType) || 'standard'
    const trackingState = getTrackingProgress(order.orderDate || order.createdAt, deliveryType)
    const status = mapStatusFromTracking(order.orderDate || order.createdAt)
    const updated = { ...order, status: status as Order['status'], deliveryType, trackingTimeline: trackingState.timeline }
    if (IS_VERCEL) { await fsSaveOrder(updated) } else { persistOrder(updated) }
    return { order: updated, tracking: trackingState }
  },
}

OrderStore.init()
