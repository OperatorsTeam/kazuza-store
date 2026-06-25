'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Menu, X, Globe, User } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { useLocaleStore } from '@/store/locale'
import { t } from '@/lib/i18n'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const { getItemCount } = useCartStore()
  const { locale, toggleLocale } = useLocaleStore()
  const itemCount = getItemCount()
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])
  
  const navLinks = [
    { href: `/${locale}`, label: t('nav.home', locale) },
    { href: `/${locale}/products`, label: t('nav.products', locale) },
    { href: `/${locale}/about`, label: t('nav.about', locale) },
  ]
  
  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/90 backdrop-blur-md' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href={`/${locale}`} className="flex-shrink-0">
              <motion.span 
                className="text-xl md:text-2xl font-bold tracking-[0.3em] text-white"
                whileHover={{ letterSpacing: '0.4em' }}
                transition={{ duration: 0.3 }}
              >
                KAZUZA
              </motion.span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm tracking-widest uppercase transition-colors duration-300 ${
                    pathname === link.href
                      ? 'text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            
            {/* Actions */}
            <div className="flex items-center gap-4">
              {/* Language Toggle */}
              <button
                onClick={toggleLocale}
                className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
                aria-label="Toggle language"
              >
                <Globe size={18} />
                <span className="text-xs tracking-wider uppercase">
                  {locale === 'en' ? 'عربي' : 'EN'}
                </span>
              </button>
              
              {/* Cart */}
              <Link
                href={`/${locale}/cart`}
                className="relative text-gray-400 hover:text-white transition-colors"
              >
                <ShoppingBag size={20} />
                {itemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 bg-white text-black text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold"
                  >
                    {itemCount}
                  </motion.span>
                )}
              </Link>
              
              {/* Admin Link */}
              <Link
                href="/admin"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <User size={20} />
              </Link>
              
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden text-gray-400 hover:text-white transition-colors"
                aria-label="Toggle menu"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-black md:hidden"
          >
            <div className="flex flex-col items-center justify-center h-full gap-8">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={link.href}
                    className={`text-2xl tracking-widest uppercase transition-colors duration-300 ${
                      pathname === link.href
                        ? 'text-white'
                        : 'text-gray-500 hover:text-white'
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Link
                  href={`/${locale}/cart`}
                  className="flex items-center gap-2 text-2xl tracking-widest uppercase text-gray-500 hover:text-white transition-colors"
                >
                  {t('nav.cart', locale)}
                  {itemCount > 0 && (
                    <span className="bg-white text-black text-sm px-2 py-1 rounded-full">
                      {itemCount}
                    </span>
                  )}
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
