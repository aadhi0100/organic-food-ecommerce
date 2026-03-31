export interface Product {
  id: string
  name: string
  price: number
  description: string
  image: string
  category: string
  stock: number
  rating: number
  reviews: number
  organic: boolean
  featured: boolean
  shopId: string
  images: string[]
}

export interface User {
  id: string
  email: string
  name: string
  role: 'customer' | 'vendor' | 'admin'
  picture?: string
  profilePhoto?: string
  password?: string
  passwordHash?: string
  phone?: string
  address?: string
  addresses?: Address[]
  authProvider?: 'google' | 'password' | 'hybrid'
  defaultAddressId?: string
  createdAt?: string
  updatedAt?: string
  lastLogin?: string
}

export interface CartItem {
  productId: string
  quantity: number
  product?: Product
}

export interface Order {
  id: string
  userId: string
  cartId?: string
  items: CartItem[]
  total: number
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
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'confirmed'
  shippingAddress: Address
  createdAt: string
  orderDate?: string
  customerName?: string
  customerEmail?: string
  customerPhone?: string
  deliveryDate?: string
  trackingNumber?: string
  paymentMethod?: string
  invoiceUrl?: string
  deliveryType?: 'express' | 'standard' | 'economy'
  trackingTimeline?: Array<{
    key: 'warehouse' | 'packaging' | 'on_the_way' | 'delivered'
    label: string
    labelKey: string
    timestamp: string
    location: string
    description: string
    descriptionKey: string
    completed: boolean
  }>
  warehouse?: {
    name: string
    address: string
    city: string
    state: string
    country: string
  }
}

export interface Address {
  id?: string
  type?: 'home' | 'work' | 'other'
  fullName: string
  street: string
  city: string
  state: string
  zipCode: string
  phone: string
  country?: string
  lat?: number
  lng?: number
  isDefault?: boolean
  location?: {
    lat: number
    lng: number
    address: string
  }
}

export interface TrackingEvent {
  key: 'warehouse' | 'packaging' | 'on_the_way' | 'delivered'
  label: string
  timestamp: string
  location: string
  description: string
  completed: boolean
}

export interface InvoiceLine {
  productId: string
  name: string
  quantity: number
  unitPrice: number
  lineSubtotal: number
  discountPercent: number
  discountAmount: number
  lineTotal: number
}

export interface Shop {
  id: string
  name: string
  owner: string
  description: string
  location: {
    lat: number
    lng: number
    address: string
  }
  rating: number
  totalOrders: number
  revenue: number
  image: string
  status: 'active' | 'inactive'
}

export interface Message {
  id: string
  userId: string
  name: string
  email: string
  subject: string
  message: string
  createdAt: string
  read: boolean
}

export interface Transaction {
  id: string
  orderId: string
  userId: string
  amount: number
  status: 'pending' | 'completed' | 'failed'
  paymentMethod: string
  createdAt: string
}
