import type { Metadata, Viewport } from 'next'
import './globals.css'
import { AuthProvider } from '@/context/AuthContext'
import { ThemeProvider } from '@/context/ThemeContext'
import { NotificationProvider } from '@/context/NotificationContext'
import { LanguageProvider } from '@/context/LanguageContext'
import { AppShell } from '@/components/AppShell'
import { cookies } from 'next/headers'
import { languageFontClasses, normalizeLanguage } from '@/lib/i18n'

export const metadata: Metadata = {
  title: 'Organic — Fresh Organic Products Delivered',
  description: 'Shop 100% certified organic fruits, vegetables, dairy, and more. Fresh organic food delivered to your door.',
  keywords: ['organic food', 'fresh produce', 'organic vegetables', 'organic fruits', 'healthy food'],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Organic',
  },
  icons: {
    icon: [{ url: '/icon-192.svg', sizes: '192x192', type: 'image/svg+xml' }, { url: '/icon-512.svg', sizes: '512x512', type: 'image/svg+xml' }],
    apple: '/icon-512.svg',
    shortcut: '/icon-192.svg',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#16a34a',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies()
  const initialLanguage = normalizeLanguage(cookieStore.get('organic-food-language')?.value)

  return (
    <html lang={initialLanguage}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#16a34a" />
        <link rel="apple-touch-icon" href="/icon-512.svg" />
        <link rel="icon" type="image/svg+xml" sizes="192x192" href="/icon-192.svg" />
        <link rel="icon" type="image/svg+xml" sizes="512x512" href="/icon-512.svg" />
      </head>
      <body className={`flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 ${languageFontClasses[initialLanguage]}`}>
        <ThemeProvider>
          <NotificationProvider>
            <LanguageProvider initialLanguage={initialLanguage}>
              <AuthProvider>
                <AppShell>{children}</AppShell>
              </AuthProvider>
            </LanguageProvider>
          </NotificationProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
