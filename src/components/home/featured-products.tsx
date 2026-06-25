'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useLocaleStore } from '@/store/locale'
import { t } from '@/lib/i18n'
import { Product } from '@/types'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/button'

export default function FeaturedProducts() {
  const { locale } = useLocaleStore()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    async function fetchProducts() {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('products')
        .select('*, categories(*)')
        .eq('is_visible', true)
        .order('created_at', { ascending: false })
        .limit(4)
      
      if (data) {
        setProducts(data)
      }
      setLoading(false)
    }
    
    fetchProducts()
  }, [])
  
  return (
    <section className="py-20 md:py-32 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold tracking-wider text-white">
            {t('home.featured', locale)}
          </h2>
          <div className="w-16 h-[1px] bg-gray-600 mx-auto mt-6" />
        </motion.div>
        
        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-shimmer aspect-product rounded-lg" />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={`/${locale}/products/${product.id}`}>
                  <div className="group cursor-pointer">
                    {/* Image */}
                    <div className="relative aspect-product bg-gray-900 overflow-hidden mb-4">
                      {product.images?.[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={locale === 'ar' ? product.name_ar : product.name_en}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-600">
                          <span className="text-4xl font-bold tracking-widest">K</span>
                        </div>
                      )}
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300" />
                      
                      {/* Quick view */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="bg-white text-black px-4 py-2 text-xs tracking-widest uppercase">
                          {t('products.details', locale)}
                        </span>
                      </div>
                    </div>
                    
                    {/* Info */}
                    <div>
                      <h3 className="text-white text-sm tracking-wider uppercase mb-1">
                        {locale === 'ar' ? product.name_ar : product.name_en}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {product.price.toLocaleString()} {t('products.egp', locale)}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">
            {t('products.noProducts', locale)}
          </p>
        )}
        
        {/* View All Button */}
        {products.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link href={`/${locale}/products`}>
              <Button variant="ghost">
                {locale === 'ar' ? 'عرض الكل' : 'View All'}
              </Button>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  )
}
