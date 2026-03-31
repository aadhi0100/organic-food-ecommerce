import type { User } from '@/types'

type Role = User['role']
type OnboardingUser = Pick<User, 'name' | 'phone' | 'address'> | null | undefined

export function getDashboardPath(role: Role | null | undefined) {
  switch (role) {
    case 'admin':
      return '/dashboard/admin'
    case 'vendor':
      return '/dashboard/vendor'
    default:
      return '/dashboard/customer'
  }
}

export function sanitizeNextPath(nextPath: string | null | undefined, fallback = '/dashboard') {
  if (!nextPath || !nextPath.startsWith('/')) {
    return fallback
  }

  return nextPath
}

export function hasCompletedOnboarding(user: OnboardingUser) {
  if (!user) return false

  return Boolean(user.name?.trim() && user.phone?.trim() && user.address?.trim())
}
