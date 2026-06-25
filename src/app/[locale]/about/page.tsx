'use client'

import { motion } from 'framer-motion'
import { useLocaleStore } from '@/store/locale'
import { t } from '@/lib/i18n'

export default function AboutPage() {
  const { locale } = useLocaleStore()
  
  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-wider text-white mb-6">
            KAZUZA
          </h1>
          <div className="w-24 h-[1px] bg-white mx-auto mb-8" />
          <p className="text-gray-500 text-sm tracking-[0.3em] uppercase">
            {t('about.title', locale)}
          </p>
        </motion.div>
        
        {/* Story Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20"
        >
          {/* Image placeholder */}
          <div className="aspect-square bg-gray-900 relative overflow-hidden">
            <div className="absolute inset-0 grid-pattern opacity-30" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-gray-700 text-[8rem] font-bold tracking-widest">K</span>
            </div>
          </div>
          
          {/* Text */}
          <div className="flex flex-col justify-center">
            <h2 className="text-2xl md:text-3xl font-bold tracking-wider text-white mb-6">
              {locale === 'ar' ? 'قصتنا' : 'Our Story'}
            </h2>
            <p className="text-gray-300 leading-relaxed text-lg mb-6">
              {t('about.story', locale)}
            </p>
            <p className="text-gray-400 leading-relaxed">
              {t('about.mission', locale)}
            </p>
          </div>
        </motion.div>
        
        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
        >
          {[
            {
              title: locale === 'ar' ? 'أصالة' : 'Authenticity',
              desc: locale === 'ar' 
                ? 'مستوحاة من الشوارع الحقيقية، مش من موضات مؤقتة'
                : 'Inspired by real streets, not passing trends'
            },
            {
              title: locale === 'ar' ? 'جودة' : 'Quality',
              desc: locale === 'ar'
                ? 'خامات ممتازة وتفاصيل دقيقة في كل قطعة'
                : 'Premium materials and attention to every detail'
            },
            {
              title: locale === 'ar' ? 'ثقافة' : 'Culture',
              desc: locale === 'ar'
                ? 'بنحتفل بالثقافة المصرية بطريقة عصرية'
                : 'Celebrating Egyptian culture in a modern way'
            },
          ].map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="text-center p-8 border border-gray-800"
            >
              <h3 className="text-xl font-bold tracking-wider text-white mb-4">
                {value.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {value.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Cairo Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center bg-gray-900/30 border border-gray-800 p-12 md:p-20"
        >
          <h2 className="text-4xl md:text-6xl font-bold tracking-wider text-white mb-4">
            CAIRO
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            {locale === 'ar'
              ? 'من شوارع القاهرة للعالم — KAZUZA بتمثل روح الشارع المصري.'
              : 'From the streets of Cairo to the world — KAZUZA embodies the spirit of Egyptian streets.'}
          </p>
        </motion.div>
      </div>
    </div>
  )
}
