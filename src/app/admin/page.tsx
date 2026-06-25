'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Package, ShoppingBag, DollarSign, Users } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    revenue: 0,
    reviews: 0,
  })
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    async function fetchStats() {
      const supabase = createClient()
      
      const [productsRes, ordersRes, reviewsRes] = await Promise.all([
        supabase.from('products').select('id', { count: 'exact', head: true }),
        supabase.from('orders').select('*').order('created_at', { ascending: false }),
        supabase.from('reviews').select('id', { count: 'exact', head: true }),
      ])
      
      const orders = ordersRes.data || []
      const totalRevenue = orders.reduce((sum: number, order: any) => sum + (order.total || 0), 0)
      
      setStats({
        products: productsRes.count || 0,
        orders: orders.length,
        revenue: totalRevenue,
        reviews: reviewsRes.count || 0,
      })
      
      setRecentOrders(orders.slice(0, 5))
      setLoading(false)
    }
    
    fetchStats()
  }, [])
  
  const statCards = [
    { label: 'Products', value: stats.products, icon: Package, color: 'text-blue-500' },
    { label: 'Orders', value: stats.orders, icon: ShoppingBag, color: 'text-green-500' },
    { label: 'Revenue', value: `${stats.revenue.toLocaleString()} EGP`, icon: DollarSign, color: 'text-yellow-500' },
    { label: 'Reviews', value: stats.reviews, icon: Users, color: 'text-purple-500' },
  ]
  
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-wider text-white mb-8">Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-900/50 border border-gray-800 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-500 text-sm tracking-wider uppercase">
                  {stat.label}
                </span>
                <Icon size={20} className={stat.color} />
              </div>
              <p className="text-3xl font-bold text-white">
                {loading ? '...' : stat.value}
              </p>
            </motion.div>
          )
        })}
      </div>
      
      {/* Recent Orders */}
      <h2 className="text-lg font-medium tracking-wider text-white mb-4">Recent Orders</h2>
      
      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-shimmer h-16 rounded" />
          ))}
        </div>
      ) : recentOrders.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left py-3 px-4 text-xs text-gray-500 tracking-wider uppercase">Customer</th>
                <th className="text-left py-3 px-4 text-xs text-gray-500 tracking-wider uppercase">Total</th>
                <th className="text-left py-3 px-4 text-xs text-gray-500 tracking-wider uppercase">Payment</th>
                <th className="text-left py-3 px-4 text-xs text-gray-500 tracking-wider uppercase">Status</th>
                <th className="text-left py-3 px-4 text-xs text-gray-500 tracking-wider uppercase">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order: any) => (
                <tr key={order.id} className="border-b border-gray-800/50 hover:bg-gray-900/30">
                  <td className="py-3 px-4 text-white text-sm">{order.customer_name}</td>
                  <td className="py-3 px-4 text-gray-300 text-sm">{order.total?.toLocaleString()} EGP</td>
                  <td className="py-3 px-4 text-gray-400 text-sm capitalize">{order.payment_method?.replace('_', ' ')}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-1 uppercase tracking-wider ${
                      order.status === 'pending' ? 'bg-yellow-900/50 text-yellow-500' :
                      order.status === 'confirmed' ? 'bg-blue-900/50 text-blue-500' :
                      order.status === 'shipped' ? 'bg-purple-900/50 text-purple-500' :
                      order.status === 'delivered' ? 'bg-green-900/50 text-green-500' :
                      'bg-red-900/50 text-red-500'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-500 text-sm">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500">No orders yet.</p>
      )}
    </div>
  )
}