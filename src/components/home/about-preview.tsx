'use client'

import { motion } from 'framer-motion'
import { useLocaleStore } from '@/store/locale'
import { t } from '@/lib/i18n'

export default function AboutPreview() {
  const { locale } = useLocaleStore()
  
  return (
    <section className="py-20 md:py-32 px-4 relative">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900/30 to-black" />
      
      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          {/* Section Title */}
          <h2 className="text-3xl md:text-5xl font-bold tracking-wider text-white mb-8">
            {t('home.about.title', locale)}
          </h2>
          
          {/* Decorative line */}
          <div className="w-16 h-[1px] bg-gray-600 mx-auto mb-10" />
          
          {/* Text */}
          <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
            {t('home.about.text', locale)}
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16">
            {[
              { value: '2024', label: locale === 'ar' ? 'سنة التأسيس' : 'Founded' },
              { value: 'Cairo', label: locale === 'ar' ? 'القاهرة، مصر' : 'Cairo, Egypt' },
              { value: '∞', label: locale === 'ar' ? 'طموح بلا حدود' : 'Limitless Ambition' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
              >
                <div className="text-2xl md:text-4xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-500 text-xs md:text-sm tracking-wider uppercase">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
