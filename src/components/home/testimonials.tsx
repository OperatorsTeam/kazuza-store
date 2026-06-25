'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useLocaleStore } from '@/store/locale'
import { t } from '@/lib/i18n'
import { Review } from '@/types'
import { createClient } from '@/lib/supabase/client'
import { Star } from 'lucide-react'

export default function Testimonials() {
  const { locale } = useLocaleStore()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    async function fetchReviews() {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('is_approved', true)
        .order('created_at', { ascending: false })
        .limit(6)
      
      if (data) {
        setReviews(data)
      }
      setLoading(false)
    }
    
    fetchReviews()
  }, [])
  
  if (loading) {
    return (
      <section className="py-20 md:py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="animate-shimmer h-8 w-48 mx-auto rounded" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-shimmer h-48 rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    )
  }
  
  if (reviews.length === 0) return null
  
  return (
    <section className="py-20 md:py-32 px-4 bg-gray-900/30">
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
            {t('home.testimonials', locale)}
          </h2>
          <div className="w-16 h-[1px] bg-gray-600 mx-auto mt-6" />
        </motion.div>
        
        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gray-900/50 border border-gray-800 p-6"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-600'}
                  />
                ))}
              </div>
              
              {/* Comment */}
              {review.comment && (
                <p className="text-gray-300 text-sm leading-relaxed mb-4">
                  “{review.comment}”
                </p>
              )}
              
              {/* User */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {review.user_name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-gray-400 text-sm">
                  {review.user_name}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
