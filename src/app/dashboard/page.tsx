import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { SESSION_COOKIE_NAME, verifySession } from '@/lib/auth/session'
import { getDashboardPath } from '@/lib/auth/routing'

export default async function DashboardPage() {
  const token = cookies().get(SESSION_COOKIE_NAME)?.value

  if (!token) {
    redirect('/login?next=/dashboard')
  }

  try {
    const session = await verifySession(token)
    redirect(getDashboardPath(session.role))
  } catch {
    redirect('/login?next=/dashboard')
  }
}
