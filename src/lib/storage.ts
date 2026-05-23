import fs from 'fs'
import path from 'path'

// On Vercel with Firestore credentials, all user/order/cart/transaction data
// is stored in Firestore. The /tmp filesystem is only used for product catalog
// (read-heavy, seeded from bundled data/) which is not user-specific.
const IS_VERCEL = Boolean(process.env.VERCEL)
const HAS_FIRESTORE = Boolean(
  process.env.FIREBASE_PROJECT_ID &&
  process.env.FIREBASE_CLIENT_EMAIL &&
  process.env.FIREBASE_PRIVATE_KEY,
)
const SEED_ROOT = path.join(process.cwd(), 'data')
export const DATA_ROOT = IS_VERCEL ? '/tmp/organic-data' : path.join(process.cwd(), 'data')
export const PUBLIC_ROOT = path.join(process.cwd(), 'public')

// On Vercel with Firestore: only seed product/static data, skip user data dirs.
// Without Firestore credentials: seed everything for fallback file-based storage.
if (IS_VERCEL && !fs.existsSync(DATA_ROOT)) {
  try {
    const SKIP_DIRS = HAS_FIRESTORE ? new Set(['users', 'orders', 'carts', 'transactions', 'auth-events']) : new Set<string>()
    function copyDirSync(src: string, dest: string, depth = 0) {
      fs.mkdirSync(dest, { recursive: true })
      for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
        if (depth === 0 && SKIP_DIRS.has(entry.name)) continue
        const srcPath = path.join(src, entry.name)
        const destPath = path.join(dest, entry.name)
        if (entry.isDirectory()) {
          copyDirSync(srcPath, destPath, depth + 1)
        } else {
          fs.copyFileSync(srcPath, destPath)
        }
      }
    }
    if (fs.existsSync(SEED_ROOT)) copyDirSync(SEED_ROOT, DATA_ROOT)
    else fs.mkdirSync(DATA_ROOT, { recursive: true })
  } catch {
    fs.mkdirSync(DATA_ROOT, { recursive: true })
  }
}

export function dataPath(...segments: string[]) {
  return path.join(DATA_ROOT, ...segments)
}

export function publicPath(...segments: string[]) {
  return path.join(PUBLIC_ROOT, ...segments)
}

export function ensureDir(dirPath: string) {
  fs.mkdirSync(dirPath, { recursive: true })
}

export function ensureParentDir(filePath: string) {
  ensureDir(path.dirname(filePath))
}

export function safeSlug(input: string) {
  return (input || '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function normalizePhone(input: string) {
  const trimmed = (input || '').trim()
  if (!trimmed) return ''
  const digits = trimmed.replace(/[^0-9]/g, '')
  if (!digits) return trimmed.replace(/\s+/g, '')
  return digits.startsWith('91') && digits.length > 10 ? `+${digits}` : digits
}

export function readJsonFile<T>(filePath: string, fallback: T): T {
  try {
    if (!fs.existsSync(filePath)) return fallback
    const content = fs.readFileSync(filePath, 'utf-8')
    if (!content.trim()) return fallback
    return JSON.parse(content) as T
  } catch {
    return fallback
  }
}

export function writeJsonFile(filePath: string, value: unknown) {
  ensureParentDir(filePath)
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2), 'utf-8')
}

export function readTextFile(filePath: string, fallback = '') {
  try {
    if (!fs.existsSync(filePath)) return fallback
    return fs.readFileSync(filePath, 'utf-8')
  } catch {
    return fallback
  }
}

export function writeTextFile(filePath: string, value: string) {
  ensureParentDir(filePath)
  fs.writeFileSync(filePath, value, 'utf-8')
}
