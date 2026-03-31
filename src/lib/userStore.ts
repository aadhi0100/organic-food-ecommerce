import crypto from 'crypto'
import fs from 'fs'
import path from 'path'
import type { Address, User } from '@/types'
import { dataPath, ensureDir, normalizePhone, publicPath, readJsonFile, safeSlug, writeJsonFile } from '@/lib/storage'
import { hashPassword, verifyPassword as comparePassword } from '@/lib/auth/password'

export type StoredUser = User & {
  addresses?: Address[]
  passwordHash?: string
  passwordResetTokenHash?: string
  passwordResetTokenExpiresAt?: string
  passwordResetRequestedAt?: string
  authProvider?: 'google' | 'password' | 'hybrid'
  defaultAddressId?: string
  orderHistory?: Array<{
    orderId: string
    date: string
    total: number
    status: string
  }>
  createdAt: string
  updatedAt: string
  lastLogin?: string
  profilePhoto?: string
  picture?: string
}

type AuthRecord = {
  passwordHash?: string
  passwordResetTokenHash?: string
  passwordResetTokenExpiresAt?: string
  passwordResetRequestedAt?: string
}

type UserIndexEntry = {
  id: string
  email: string
  phone: string
  name: string
  role: User['role']
}

const USERS_ROOT = dataPath('users')
const USERS_BY_ID = dataPath('users', 'by-id')
const USERS_BY_EMAIL = dataPath('users', 'by-email')
const USERS_BY_PHONE = dataPath('users', 'by-phone')
const USERS_BY_ROLE = dataPath('users', 'by-role')
const USERS_BY_NAME = dataPath('users', 'by-name')
const USERS_BY_ADDRESS = dataPath('users', 'by-address')
const USERS_MEDIA = dataPath('users', 'media')
const USERS_INDEX = dataPath('users', 'index.json')

function userDir(userId: string) {
  return path.join(USERS_BY_ID, userId)
}

function profileFile(userId: string) {
  return path.join(userDir(userId), 'profile.json')
}

function authFile(userId: string) {
  return path.join(userDir(userId), 'auth.json')
}

function addressesDir(userId: string) {
  return path.join(userDir(userId), 'addresses')
}

function addressFile(userId: string, addressId: string) {
  return path.join(addressesDir(userId), `${addressId}.json`)
}

function byEmailFile(email: string) {
  return path.join(USERS_BY_EMAIL, `${safeSlug(email)}.json`)
}

function byPhoneFile(phone: string) {
  return path.join(USERS_BY_PHONE, `${safeSlug(phone)}.json`)
}

function byRoleFile(role: User['role'], userId: string) {
  return path.join(USERS_BY_ROLE, role, `${userId}.json`)
}

function byNameFile(name: string) {
  return path.join(USERS_BY_NAME, `${safeSlug(name)}.json`)
}

function byAddressFile(user: StoredUser) {
  const country = safeSlug(user.addresses?.find((addr) => addr.isDefault)?.country || user.addresses?.[0]?.country || user.address || 'india') || 'india'
  const state = safeSlug(user.addresses?.find((addr) => addr.isDefault)?.state || user.addresses?.[0]?.state || 'general') || 'general'
  const city = safeSlug(user.addresses?.find((addr) => addr.isDefault)?.city || user.addresses?.[0]?.city || 'general') || 'general'
  return path.join(USERS_BY_ADDRESS, country, state, city, `${user.id}.json`)
}

function defaultProfile(user: Partial<StoredUser>): StoredUser {
  const now = new Date().toISOString()
  const existingAddresses = Array.isArray(user.addresses) ? user.addresses : []
  return {
    id: user.id || String(Date.now()),
    email: user.email || '',
    name: user.name || '',
    role: user.role || 'customer',
    picture: user.picture || user.profilePhoto || '',
    profilePhoto: user.profilePhoto || user.picture || '',
    phone: user.phone || '',
    address: user.address || existingAddresses[0]?.street || '',
    addresses: existingAddresses,
    authProvider: user.authProvider || (user.passwordHash ? 'password' : 'google'),
    defaultAddressId: user.defaultAddressId || existingAddresses.find((addr) => addr.isDefault)?.id || existingAddresses[0]?.id,
    orderHistory: user.orderHistory || [],
    createdAt: user.createdAt || now,
    updatedAt: now,
    lastLogin: user.lastLogin,
    passwordHash: user.passwordHash,
    passwordResetTokenHash: user.passwordResetTokenHash,
    passwordResetTokenExpiresAt: user.passwordResetTokenExpiresAt,
    passwordResetRequestedAt: user.passwordResetRequestedAt,
  }
}

function readAuthRecord(userId: string): AuthRecord {
  return readJsonFile<AuthRecord>(authFile(userId), {})
}

function writeAuthRecord(userId: string, auth: AuthRecord) {
  const hasAuthSecrets = Boolean(
    auth.passwordHash ||
      auth.passwordResetTokenHash ||
      auth.passwordResetTokenExpiresAt ||
      auth.passwordResetRequestedAt,
  )

  if (!hasAuthSecrets) {
    removeFileIfExists(authFile(userId))
    return
  }

  writeJsonFile(authFile(userId), auth)
}

function hashResetToken(token: string) {
  return crypto.createHash('sha256').update(token).digest('hex')
}

function createResetToken() {
  return crypto.randomBytes(32).toString('hex')
}

function loadIndex(): UserIndexEntry[] {
  return readJsonFile<UserIndexEntry[]>(USERS_INDEX, [])
}

function saveIndex(entries: UserIndexEntry[]) {
  writeJsonFile(USERS_INDEX, entries)
}

function syncLookups(user: StoredUser) {
  writeJsonFile(byEmailFile(user.email), { id: user.id, email: user.email })
  if (user.phone) {
    writeJsonFile(byPhoneFile(normalizePhone(user.phone)), { id: user.id, phone: normalizePhone(user.phone) })
  }
  writeJsonFile(byRoleFile(user.role, user.id), { id: user.id, role: user.role })
  writeJsonFile(byNameFile(user.name), { id: user.id, name: user.name })
  writeJsonFile(byAddressFile(user), { id: user.id, address: user.address })
}

function removeFileIfExists(filePath: string) {
  try {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
  } catch {
    // ignore
  }
}

function cleanupOldLookups(user: StoredUser) {
  removeFileIfExists(byEmailFile(user.email))
  if (user.phone) removeFileIfExists(byPhoneFile(normalizePhone(user.phone)))
  removeFileIfExists(byRoleFile(user.role, user.id))
  removeFileIfExists(byNameFile(user.name))
  removeFileIfExists(byAddressFile(user))
}

function getStoredUser(userId: string): StoredUser | null {
  const profile = readJsonFile<StoredUser | null>(profileFile(userId), null)
  if (!profile) return null
  const auth = readAuthRecord(userId)
  return {
    ...defaultProfile(profile),
    ...profile,
    ...auth,
    passwordHash: auth.passwordHash || profile.passwordHash,
  }
}

function persistStoredUser(user: StoredUser) {
  ensureDir(USERS_ROOT)
  ensureDir(USERS_BY_ID)
  ensureDir(userDir(user.id))
  ensureDir(addressesDir(user.id))
  ensureDir(USERS_BY_EMAIL)
  ensureDir(USERS_BY_PHONE)
  ensureDir(path.join(USERS_BY_ROLE, user.role))
  ensureDir(USERS_BY_NAME)
  ensureDir(USERS_BY_ADDRESS)
  ensureDir(USERS_MEDIA)

  const normalized = defaultProfile(user)
  writeJsonFile(profileFile(normalized.id), normalized)

  writeAuthRecord(normalized.id, {
    passwordHash: normalized.passwordHash,
    passwordResetTokenHash: normalized.passwordResetTokenHash,
    passwordResetTokenExpiresAt: normalized.passwordResetTokenExpiresAt,
    passwordResetRequestedAt: normalized.passwordResetRequestedAt,
  })

  const addresses = Array.isArray(normalized.addresses) ? normalized.addresses : []
  addresses.forEach((address, index) => {
    const addressId = address.id || `address-${index + 1}`
    writeJsonFile(addressFile(normalized.id, addressId), {
      ...address,
      id: addressId,
      isDefault: address.isDefault || normalized.defaultAddressId === addressId || index === 0,
    })
  })

  const currentIndex = loadIndex().filter((entry) => entry.id !== normalized.id)
  currentIndex.push({
    id: normalized.id,
    email: normalized.email,
    phone: normalizePhone(normalized.phone || ''),
    name: normalized.name,
    role: normalized.role,
  })
  saveIndex(currentIndex)
  cleanupOldLookups(normalized)
  syncLookups(normalized)
}

export const UserStore = {
  init: () => {
    ensureDir(USERS_ROOT)
    ensureDir(USERS_BY_ID)
    ensureDir(USERS_BY_EMAIL)
    ensureDir(USERS_BY_PHONE)
    ensureDir(USERS_BY_ROLE)
    ensureDir(USERS_BY_NAME)
    ensureDir(USERS_BY_ADDRESS)
    ensureDir(USERS_MEDIA)
    if (!fs.existsSync(USERS_INDEX)) {
      saveIndex([])
    }
  },

  save: (user: Partial<StoredUser>) => {
    const record = defaultProfile(user)
    persistStoredUser(record)
    return record
  },

  findById: (id: string) => {
    return getStoredUser(id)
  },

  findByEmail: (email: string) => {
    const index = loadIndex()
    const key = email.toLowerCase().trim()
    const entry = index.find((item) => item.email.toLowerCase() === key)
    if (entry) return getStoredUser(entry.id)

    const files = fs.existsSync(USERS_BY_ID) ? fs.readdirSync(USERS_BY_ID) : []
    for (const file of files) {
      const profile = getStoredUser(file)
      if (profile?.email.toLowerCase() === key) return profile
    }
    return null
  },

  findByPhone: (phone: string) => {
    const normalized = normalizePhone(phone)
    const index = loadIndex()
    const entry = index.find((item) => normalizePhone(item.phone) === normalized)
    if (entry) return getStoredUser(entry.id)

    const files = fs.existsSync(USERS_BY_ID) ? fs.readdirSync(USERS_BY_ID) : []
    for (const file of files) {
      const profile = getStoredUser(file)
      if (normalizePhone(profile?.phone || '') === normalized) return profile
    }
    return null
  },

  findByIdentifier: (identifier: string) => {
    const normalized = identifier.trim()
    const byEmail = normalized.includes('@') ? UserStore.findByEmail(normalized) : null
    if (byEmail) return byEmail
    return UserStore.findByPhone(normalized)
  },

  findByPasswordResetToken: (token: string) => {
    const tokenHash = hashResetToken(token)
    const index = loadIndex()
    for (const entry of index) {
      const auth = readAuthRecord(entry.id)
      if (auth.passwordResetTokenHash !== tokenHash) continue
      if (auth.passwordResetTokenExpiresAt) {
        const expiresAt = new Date(auth.passwordResetTokenExpiresAt).getTime()
        if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) continue
      }
      const user = getStoredUser(entry.id)
      if (user) return user
    }
    return null
  },

  findAll: () => {
    const index = loadIndex()
    return index
      .map((entry) => getStoredUser(entry.id))
      .filter((user): user is StoredUser => Boolean(user))
  },

  upsertGoogleUser: (input: {
    id: string
    email: string
    name: string
    role: User['role']
    picture?: string
  }) => {
    const existing = UserStore.findById(input.id) || UserStore.findByEmail(input.email)
    const merged: StoredUser = defaultProfile({
      ...existing,
      id: existing?.id || input.id,
      email: input.email,
      name: input.name || existing?.name || input.email.split('@')[0] || 'User',
      role: input.role || existing?.role || 'customer',
      picture: input.picture || existing?.picture || existing?.profilePhoto || '',
      profilePhoto: existing?.profilePhoto || input.picture || existing?.picture || '',
      phone: existing?.phone || '',
      address: existing?.address || existing?.addresses?.[0]?.street || '',
      addresses: existing?.addresses || [],
      authProvider: existing?.passwordHash ? 'hybrid' : 'google',
      defaultAddressId: existing?.defaultAddressId,
      orderHistory: existing?.orderHistory || [],
      createdAt: existing?.createdAt,
      passwordHash: existing?.passwordHash,
    })
    persistStoredUser(merged)
    return merged
  },

  updateProfile: async (userId: string, updates: Partial<StoredUser>) => {
    const current = getStoredUser(userId)
    if (!current) return null
    const merged = defaultProfile({
      ...current,
      ...updates,
      id: current.id,
      email: updates.email || current.email,
      name: updates.name || current.name,
      role: current.role,
      addresses: updates.addresses || current.addresses,
      profilePhoto: updates.profilePhoto || current.profilePhoto,
      picture: updates.picture || current.picture,
      defaultAddressId: updates.defaultAddressId || current.defaultAddressId,
      passwordHash: current.passwordHash,
      createdAt: current.createdAt,
      lastLogin: current.lastLogin,
      orderHistory: current.orderHistory,
    })
    persistStoredUser(merged)
    return merged
  },

  completeSignupProfile: async (userId: string, updates: {
    name: string
    phone: string
    address: string
    profilePhoto?: string
  }) => {
    const current = getStoredUser(userId)
    if (!current) return null
    const addressRecord: Address = {
      id: current.defaultAddressId || `address-${Date.now()}`,
      type: 'home',
      fullName: updates.name,
      street: updates.address,
      city: current.addresses?.[0]?.city || 'Chennai',
      state: current.addresses?.[0]?.state || 'Tamil Nadu',
      zipCode: current.addresses?.[0]?.zipCode || '600001',
      country: current.addresses?.[0]?.country || 'India',
      phone: updates.phone,
      isDefault: true,
    }
    const merged = defaultProfile({
      ...current,
      name: updates.name,
      phone: updates.phone,
      address: updates.address,
      picture: updates.profilePhoto || current.picture || current.profilePhoto,
      profilePhoto: updates.profilePhoto || current.profilePhoto || current.picture,
      addresses: [
        addressRecord,
        ...(current.addresses || [])
          .filter((item) => item.id !== addressRecord.id)
          .map((item) => ({ ...item, isDefault: false })),
      ],
      defaultAddressId: addressRecord.id,
      authProvider: current.passwordHash ? 'hybrid' : current.authProvider || 'google',
      createdAt: current.createdAt,
      passwordHash: current.passwordHash,
      orderHistory: current.orderHistory,
    })
    persistStoredUser(merged)
    return merged
  },

  setPassword: async (userId: string, password: string) => {
    const current = getStoredUser(userId)
    if (!current) return null
    const passwordHash = await hashPassword(password)
    const updated: StoredUser = {
      ...current,
      passwordHash,
      passwordResetTokenHash: undefined,
      passwordResetTokenExpiresAt: undefined,
      passwordResetRequestedAt: undefined,
      authProvider: current.authProvider === 'google' ? 'hybrid' : 'password',
      updatedAt: new Date().toISOString(),
    }
    persistStoredUser(updated)
    return updated
  },

  verifyPassword: async (identifier: string, password: string) => {
    const user = UserStore.findByIdentifier(identifier)
    if (!user?.id) return null
    const auth = readAuthRecord(user.id)
    if (!auth.passwordHash) return null
    const ok = await comparePassword(password, auth.passwordHash)
    if (!ok) return null
    return getStoredUser(user.id)
  },

  updateLastLogin: (userId: string) => {
    const current = getStoredUser(userId)
    if (!current) return null
    const updated = {
      ...current,
      lastLogin: new Date().toISOString(),
    }
    persistStoredUser(updated)
    return updated
  },

  addAddress: (userId: string, address: Address) => {
    const current = getStoredUser(userId)
    if (!current) return null
    const nextAddress: Address = {
      ...address,
      id: address.id || `address-${Date.now()}`,
      isDefault: address.isDefault ?? !current.addresses?.length,
    }
    const nextAddresses = [
      ...(current.addresses || [])
        .filter((item) => item.id !== nextAddress.id)
        .map((item) => ({ ...item, isDefault: nextAddress.isDefault ? false : item.isDefault })),
      nextAddress,
    ]
    const updated = {
      ...current,
      addresses: nextAddresses,
      defaultAddressId: nextAddress.isDefault ? nextAddress.id : current.defaultAddressId,
      address: current.address || nextAddress.street,
    }
    persistStoredUser(updated)
    return updated
  },

  updateAddress: (userId: string, addressId: string, updates: Partial<Address>) => {
    const current = getStoredUser(userId)
    if (!current) return null
    const addresses = (current.addresses || []).map((address) =>
      address.id === addressId ? { ...address, ...updates, id: address.id } : address,
    )
    const updated = {
      ...current,
      addresses,
      defaultAddressId:
        updates.isDefault === true
          ? addressId
          : current.defaultAddressId,
    }
    persistStoredUser(updated)
    return updated
  },

  removeAddress: (userId: string, addressId: string) => {
    const current = getStoredUser(userId)
    if (!current) return null
    const addresses = (current.addresses || []).filter((address) => address.id !== addressId)
    const updated = {
      ...current,
      addresses,
      defaultAddressId: current.defaultAddressId === addressId ? addresses[0]?.id : current.defaultAddressId,
    }
    persistStoredUser(updated)
    return updated
  },

  setDefaultAddress: (userId: string, addressId: string) => {
    const current = getStoredUser(userId)
    if (!current) return null
    const addresses = (current.addresses || []).map((address) => ({
      ...address,
      isDefault: address.id === addressId,
    }))
    const updated = {
      ...current,
      addresses,
      defaultAddressId: addressId,
    }
    persistStoredUser(updated)
    return updated
  },

  appendOrderHistory: (userId: string, order: {
    orderId: string
    date: string
    total: number
    status: string
  }) => {
    const current = getStoredUser(userId)
    if (!current) return null
    const updated = {
      ...current,
      orderHistory: [...(current.orderHistory || []), order],
    }
    persistStoredUser(updated)
    return updated
  },

  getPublicUser: (userId: string) => {
    const current = getStoredUser(userId)
    if (!current) return null
    const {
      passwordHash,
      passwordResetTokenHash,
      passwordResetTokenExpiresAt,
      passwordResetRequestedAt,
      ...publicUser
    } = current
    return publicUser
  },

  createPasswordResetToken: async (identifier: string) => {
    const user = UserStore.findByIdentifier(identifier)
    if (!user?.id) return null

    const current = getStoredUser(user.id)
    if (!current) return null

    const token = createResetToken()
    const now = new Date()
    const expiresAt = new Date(now.getTime() + 60 * 60 * 1000).toISOString()

    const updated: StoredUser = {
      ...current,
      passwordResetTokenHash: hashResetToken(token),
      passwordResetTokenExpiresAt: expiresAt,
      passwordResetRequestedAt: now.toISOString(),
      updatedAt: now.toISOString(),
    }
    persistStoredUser(updated)

    return {
      user: updated,
      token,
      expiresAt,
    }
  },

  resetPasswordWithToken: async (token: string, newPassword: string) => {
    const user = UserStore.findByPasswordResetToken(token)
    if (!user?.id) return null
    return UserStore.setPassword(user.id, newPassword)
  },

  storeProfilePhoto: (userId: string, fileName: string, buffer: Buffer) => {
    const userPhotoDir = path.join(USERS_MEDIA, userId)
    const publicPhotoDir = publicPath('uploads', 'users', userId)
    ensureDir(userPhotoDir)
    ensureDir(publicPhotoDir)
    const dataFilePath = path.join(userPhotoDir, fileName)
    const publicFilePath = path.join(publicPhotoDir, fileName)
    fs.writeFileSync(dataFilePath, buffer)
    fs.writeFileSync(publicFilePath, buffer)
    return `/uploads/users/${userId}/${fileName}`
  },
}

UserStore.init()
