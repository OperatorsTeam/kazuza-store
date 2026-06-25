'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { useLocaleStore } from '@/store/locale'
import { useCartStore } from '@/store/cart'
import { t } from '@/lib/i18n'
import Button from '@/components/ui/button'

export default function CartPage() {
  const { locale } = useLocaleStore()
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore()
  const total = getTotal()
  
  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <ShoppingBag size={64} className="text-gray-600 mx-auto mb-6" />
          <h1 className="text-2xl font-bold tracking-wider text-white mb-4">
            {t('cart.empty', locale)}
          </h1>
          <Link href={`/${locale}/products`}>
            <Button variant="outline">
              {t('cart.continue', locale)}
            </Button>
          </Link>
        </motion.div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-3xl md:text-5xl font-bold tracking-wider text-white">
            {t('cart.title', locale)}
          </h1>
        </motion.div>
        
        {/* Cart Items */}
        <div className="space-y-6 mb-12">
          {items.map((item, index) => (
            <motion.div
              key={item.product.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex gap-4 md:gap-6 bg-gray-900/50 border border-gray-800 p-4"
            >
              {/* Image */}
              <div className="relative w-24 h-24 md:w-32 md:h-32 flex-shrink-0 bg-gray-800 overflow-hidden">
                {item.product.images?.[0] ? (
                  <Image
                    src={item.product.images[0]}
                    alt={locale === 'ar' ? item.product.name_ar : item.product.name_en}
                    fill
                    className="object-cover"
                    sizes="128px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600">
                    <span className="text-2xl font-bold">K</span>
                  </div>
                )}
              </div>
              
              {/* Info */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-white text-sm md:text-base font-medium tracking-wider uppercase">
                    {locale === 'ar' ? item.product.name_ar : item.product.name_en}
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">
                    {item.product.price.toLocaleString()} {t('products.egp', locale)}
                  </p>
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  {/* Quantity */}
                  <div className="flex items-center border border-gray-700">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="px-3 py-2 text-gray-400 hover:text-white transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="px-4 py-2 text-white text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="px-3 py-2 text-gray-400 hover:text-white transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  
                  {/* Subtotal & Remove */}
                  <div className="flex items-center gap-4">
                    <span className="text-white font-medium">
                      {(item.product.price * item.quantity).toLocaleString()} {t('products.egp', locale)}
                    </span>
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="text-gray-500 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="border-t border-gray-800 pt-8"
        >
          <div className="flex justify-between items-center mb-8">
            <span className="text-gray-400 text-lg">{t('cart.total', locale)}</span>
            <span className="text-3xl font-bold text-white">
              {total.toLocaleString()} {t('products.egp', locale)}
            </span>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href={`/${locale}/products`} className="flex-1">
              <Button variant="ghost" fullWidth>
                {t('cart.continue', locale)}
              </Button>
            </Link>
            <Link href={`/${locale}/checkout`} className="flex-1">
              <Button variant="primary" fullWidth size="lg">
                {t('cart.checkout', locale)}
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
