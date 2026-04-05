/**
 * Firestore adapter — mirrors the file-based storage API.
 * Used only when IS_VERCEL is true (i.e. in production on Vercel).
 */
import { getAdminDb } from '@/lib/firebaseAdmin'

export const IS_VERCEL = Boolean(process.env.VERCEL)

// ─── Generic helpers ──────────────────────────────────────────────────────────

export async function fsGet<T>(collection: string, docId: string): Promise<T | null> {
  const snap = await getAdminDb().collection(collection).doc(docId).get()
  return snap.exists ? (snap.data() as T) : null
}

export async function fsSet(collection: string, docId: string, data: object): Promise<void> {
  await getAdminDb().collection(collection).doc(docId).set(data, { merge: true })
}

export async function fsDelete(collection: string, docId: string): Promise<void> {
  await getAdminDb().collection(collection).doc(docId).delete()
}

export async function fsList<T>(collection: string): Promise<T[]> {
  const snap = await getAdminDb().collection(collection).get()
  return snap.docs.map((d) => d.data() as T)
}

export async function fsQuery<T>(
  collection: string,
  field: string,
  value: string,
): Promise<T[]> {
  const snap = await getAdminDb().collection(collection).where(field, '==', value).get()
  return snap.docs.map((d) => d.data() as T)
}

export async function fsQueryOne<T>(
  collection: string,
  field: string,
  value: string,
): Promise<T | null> {
  const results = await fsQuery<T>(collection, field, value)
  return results[0] ?? null
}
