'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useLocaleStore } from '@/store/locale'
import { useCartStore } from '@/store/cart'
import { t } from '@/lib/i18n'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/button'
import { Input, Textarea } from '@/components/ui/input'
import { CheckCircle, CreditCard, Banknote, Smartphone } from 'lucide-react'

type PaymentMethod = 'vodafone_cash' | 'instapay' | 'cod'

export default function CheckoutPage() {
  const router = useRouter()
  const { locale } = useLocaleStore()
  const { items, getTotal, clearCart } = useCartStore()
  const total = getTotal()
  
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod')
  
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    notes: '',
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!form.name.trim()) newErrors.name = locale === 'ar' ? 'الاسم مطلوب' : 'Name is required'
    if (!form.phone.trim()) newErrors.phone = locale === 'ar' ? 'رقم الموبايل مطلوب' : 'Phone is required'
    if (!form.address.trim()) newErrors.address = locale === 'ar' ? 'العنوان مطلوب' : 'Address is required'
    if (!form.city.trim()) newErrors.city = locale === 'ar' ? 'المدينة مطلوبة' : 'City is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    if (items.length === 0) return
    
    setLoading(true)
    
    const supabase = createClient()
    
    const orderItems = items.map(item => ({
      product_id: item.product.id,
      name_en: item.product.name_en,
      name_ar: item.product.name_ar,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.images?.[0] || null,
    }))
    
    const { data, error } = await supabase.from('orders').insert({
      customer_name: form.name,
      customer_phone: form.phone,
      customer_email: form.email || null,
      customer_address: form.address,
      customer_city: form.city,
      items: orderItems,
      total,
      payment_method: paymentMethod,
      status: 'pending',
      notes: form.notes || null,
    }).select()
    
    if (!error) {
      clearCart()
      setSuccess(true)
    }
    
    setLoading(false)
  }
  
  if (items.length === 0 && !success) {
    router.push(`/${locale}/cart`)
    return null
  }
  
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <CheckCircle size={64} className="text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold tracking-wider text-white mb-4">
            {t('checkout.success', locale)}
          </h1>
          <p className="text-gray-400 mb-8">
            {t('checkout.successMsg', locale)}
          </p>
          
          {/* Payment Instructions */}
          {paymentMethod !== 'cod' && (
            <div className="bg-gray-900 border border-gray-800 p-6 mb-8 text-left">
              <h3 className="text-white font-medium mb-3">
                {locale === 'ar' ? 'تعليمات الدفع:' : 'Payment Instructions:'}
              </h3>
              <p className="text-gray-300 text-sm">
                {paymentMethod === 'vodafone_cash' 
                  ? t('checkout.vodafoneInstructions', locale)
                  : t('checkout.instapayInstructions', locale)
                }
              </p>
            </div>
          )}
          
          <Button variant="outline" onClick={() => router.push(`/${locale}`)}>
            {locale === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
          </Button>
        </motion.div>
      </div>
    )
  }
  
  const paymentOptions = [
    { 
      id: 'cod' as PaymentMethod, 
      label: t('checkout.cod', locale), 
      icon: Banknote,
      description: t('checkout.codInstructions', locale)
    },
    { 
      id: 'vodafone_cash' as PaymentMethod, 
      label: t('checkout.vodafone', locale), 
      icon: Smartphone,
      description: t('checkout.vodafoneInstructions', locale)
    },
    { 
      id: 'instapay' as PaymentMethod, 
      label: t('checkout.instapay', locale), 
      icon: CreditCard,
      description: t('checkout.instapayInstructions', locale)
    },
  ]
  
  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-3xl md:text-5xl font-bold tracking-wider text-white">
            {t('checkout.title', locale)}
          </h1>
        </motion.div>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Customer Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <h2 className="text-lg font-medium text-white tracking-wider">
              {locale === 'ar' ? 'بيانات العميل' : 'Customer Information'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label={t('checkout.name', locale)}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                error={errors.name}
                placeholder={locale === 'ar' ? 'اسمك الكامل' : 'Your full name'}
                required
              />
              
              <Input
                label={t('checkout.phone', locale)}
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                error={errors.phone}
                placeholder="01XXXXXXXXX"
                required
              />
            </div>
            
            <Input
              label={t('checkout.email', locale)}
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="email@example.com"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label={t('checkout.address', locale)}
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                error={errors.address}
                placeholder={locale === 'ar' ? 'العنوان بالتفصيل' : 'Detailed address'}
                required
              />
              
              <Input
                label={t('checkout.city', locale)}
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                error={errors.city}
                placeholder={locale === 'ar' ? 'المدينة' : 'City'}
                required
              />
            </div>
            
            <Textarea
              label={t('checkout.notes', locale)}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder={locale === 'ar' ? 'أي ملاحظات للطلب...' : 'Any order notes...'}
              rows={3}
            />
          </motion.div>
          
          {/* Payment Method */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <h2 className="text-lg font-medium text-white tracking-wider">
              {t('checkout.payment', locale)}
            </h2>
            
            <div className="space-y-3">
              {paymentOptions.map((option) => {
                const Icon = option.icon
                return (
                  <label
                    key={option.id}
                    className={`flex items-start gap-4 p-4 border cursor-pointer transition-all duration-300 ${
                      paymentMethod === option.id
                        ? 'border-white bg-white/5'
                        : 'border-gray-800 hover:border-gray-600'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={option.id}
                      checked={paymentMethod === option.id}
                      onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                      className="sr-only"
                    />
                    <Icon size={24} className={paymentMethod === option.id ? 'text-white' : 'text-gray-500'} />
                    <div>
                      <span className={`text-sm font-medium ${
                        paymentMethod === option.id ? 'text-white' : 'text-gray-400'
                      }`}>
                        {option.label}
                      </span>
                      {paymentMethod === option.id && (
                        <p className="text-gray-400 text-xs mt-1">
                          {option.description}
                        </p>
                      )}
                    </div>
                  </label>
                )
              })}
            </div>
          </motion.div>
          
          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="border-t border-gray-800 pt-8"
          >
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-400 text-lg">{t('cart.total', locale)}</span>
              <span className="text-3xl font-bold text-white">
                {total.toLocaleString()} {t('products.egp', locale)}
              </span>
            </div>
            
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
            >
              {t('checkout.placeOrder', locale)}
            </Button>
          </motion.div>
        </form>
      </div>
    </div>
  )
}
