'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Plus, 
  LogOut,
  Menu,
  X
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import Loading from '@/components/ui/loading'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  // Login form state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  
  useEffect(() => {
    const supabase = createClient()
    
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setLoading(false)
    })
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
      }
    )
    
    return () => subscription.unsubscribe()
  }, [])
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginLoading(true)
    setLoginError('')
    
    const supabase = createClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) {
      setLoginError(error.message)
    } else {
      const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',').map(e => e.trim().toLowerCase()) || 
                          ['admin@kazuza.com']
      if (!adminEmails.includes(data.user.email?.toLowerCase() || '')) {
        await supabase.auth.signOut()
        setLoginError('Access denied. Admin only.')
      }
    }
    
    setLoginLoading(false)
  }
  
  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin')
  }
  
  if (loading) {
    return <Loading />
  }
  
  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <Link href="/">
              <h1 className="text-3xl font-bold tracking-[0.3em] text-white">KAZUZA</h1>
            </Link>
            <p className="text-gray-500 text-sm mt-2 tracking-wider uppercase">Admin</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 text-white px-4 py-3 focus:outline-none focus:border-white transition-colors"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 text-white px-4 py-3 focus:outline-none focus:border-white transition-colors"
                required
              />
            </div>
            
            {loginError && (
              <p className="text-red-500 text-sm">{loginError}</p>
            )}
            
            <button
              type="submit"
              disabled={loginLoading}
              className="w-full bg-white text-black py-3 font-medium tracking-wider uppercase hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              {loginLoading ? 'Loading...' : 'Sign In'}
            </button>
          </form>
        </motion.div>
      </div>
    )
  }
  
  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/products', label: 'Products', icon: Package },
    { href: '/admin/products/new', label: 'Add Product', icon: Plus },
    { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  ]
  
  const SidebarContent = () => (
    <div className="p-6">
      <Link href="/admin" className="block mb-8" onClick={() => setSidebarOpen(false)}>
        <h1 className="text-xl font-bold tracking-[0.2em] text-white">KAZUZA</h1>
        <span className="text-xs text-gray-500 tracking-wider uppercase">Admin</span>
      </Link>
      
      <nav className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                isActive
                  ? 'bg-white text-black'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          )
        })}
      </nav>
      
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-500 hover:text-red-500 transition-colors mt-8 w-full"
      >
        <LogOut size={18} />
        Logout
      </button>
    </div>
  )
  
  return (
    <div className="min-h-screen bg-black">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-between px-4 py-3 border-b border-gray-800">
        <Link href="/admin" className="text-lg font-bold tracking-[0.2em] text-white">
          KAZUZA ADMIN
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-gray-400 hover:text-white"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-40 bg-black/60"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <div className="flex pt-12 lg:pt-0">
        {/* Mobile Sidebar */}
        <aside className={`fixed lg:sticky top-0 left-0 w-[280px] h-screen bg-gray-950 border-r border-gray-800 z-40 lg:z-auto transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}>
          <SidebarContent />
        </aside>
        
        {/* Main Content */}
        <main className="flex-1 min-h-screen">
          <div className="p-6 md:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
