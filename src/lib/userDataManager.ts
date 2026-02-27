import fs from 'fs'
import path from 'path'

const USERS_DIR = path.join(process.cwd(), 'data', 'users')
const USER_DATA_FILE = path.join(process.cwd(), 'data', 'user-database.json')

export interface UserPersonalData {
  id: string
  email: string
  name: string
  role: string
  phone: string
  addresses: Array<{
    id: string
    type: 'home' | 'work' | 'other'
    fullName: string
    street: string
    city: string
    state: string
    zipCode: string
    country: string
    phone: string
    isDefault: boolean
    location?: {
      lat: number
      lng: number
      address: string
    }
  }>
  personalInfo: {
    dateOfBirth?: string
    gender?: string
    language: string
    timezone: string
  }
  preferences: {
    newsletter: boolean
    smsNotifications: boolean
    emailNotifications: boolean
  }
  orderHistory: Array<{
    orderId: string
    date: string
    total: number
    status: string
  }>
  createdAt: string
  updatedAt: string
  lastLogin?: string
}

export const UserDataManager = {
  // Initialize
  init: () => {
    if (!fs.existsSync(USERS_DIR)) {
      fs.mkdirSync(USERS_DIR, { recursive: true })
    }
    if (!fs.existsSync(USER_DATA_FILE)) {
      fs.writeFileSync(USER_DATA_FILE, JSON.stringify({ users: [] }, null, 2))
    }
  },

  // Create new user
  createUser: (userData: Partial<UserPersonalData>): UserPersonalData => {
    UserDataManager.init()
    
    const newUser: UserPersonalData = {
      id: userData.id || String(Date.now()),
      email: userData.email || '',
      name: userData.name || '',
      role: userData.role || 'customer',
      phone: userData.phone || '',
      addresses: userData.addresses || [],
      personalInfo: {
        language: userData.personalInfo?.language || 'en',
        timezone: userData.personalInfo?.timezone || 'Asia/Kolkata',
        ...userData.personalInfo,
      },
      preferences: {
        newsletter: true,
        smsNotifications: true,
        emailNotifications: true,
        ...userData.preferences,
      },
      orderHistory: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const data = JSON.parse(fs.readFileSync(USER_DATA_FILE, 'utf-8'))
    data.users.push(newUser)
    fs.writeFileSync(USER_DATA_FILE, JSON.stringify(data, null, 2))

    // Also save individual file
    const userFile = path.join(USERS_DIR, `${newUser.role}_${newUser.id}.txt`)
    const fileContent = `
ID: ${newUser.id}
Name: ${newUser.name}
Email: ${newUser.email}
Role: ${newUser.role}
Phone: ${newUser.phone}
Language: ${newUser.personalInfo.language}
Created: ${newUser.createdAt}
Addresses: ${newUser.addresses.length}
${newUser.addresses.map((addr, idx) => `
Address ${idx + 1}:
  Type: ${addr.type}
  Name: ${addr.fullName}
  Street: ${addr.street}
  City: ${addr.city}, ${addr.state} ${addr.zipCode}
  Country: ${addr.country}
  Phone: ${addr.phone}
  ${addr.location ? `Location: ${addr.location.lat}, ${addr.location.lng}` : ''}
`).join('\n')}
    `.trim()
    
    fs.writeFileSync(userFile, fileContent)
    
    return newUser
  },

  // Get user by ID
  getUserById: (id: string): UserPersonalData | null => {
    UserDataManager.init()
    const data = JSON.parse(fs.readFileSync(USER_DATA_FILE, 'utf-8'))
    return data.users.find((u: UserPersonalData) => u.id === id) || null
  },

  // Get user by email
  getUserByEmail: (email: string): UserPersonalData | null => {
    UserDataManager.init()
    const data = JSON.parse(fs.readFileSync(USER_DATA_FILE, 'utf-8'))
    return data.users.find((u: UserPersonalData) => u.email === email) || null
  },

  // Update user
  updateUser: (id: string, updates: Partial<UserPersonalData>): boolean => {
    UserDataManager.init()
    const data = JSON.parse(fs.readFileSync(USER_DATA_FILE, 'utf-8'))
    const index = data.users.findIndex((u: UserPersonalData) => u.id === id)
    
    if (index === -1) return false
    
    data.users[index] = {
      ...data.users[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    
    fs.writeFileSync(USER_DATA_FILE, JSON.stringify(data, null, 2))
    return true
  },

  // Add address
  addAddress: (userId: string, address: UserPersonalData['addresses'][0]): boolean => {
    const user = UserDataManager.getUserById(userId)
    if (!user) return false
    
    user.addresses.push({
      ...address,
      id: String(Date.now()),
    })
    
    return UserDataManager.updateUser(userId, { addresses: user.addresses })
  },

  // Update last login
  updateLastLogin: (userId: string): boolean => {
    return UserDataManager.updateUser(userId, {
      lastLogin: new Date().toISOString(),
    })
  },

  // Add order to history
  addOrderToHistory: (userId: string, order: UserPersonalData['orderHistory'][0]): boolean => {
    const user = UserDataManager.getUserById(userId)
    if (!user) return false
    
    user.orderHistory.push(order)
    return UserDataManager.updateUser(userId, { orderHistory: user.orderHistory })
  },

  // Get all users
  getAllUsers: (): UserPersonalData[] => {
    UserDataManager.init()
    const data = JSON.parse(fs.readFileSync(USER_DATA_FILE, 'utf-8'))
    return data.users
  },

  // Export user data
  exportUserData: (userId: string): string => {
    const user = UserDataManager.getUserById(userId)
    if (!user) return ''
    
    return JSON.stringify(user, null, 2)
  },
}
