'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useLocaleStore } from '@/store/locale'
import { t } from '@/lib/i18n'
import { Product, Category } from '@/types'
import { createClient } from '@/lib/supabase/client'

export default function ProductsPage() {
  const { locale } = useLocaleStore()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    async function fetchData() {
      const supabase = createClient()
      
      const [productsRes, categoriesRes] = await Promise.all([
        supabase
          .from('products')
          .select('*, categories(*)')
          .eq('is_visible', true)
          .order('created_at', { ascending: false }),
        supabase
          .from('categories')
          .select('*')
          .order('name_en'),
      ])
      
      if (productsRes.data) setProducts(productsRes.data)
      if (categoriesRes.data) setCategories(categoriesRes.data)
      setLoading(false)
    }
    
    fetchData()
  }, [])
  
  const filteredProducts = selectedCategory
    ? products.filter(p => p.category_id === selectedCategory)
    : products
  
  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold tracking-wider text-white">
            {t('products.title', locale)}
          </h1>
          <div className="w-16 h-[1px] bg-gray-600 mx-auto mt-6" />
        </motion.div>
        
        {/* Category Filters */}
        {categories.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 text-xs tracking-widest uppercase transition-all duration-300 ${
                selectedCategory === null
                  ? 'bg-white text-black'
                  : 'bg-gray-900 text-gray-400 hover:text-white'
              }`}
            >
              {locale === 'ar' ? 'الكل' : 'All'}
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 text-xs tracking-widest uppercase transition-all duration-300 ${
                  selectedCategory === cat.id
                    ? 'bg-white text-black'
                    : 'bg-gray-900 text-gray-400 hover:text-white'
                }`}
              >
                {locale === 'ar' ? cat.name_ar : cat.name_en}
              </button>
            ))}
          </motion.div>
        )}
        
        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-shimmer aspect-product rounded-lg" />
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
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
                      
                      {/* Stock badge */}
                      {product.stock_status === 'out_of_stock' && (
                        <div className="absolute top-4 right-4 bg-red-600 text-white text-xs px-3 py-1 tracking-wider">
                          {t('products.outOfStock', locale)}
                        </div>
                      )}
                      {product.stock_status === 'limited' && (
                        <div className="absolute top-4 right-4 bg-yellow-600 text-white text-xs px-3 py-1 tracking-wider">
                          {t('products.limited', locale)}
                        </div>
                      )}
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300" />
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
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">
              {t('products.noProducts', locale)}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
