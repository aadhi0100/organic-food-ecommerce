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
  password?: string
  phone?: string
  address?: string
}

export interface CartItem {
  productId: string
  quantity: number
  product?: Product
}

export interface Order {
  id: string
  userId: string
  items: CartItem[]
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  shippingAddress: Address
  createdAt: string
}

export interface Address {
  fullName: string
  street: string
  city: string
  state: string
  zipCode: string
  phone: string
  lat?: number
  lng?: number
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
