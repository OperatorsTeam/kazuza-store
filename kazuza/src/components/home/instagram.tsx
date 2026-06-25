'use client'

import { motion } from 'framer-motion'
import { useLocaleStore } from '@/store/locale'
import { t } from '@/lib/i18n'
import { Camera } from 'lucide-react'

export default function InstagramSection() {
  const { locale } = useLocaleStore()
  
  return (
    <section className="py-20 md:py-32 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <a
            href="https://instagram.com/kazuza"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 group"
          >
            <Camera className="text-gray-400 group-hover:text-white transition-colors" size={24} />
            <h2 className="text-2xl md:text-4xl font-bold tracking-wider text-white">
              {t('home.instagram', locale)}
            </h2>
          </a>
          <div className="w-16 h-[1px] bg-gray-600 mx-auto mt-6" />
        </motion.div>
        
        {/* Placeholder Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
          {[...Array(4)].map((_, index) => (
            <motion.a
              key={index}
              href="https://instagram.com/kazuza"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative aspect-square bg-gray-900 overflow-hidden group cursor-pointer"
            >
              {/* Placeholder pattern */}
              <div className="absolute inset-0 grid-pattern opacity-30" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-gray-700 text-6xl font-bold tracking-widest">K</span>
              </div>
              
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Camera className="text-white" size={32} />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}
