'use client'

import { useEffect, useState, use } from 'react'
import { Inter, Cairo } from 'next/font/google'
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
  params: Promise<{ locale: string }>
}) {
  const { locale: paramLocale } = use(params)
  const { locale, setLocale } = useLocaleStore()
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const validLocale = locales.includes(paramLocale as Locale) 
      ? paramLocale as Locale 
      : 'ar'
    if (validLocale !== locale) {
      setLocale(validLocale)
    }
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, [paramLocale, locale, setLocale])
  
  const dir = isRTL(locale) ? 'rtl' : 'ltr'
  
  if (loading) {
    return <Loading />
  }
  
  return (
    <html lang={locale} dir={dir} className={`${inter.variable} ${cairo.variable}`}>
      <body className={`${isRTL(locale) ? cairo.className : inter.className} antialiased`}>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1 pt-16 md:pt-20">
            <AnimatePresence mode="wait">
              <motion.div
                key={locale}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
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
