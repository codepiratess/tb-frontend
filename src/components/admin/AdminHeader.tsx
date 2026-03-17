'use client'

import React, { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { 
  Bell, 
  Search, 
  ChevronDown, 
  Menu, 
  UserCircle, 
  Settings, 
  LogOut,
  ShoppingBag,
  Package,
  Star,
  IndianRupee
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLogout } from '@/hooks/useAuth'

export default function AdminHeader() {
  const pathname = usePathname()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const { mutate: logout } = useLogout()

  // Generate breadcrumbs from pathname
  const breadcrumbs = pathname
    .split('/')
    .filter(path => path)
    .map(path => path.charAt(0).toUpperCase() + path.slice(1))

  const notifications = [
    { id: 1, title: 'New order #TB847291', time: '2 min ago', icon: ShoppingBag, color: 'text-blue-500 bg-blue-50' },
    { id: 2, title: "Product 'OnePlus TV' low stock (3 left)", time: '1 hour ago', icon: Package, color: 'text-orange-500 bg-orange-50' },
    { id: 3, title: 'New review needs approval', time: '3 hours ago', icon: Star, color: 'text-purple-500 bg-purple-50' },
    { id: 4, title: 'Payment received ₹4,299', time: '5 hours ago', icon: IndianRupee, color: 'text-green-500 bg-green-50' },
  ]

  return (
    <header className="h-20 bg-white border-b border-slate-200 px-6 md:px-8 flex items-center justify-between sticky top-0 z-40">
      {/* Left: Hamburger + Breadcrumbs */}
      <div className="flex items-center gap-4">
        <button className="lg:hidden p-2 hover:bg-slate-100 rounded-lg text-slate-600">
          <Menu size={24} />
        </button>
        
        <nav className="hidden sm:flex items-center gap-2 text-sm font-bold">
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <span className="text-slate-300">/</span>}
              <span className={idx === breadcrumbs.length - 1 ? 'text-slate-900' : 'text-slate-400'}>
                {crumb}
              </span>
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* Right: Search, Notifications, Profile */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Search Bar - Cmd+K trigger */}
        <button className="flex items-center gap-3 px-4 h-11 bg-slate-50 border border-slate-200 rounded-xl text-slate-400 hover:border-[#2874F0]/30 transition-all group w-48 lg:w-64">
          <Search size={18} className="group-hover:text-[#2874F0]" />
          <span className="text-sm font-medium">Search...</span>
          <kbd className="hidden lg:inline-flex ml-auto items-center gap-1 h-5 px-1.5 font-mono text-[10px] font-black bg-white border border-slate-200 rounded text-slate-400 uppercase">
            ⌘K
          </kbd>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
            className="p-2.5 hover:bg-slate-50 rounded-xl text-slate-600 relative transition-colors"
          >
            <Bell size={22} />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden"
              >
                <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="font-black text-slate-900">Notifications</h3>
                  <span className="text-[10px] font-black text-[#2874F0] bg-blue-50 px-2 py-1 rounded-full uppercase">4 New</span>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((n) => (
                    <button key={n.id} className="w-full p-4 flex gap-4 hover:bg-slate-50 text-left transition-colors border-b border-slate-50 last:border-0 group">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${n.color}`}>
                        <n.icon size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-800 leading-tight mb-1 group-hover:text-[#2874F0]">{n.title}</p>
                        <p className="text-xs font-medium text-slate-400">{n.time}</p>
                      </div>
                    </button>
                  ))}
                </div>
                <Link href="/admin/notifications" className="block p-4 text-center text-xs font-black text-[#2874F0] bg-slate-50/50 hover:bg-slate-50 transition-colors">
                  VIEW ALL NOTIFICATIONS
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button 
            onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
            className="flex items-center gap-3 p-1.5 pr-3 hover:bg-slate-50 rounded-xl transition-colors group"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#2874F0] to-[#1a5dc8] flex items-center justify-center text-white font-black text-xs shadow-lg shadow-blue-500/20">
              TA
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-black text-slate-900 leading-none mb-0.5">TownBolt Admin</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Super Admin</p>
            </div>
            <ChevronDown size={14} className={`text-slate-400 transition-transform ${showProfile ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {showProfile && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden"
              >
                <div className="p-2">
                  <Link href="/admin/profile" className="flex items-center gap-3 p-3 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors">
                    <UserCircle size={18} className="text-slate-400" />
                    My Profile
                  </Link>
                  <Link href="/admin/settings" className="flex items-center gap-3 p-3 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors">
                    <Settings size={18} className="text-slate-400" />
                    Shop Settings
                  </Link>
                  <div className="h-px bg-slate-100 my-1 mx-2"></div>
                  <button 
                    onClick={() => logout()}
                    className="w-full flex items-center gap-3 p-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}
