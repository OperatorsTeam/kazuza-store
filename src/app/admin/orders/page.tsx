'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Order } from '@/types'

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
  
  useEffect(() => {
    fetchOrders()
  }, [])
  
  const fetchOrders = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (data) setOrders(data)
    setLoading(false)
  }
  
  const updateOrderStatus = async (orderId: string, status: string) => {
    const supabase = createClient()
    await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
    
    fetchOrders()
  }
  
  const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'bg-yellow-900/50 text-yellow-500' },
    { value: 'confirmed', label: 'Confirmed', color: 'bg-blue-900/50 text-blue-500' },
    { value: 'shipped', label: 'Shipped', color: 'bg-purple-900/50 text-purple-500' },
    { value: 'delivered', label: 'Delivered', color: 'bg-green-900/50 text-green-500' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-red-900/50 text-red-500' },
  ]
  
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-wider text-white mb-8">Orders</h1>
      
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-shimmer h-24 rounded" />
          ))}
        </div>
      ) : orders.length > 0 ? (
        <div className="space-y-3">
          {orders.map((order) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900/50 border border-gray-800"
            >
              {/* Order Header */}
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-800/30 transition-colors"
                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
              >
                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-white text-sm font-medium">{order.customer_name}</p>
                    <p className="text-gray-500 text-xs">{order.customer_phone}</p>
                  </div>
                  <span className="text-white font-bold">
                    {order.total?.toLocaleString()} EGP
                  </span>
                  <span className="text-gray-400 text-xs capitalize">
                    {order.payment_method?.replace('_', ' ')}
                  </span>
                </div>
                
                <div className="flex items-center gap-4">
                  <select
                    value={order.status}
                    onChange={(e) => {
                      e.stopPropagation()
                      updateOrderStatus(order.id, e.target.value)
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className={`text-xs px-3 py-1 bg-transparent border border-gray-700 cursor-pointer ${
                      statusOptions.find(s => s.value === order.status)?.color || ''
                    }`}
                  >
                    {statusOptions.map(opt => (
                      <option key={opt.value} value={opt.value} className="bg-gray-900">
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  
                  <span className="text-gray-500 text-xs">
                    {new Date(order.created_at).toLocaleDateString('en-GB')}
                  </span>
                  
                  {expandedOrder === order.id ? <ChevronUp size={16} className="text-gray-500" /> : <ChevronDown size={16} className="text-gray-500" />}
                </div>
              </div>
              
              {/* Order Details */}
              {expandedOrder === order.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="border-t border-gray-800 p-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-gray-500 text-xs mb-1">Address</p>
                      <p className="text-white text-sm">{order.customer_address}, {order.customer_city}</p>
                    </div>
                    {order.customer_email && (
                      <div>
                        <p className="text-gray-500 text-xs mb-1">Email</p>
                        <p className="text-white text-sm">{order.customer_email}</p>
                      </div>
                    )}
                    {order.notes && (
                      <div>
                        <p className="text-gray-500 text-xs mb-1">Notes</p>
                        <p className="text-white text-sm">{order.notes}</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Items */}
                  <div>
                    <p className="text-gray-500 text-xs mb-2">Items</p>
                    <div className="space-y-2">
                      {(order.items as any[])?.map((item: any, index: number) => (
                        <div key={index} className="flex items-center justify-between bg-gray-800/50 p-3">
                          <div>
                            <p className="text-white text-sm">{item.name_en}</p>
                            <p className="text-gray-500 text-xs">{item.name_ar}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-gray-300 text-sm">x{item.quantity}</p>
                            <p className="text-gray-400 text-xs">{item.price?.toLocaleString()} EGP</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No orders yet.</p>
      )}
    </div>
  )
}
