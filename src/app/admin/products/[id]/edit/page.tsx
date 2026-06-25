'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Upload, X, ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Product, Category } from '@/types'
import Button from '@/components/ui/button'
import { Input, Textarea } from '@/components/ui/input'
import Loading from '@/components/ui/loading'

export default function EditProductPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [existingImages, setExistingImages] = useState<string[]>([])
  
  const [form, setForm] = useState({
    name_en: '',
    name_ar: '',
    description_en: '',
    description_ar: '',
    price: '',
    category_id: '',
    stock_status: 'in_stock',
    is_visible: true,
  })
  
  useEffect(() => {
    async function fetchData() {
      const supabase = createClient()
      
      const [productRes, categoriesRes] = await Promise.all([
        supabase.from('products').select('*').eq('id', params.id).single(),
        supabase.from('categories').select('*').order('name_en'),
      ])
      
      if (productRes.data) {
        const p = productRes.data
        setProduct(p)
        setForm({
          name_en: p.name_en,
          name_ar: p.name_ar,
          description_en: p.description_en || '',
          description_ar: p.description_ar || '',
          price: p.price.toString(),
          category_id: p.category_id || '',
          stock_status: p.stock_status,
          is_visible: p.is_visible,
        })
        setExistingImages(p.images || [])
      }
      
      if (categoriesRes.data) setCategories(categoriesRes.data)
      setLoading(false)
    }
    
    fetchData()
  }, [params.id])
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const totalImages = existingImages.length + imageFiles.length + files.length
    if (totalImages > 5) {
      alert('Maximum 5 images allowed')
      return
    }
    
    setImageFiles([...imageFiles, ...files])
    
    files.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })
  }
  
  const removeExistingImage = (index: number) => {
    setExistingImages(imgs => imgs.filter((_, i) => i !== index))
  }
  
  const removeNewImage = (index: number) => {
    setImageFiles(files => files.filter((_, i) => i !== index))
    setImagePreviews(previews => previews.filter((_, i) => i !== index))
  }
  
  const uploadImages = async (): Promise<string[]> => {
    const supabase = createClient()
    const urls: string[] = []
    
    for (const file of imageFiles) {
      const fileName = `${Date.now()}-${file.name}`
      const { data } = await supabase.storage
        .from('products')
        .upload(fileName, file)
      
      if (data) {
        const { data: { publicUrl } } = supabase.storage
          .from('products')
          .getPublicUrl(fileName)
        urls.push(publicUrl)
      }
    }
    
    return urls
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    const supabase = createClient()
    
    // Upload new images
    let newImageUrls: string[] = []
    if (imageFiles.length > 0) {
      newImageUrls = await uploadImages()
    }
    
    const allImages = [...existingImages, ...newImageUrls]
    
    const { error } = await supabase
      .from('products')
      .update({
        name_en: form.name_en,
        name_ar: form.name_ar,
        description_en: form.description_en || null,
        description_ar: form.description_ar || null,
        price: parseFloat(form.price),
        images: allImages,
        category_id: form.category_id || null,
        stock_status: form.stock_status as any,
        is_visible: form.is_visible,
      })
      .eq('id', params.id)
    
    if (!error) {
      router.push('/admin/products')
    } else {
      alert('Error updating product: ' + error.message)
    }
    
    setSaving(false)
  }
  
  if (loading) return <Loading />
  
  if (!product) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Product not found.</p>
      </div>
    )
  }
  
  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.back()}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold tracking-wider text-white">Edit Product</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Names */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Name (English)"
            value={form.name_en}
            onChange={(e) => setForm({ ...form, name_en: e.target.value })}
            required
          />
          <Input
            label="الاسم (عربي)"
            value={form.name_ar}
            onChange={(e) => setForm({ ...form, name_ar: e.target.value })}
            dir="rtl"
            required
          />
        </div>
        
        {/* Descriptions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Textarea
            label="Description (English)"
            value={form.description_en}
            onChange={(e) => setForm({ ...form, description_en: e.target.value })}
            rows={4}
          />
          <Textarea
            label="الوصف (عربي)"
            value={form.description_ar}
            onChange={(e) => setForm({ ...form, description_ar: e.target.value })}
            dir="rtl"
            rows={4}
          />
        </div>
        
        {/* Price & Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Price (EGP)"
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
            min="0"
            step="0.01"
          />
          
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-300">Category</label>
            <select
              value={form.category_id}
              onChange={(e) => setForm({ ...form, category_id: e.target.value })}
              className="w-full bg-gray-900 border border-gray-700 text-white px-4 py-3 focus:outline-none focus:border-white transition-colors"
            >
              <option value="">No Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name_en} / {cat.name_ar}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Stock & Visibility */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-300">Stock Status</label>
            <select
              value={form.stock_status}
              onChange={(e) => setForm({ ...form, stock_status: e.target.value })}
              className="w-full bg-gray-900 border border-gray-700 text-white px-4 py-3 focus:outline-none focus:border-white transition-colors"
            >
              <option value="in_stock">In Stock</option>
              <option value="limited">Limited</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_visible}
                onChange={(e) => setForm({ ...form, is_visible: e.target.checked })}
                className="w-5 h-5 accent-white"
              />
              <span className="text-gray-300 text-sm">Visible on store</span>
            </label>
          </div>
        </div>
        
        {/* Images */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-300">Product Images</label>
          
          <div className="flex gap-3 flex-wrap">
            {/* Existing Images */}
            {existingImages.map((url, index) => (
              <div key={`existing-${index}`} className="relative w-24 h-24 bg-gray-800 overflow-hidden">
                <img src={url} alt={`Image ${index + 1}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeExistingImage(index)}
                  className="absolute top-1 right-1 bg-black/70 p-1 text-white hover:text-red-500"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            
            {/* New Images */}
            {imagePreviews.map((preview, index) => (
              <div key={`new-${index}`} className="relative w-24 h-24 bg-gray-800 overflow-hidden">
                <img src={preview} alt={`New ${index + 1}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeNewImage(index)}
                  className="absolute top-1 right-1 bg-black/70 p-1 text-white hover:text-red-500"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
          
          {existingImages.length + imageFiles.length < 5 && (
            <label className="flex items-center justify-center gap-2 w-full border-2 border-dashed border-gray-700 p-6 cursor-pointer hover:border-gray-500 transition-colors">
              <Upload size={20} className="text-gray-500" />
              <span className="text-gray-500 text-sm">Add more images</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          )}
        </div>
        
        {/* Submit */}
        <div className="flex gap-4 pt-4">
          <Button type="submit" variant="primary" loading={saving}>
            Update Product
          </Button>
          <Button type="button" variant="ghost" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
