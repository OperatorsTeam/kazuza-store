'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Product } from '@/types'
import Button from '@/components/ui/button'

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    fetchProducts()
  }, [])
  
  const fetchProducts = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('products')
      .select('*, categories(*)')
      .order('created_at', { ascending: false })
    
    if (data) setProducts(data)
    setLoading(false)
  }
  
  const toggleVisibility = async (id: string, currentVisibility: boolean) => {
    const supabase = createClient()
    await supabase
      .from('products')
      .update({ is_visible: !currentVisibility })
      .eq('id', id)
    
    fetchProducts()
  }
  
  const deleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    
    const supabase = createClient()
    await supabase.from('products').delete().eq('id', id)
    fetchProducts()
  }
  
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold tracking-wider text-white">Products</h1>
        <Link href="/admin/products/new">
          <Button variant="primary" size="sm">
            <Plus size={16} className="mr-2" />
            Add Product
          </Button>
        </Link>
      </div>
      
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-shimmer h-20 rounded" />
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left py-3 px-4 text-xs text-gray-500 tracking-wider uppercase">Image</th>
                <th className="text-left py-3 px-4 text-xs text-gray-500 tracking-wider uppercase">Name</th>
                <th className="text-left py-3 px-4 text-xs text-gray-500 tracking-wider uppercase">Price</th>
                <th className="text-left py-3 px-4 text-xs text-gray-500 tracking-wider uppercase">Category</th>
                <th className="text-left py-3 px-4 text-xs text-gray-500 tracking-wider uppercase">Stock</th>
                <th className="text-left py-3 px-4 text-xs text-gray-500 tracking-wider uppercase">Status</th>
                <th className="text-right py-3 px-4 text-xs text-gray-500 tracking-wider uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-gray-800/50 hover:bg-gray-900/30">
                  <td className="py-3 px-4">
                    <div className="w-12 h-12 bg-gray-800 overflow-hidden">
                      {product.images?.[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name_en}
                          width={48}
                          height={48}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-600">
                          <span className="text-xs">K</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-white text-sm">{product.name_en}</p>
                    <p className="text-gray-500 text-xs">{product.name_ar}</p>
                  </td>
                  <td className="py-3 px-4 text-gray-300 text-sm">
                    {product.price.toLocaleString()} EGP
                  </td>
                  <td className="py-3 px-4 text-gray-400 text-sm">
                    {product.categories?.name_en || '—'}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-1 uppercase tracking-wider ${
                      product.stock_status === 'in_stock' ? 'bg-green-900/50 text-green-500' :
                      product.stock_status === 'limited' ? 'bg-yellow-900/50 text-yellow-500' :
                      'bg-red-900/50 text-red-500'
                    }`}>
                      {product.stock_status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => toggleVisibility(product.id, product.is_visible)}
                      className={`p-2 ${product.is_visible ? 'text-green-500' : 'text-gray-600'}`}
                    >
                      {product.is_visible ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="p-2 text-gray-400 hover:text-white transition-colors"
                      >
                        <Edit size={16} />
                      </Link>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-500 mb-4">No products yet.</p>
          <Link href="/admin/products/new">
            <Button variant="outline">Add Your First Product</Button>
          </Link>
        </div>
      )}
    </div>
  )
}
