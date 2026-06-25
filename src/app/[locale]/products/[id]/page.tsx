'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Minus, Plus, ArrowLeft, Star } from 'lucide-react'
import { useLocaleStore } from '@/store/locale'
import { useCartStore } from '@/store/cart'
import { t } from '@/lib/i18n'
import { Product, Review } from '@/types'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/button'
import { Textarea } from '@/components/ui/input'

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { locale } = useLocaleStore()
  const addItem = useCartStore((state) => state.addItem)
  
  const [product, setProduct] = useState<Product | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  
  // Review form
  const [reviewName, setReviewName] = useState('')
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState('')
  const [submittingReview, setSubmittingReview] = useState(false)
  
  useEffect(() => {
    async function fetchProduct() {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('products')
        .select('*, categories(*)')
        .eq('id', params.id)
        .single()
      
      if (data) {
        setProduct(data)
      }
      setLoading(false)
    }
    
    async function fetchReviews() {
      const supabase = createClient()
      const { data } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', params.id)
        .eq('is_approved', true)
        .order('created_at', { ascending: false })
      
      if (data) setReviews(data)
    }
    
    fetchProduct()
    fetchReviews()
  }, [params.id])
  
  const handleAddToCart = () => {
    if (!product) return
    addItem(product, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }
  
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reviewName.trim()) return
    
    setSubmittingReview(true)
    const supabase = createClient()
    
    const { error } = await supabase.from('reviews').insert({
      product_id: params.id as string,
      user_id: crypto.randomUUID(), // anonymous
      user_name: reviewName,
      rating: reviewRating,
      comment: reviewComment || null,
      is_approved: false, // Admin approval required
    })
    
    if (!error) {
      setReviewName('')
      setReviewRating(5)
      setReviewComment('')
      alert(locale === 'ar' ? 'تم إرسال المراجعة وهي في انتظار الموافقة' : 'Review submitted and awaiting approval')
    }
    setSubmittingReview(false)
  }
  
  if (loading) {
    return (
      <div className="min-h-screen py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="animate-shimmer aspect-product" />
            <div className="space-y-4">
              <div className="animate-shimmer h-8 w-3/4" />
              <div className="animate-shimmer h-6 w-1/4" />
              <div className="animate-shimmer h-24 w-full" />
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">{t('common.error', locale)}</p>
      </div>
    )
  }
  
  const name = locale === 'ar' ? product.name_ar : product.name_en
  const description = locale === 'ar' ? product.description_ar : product.description_en
  
  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          <span className="text-sm tracking-wider uppercase">
            {locale === 'ar' ? 'رجوع' : 'Back'}
          </span>
        </motion.button>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Main Image */}
            <div className="relative aspect-product bg-gray-900 overflow-hidden mb-4">
              {product.images?.length > 0 ? (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedImage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="relative w-full h-full"
                  >
                    <Image
                      src={product.images[selectedImage]}
                      alt={name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                    />
                  </motion.div>
                </AnimatePresence>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-600">
                  <span className="text-6xl font-bold tracking-widest">K</span>
                </div>
              )}
              
              {/* Stock badge */}
              {product.stock_status === 'out_of_stock' && (
                <div className="absolute top-4 right-4 bg-red-600 text-white text-xs px-3 py-1 tracking-wider z-10">
                  {t('products.outOfStock', locale)}
                </div>
              )}
            </div>
            
            {/* Thumbnail Images */}
            {product.images?.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-20 h-20 flex-shrink-0 overflow-hidden ${
                      selectedImage === index ? 'ring-2 ring-white' : 'opacity-60 hover:opacity-100'
                    } transition-all`}
                  >
                    <Image
                      src={img}
                      alt={`${name} ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
          
          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Category */}
            {product.categories && (
              <span className="text-gray-500 text-xs tracking-widest uppercase">
                {locale === 'ar' ? product.categories.name_ar : product.categories.name_en}
              </span>
            )}
            
            {/* Name */}
            <h1 className="text-3xl md:text-4xl font-bold tracking-wider text-white mt-2 mb-4">
              {name}
            </h1>
            
            {/* Price */}
            <p className="text-2xl text-white mb-6">
              {product.price.toLocaleString()} {t('products.egp', locale)}
            </p>
            
            {/* Description */}
            {description && (
              <p className="text-gray-400 leading-relaxed mb-8">
                {description}
              </p>
            )}
            
            {/* Stock Status */}
            <div className="flex items-center gap-2 mb-6">
              <div className={`w-2 h-2 rounded-full ${
                product.stock_status === 'in_stock' ? 'bg-green-500' :
                product.stock_status === 'limited' ? 'bg-yellow-500' : 'bg-red-500'
              }`} />
              <span className="text-sm text-gray-400">
                {t(`products.${product.stock_status === 'in_stock' ? 'inStock' : product.stock_status === 'limited' ? 'limited' : 'outOfStock'}`, locale)}
              </span>
            </div>
            
            {/* Quantity & Add to Cart */}
            {product.stock_status !== 'out_of_stock' && (
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Quantity */}
                <div className="flex items-center border border-gray-700">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-3 text-gray-400 hover:text-white transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="px-6 py-3 text-white font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-3 text-gray-400 hover:text-white transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                
                {/* Add to Cart */}
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={handleAddToCart}
                  className="flex items-center justify-center gap-2"
                >
                  <ShoppingBag size={18} />
                  {added 
                    ? (locale === 'ar' ? 'تمت الإضافة ✓' : 'Added ✓')
                    : t('products.addToCart', locale)
                  }
                </Button>
              </div>
            )}
          </motion.div>
        </div>
        
        {/* Reviews Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-20 border-t border-gray-800 pt-12"
        >
          <h2 className="text-2xl font-bold tracking-wider text-white mb-8">
            {locale === 'ar' ? 'المراجعات' : 'Reviews'}
          </h2>
          
          {/* Existing Reviews */}
          {reviews.length > 0 ? (
            <div className="space-y-6 mb-12">
              {reviews.map((review) => (
                <div key={review.id} className="bg-gray-900/50 border border-gray-800 p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          {review.user_name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-white text-sm font-medium">{review.user_name}</span>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-600'}
                        />
                      ))}
                    </div>
                  </div>
                  {review.comment && (
                    <p className="text-gray-300 text-sm">{review.comment}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 mb-8">
              {locale === 'ar' ? 'مفيش مراجعات لسه. كن أول واحد يراجع!' : 'No reviews yet. Be the first to review!'}
            </p>
          )}
          
          {/* Add Review Form */}
          <form onSubmit={handleSubmitReview} className="max-w-lg space-y-4">
            <h3 className="text-lg font-medium text-white">
              {locale === 'ar' ? 'اكتب مراجعة' : 'Write a Review'}
            </h3>
            
            <input
              type="text"
              value={reviewName}
              onChange={(e) => setReviewName(e.target.value)}
              placeholder={locale === 'ar' ? 'اسمك' : 'Your name'}
              required
              className="w-full bg-gray-900 border border-gray-700 text-white px-4 py-3 focus:outline-none focus:border-white transition-colors placeholder:text-gray-500"
            />
            
            {/* Rating */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                {locale === 'ar' ? 'التقييم' : 'Rating'}
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className="p-1"
                  >
                    <Star
                      size={24}
                      className={star <= reviewRating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-600'}
                    />
                  </button>
                ))}
              </div>
            </div>
            
            <Textarea
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder={locale === 'ar' ? 'رأيك عن المنتج (اختياري)' : 'Your opinion about the product (optional)'}
              rows={4}
            />
            
            <Button type="submit" variant="outline" loading={submittingReview}>
              {locale === 'ar' ? 'إرسال المراجعة' : 'Submit Review'}
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
