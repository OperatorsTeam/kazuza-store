'use client'

import { Inter, Cairo } from 'next/font/google'
import { use } from 'react'
import { useLocaleStore } from '@/store/locale'
import { isRTL, locales, Locale } from '@/lib/i18n'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import { motion, AnimatePresence } from 'framer-motion'
import Loading from '@/components/ui/loading'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const cairo = Cairo({
  subsets: ['arabic'],
  variable: '--font-cairo',
  display: 'swap',
})

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const paramLocale = params.locale

  const currentLocale: Locale =
    locales.includes(paramLocale as Locale)
      ? (paramLocale as Locale)
      : 'ar'

  const dir = isRTL(currentLocale) ? 'rtl' : 'ltr'

  return (
    <html lang={currentLocale} dir={dir} className={`${inter.variable} ${cairo.variable}`}>
      <body className={`${isRTL(currentLocale) ? cairo.className : inter.className} antialiased`}>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1 pt-16 md:pt-20">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentLocale}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>
          <Footer />
        </div>
      </body>
    </html>
  )
}