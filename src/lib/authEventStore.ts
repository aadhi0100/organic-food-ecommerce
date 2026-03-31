import { dataPath, ensureDir, readJsonFile, writeJsonFile } from '@/lib/storage'

export type AuthEventType = 'login' | 'signup'

export type AuthEvent = {
  id: string
  type: AuthEventType
  userId: string
  email: string
  name: string
  provider: 'google' | 'password'
  ip?: string
  userAgent?: string
  timestamp: string
}

const AUTH_EVENTS_DIR = dataPath('auth-events')
const AUTH_EVENTS_FILE = dataPath('auth-events', 'events.json')

function loadEvents(): AuthEvent[] {
  ensureDir(AUTH_EVENTS_DIR)
  return readJsonFile<AuthEvent[]>(AUTH_EVENTS_FILE, [])
}

function saveEvents(events: AuthEvent[]) {
  writeJsonFile(AUTH_EVENTS_FILE, events)
}

export const AuthEventStore = {
  record(event: Omit<AuthEvent, 'id' | 'timestamp'>) {
    const events = loadEvents()
    const entry: AuthEvent = {
      ...event,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      timestamp: new Date().toISOString(),
    }
    events.push(entry)
    saveEvents(events)
    return entry
  },

  findAll(): AuthEvent[] {
    return loadEvents()
  },

  findByUserId(userId: string): AuthEvent[] {
    return loadEvents().filter(e => e.userId === userId)
  },

  findByType(type: AuthEventType): AuthEvent[] {
    return loadEvents().filter(e => e.type === type)
  },
}
