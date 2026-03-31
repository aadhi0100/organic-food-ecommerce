'use client'

import { usePathname } from 'next/navigation'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { FestivalOfferBanner } from '@/components/FestivalOfferBanner'
import { ServiceWorkerRegistration } from '@/components/ServiceWorkerRegistration'

const AUTH_PAGE_PATHS = new Set(['/login', '/register', '/forgot-password'])

function isAuthRoute(pathname: string) {
  return AUTH_PAGE_PATHS.has(pathname) || pathname.startsWith('/reset-password/')
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const standaloneAuthPage = isAuthRoute(pathname)

  return (
    <>
      <ServiceWorkerRegistration />
      {!standaloneAuthPage && <FestivalOfferBanner />}
      {!standaloneAuthPage && <Header />}
      <main className={standaloneAuthPage ? 'flex flex-1' : 'flex-1'}>{children}</main>
      {!standaloneAuthPage && <Footer />}
    </>
  )
}
