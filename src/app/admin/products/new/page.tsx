'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Upload, X, ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Category } from '@/types'
import Button from '@/components/ui/button'
import { Input, Textarea, Select } from '@/components/ui/input'

export default function NewProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  
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
    async function fetchCategories() {
      const supabase = createClient()
      const { data } = await supabase.from('categories').select('*').order('name_en')
      if (data) setCategories(data)
    }
    fetchCategories()
  }, [])
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length + imageFiles.length > 5) {
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
  
  const removeImage = (index: number) => {
    setImageFiles(files => files.filter((_, i) => i !== index))
    setImagePreviews(previews => previews.filter((_, i) => i !== index))
  }
  
  const uploadImages = async (): Promise<string[]> => {
    const supabase = createClient()
    const urls: string[] = []
    
    for (const file of imageFiles) {
      const fileName = `${Date.now()}-${file.name}`
      const { data, error } = await supabase.storage
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
  
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + '-' + Date.now().toString(36)
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    const supabase = createClient()
    
    // Upload images
    let imageUrls: string[] = []
    if (imageFiles.length > 0) {
      imageUrls = await uploadImages()
    }
    
    const { error } = await supabase.from('products').insert({
      name_en: form.name_en,
      name_ar: form.name_ar,
      description_en: form.description_en || null,
      description_ar: form.description_ar || null,
      price: parseFloat(form.price),
      images: imageUrls,
      category_id: form.category_id || null,
      stock_status: form.stock_status as any,
      is_visible: form.is_visible,
      slug: generateSlug(form.name_en),
    })
    
    if (!error) {
      router.push('/admin/products')
    } else {
      alert('Error creating product: ' + error.message)
    }
    
    setLoading(false)
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
        <h1 className="text-2xl font-bold tracking-wider text-white">Add Product</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Names */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Name (English)"
            value={form.name_en}
            onChange={(e) => setForm({ ...form, name_en: e.target.value })}
            placeholder="Product name in English"
            required
          />
          <Input
            label="الاسم (عربي)"
            value={form.name_ar}
            onChange={(e) => setForm({ ...form, name_ar: e.target.value })}
            placeholder="اسم المنتج بالعربي"
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
            placeholder="Product description"
            rows={4}
          />
          <Textarea
            label="الوصف (عربي)"
            value={form.description_ar}
            onChange={(e) => setForm({ ...form, description_ar: e.target.value })}
            placeholder="وصف المنتج"
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
            placeholder="0"
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
        
        {/* Image Upload */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-300">Product Images</label>
          
          {/* Previews */}
          {imagePreviews.length > 0 && (
            <div className="flex gap-3 flex-wrap">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative w-24 h-24 bg-gray-800 overflow-hidden">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-black/70 p-1 text-white hover:text-red-500"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          {/* Upload button */}
          <label className="flex items-center justify-center gap-2 w-full border-2 border-dashed border-gray-700 p-6 cursor-pointer hover:border-gray-500 transition-colors">
            <Upload size={20} className="text-gray-500" />
            <span className="text-gray-500 text-sm">Upload images (max 5)</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>
        
        {/* Submit */}
        <div className="flex gap-4 pt-4">
          <Button type="submit" variant="primary" loading={loading}>
            Save Product
          </Button>
          <Button type="button" variant="ghost" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
