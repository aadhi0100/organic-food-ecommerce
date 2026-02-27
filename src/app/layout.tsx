import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/context/AuthContext'
import { ThemeProvider } from '@/context/ThemeContext'
import { NotificationProvider } from '@/context/NotificationContext'
import { LanguageProvider } from '@/context/LanguageContext'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { ServiceWorkerRegistration } from '@/components/ServiceWorkerRegistration'
import FestivalOfferBanner from '@/components/FestivalOfferBanner'

export const metadata: Metadata = {
  title: 'Organic Food Store - Fresh Organic Products Delivered',
  description: 'Shop 100% certified organic fruits, vegetables, dairy, and more. Fresh organic food delivered to your door.',
  manifest: '/manifest.json',
  themeColor: '#16a34a',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Organic Food',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#16a34a" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
        <ThemeProvider>
          <NotificationProvider>
            <LanguageProvider>
              <AuthProvider>
                <ServiceWorkerRegistration />
                <FestivalOfferBanner />
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
              </AuthProvider>
            </LanguageProvider>
          </NotificationProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
