'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Zap, 
  ChevronLeft, 
  ChevronDown,
  ChevronRight,
  ExternalLink,
  LogOut,
} from 'lucide-react'
import { useLogout } from '@/hooks/useAuth'
import { NAV_SECTIONS } from '@/constants/adminNav'

export default function AdminSidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [openSubMenus, setOpenSubMenus] = useState<string[]>([])
  const { mutate: logout } = useLogout()

  const toggleSubMenu = (id: string) => {
    if (isCollapsed) return
    setOpenSubMenus(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    )
  }

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  return (
    <motion.aside 
      initial={false}
      animate={{ width: isCollapsed ? 80 : 260 }}
      className="h-screen bg-[#1e293b] text-slate-400 flex flex-col relative z-50 shadow-2xl"
    >
      {/* Header */}
      <div className="h-20 flex items-center px-6 border-b border-slate-800/50">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="bg-[#2874F0] p-1.5 rounded-lg">
            <Zap size={20} className="text-white fill-white" />
          </div>
          {!isCollapsed && (
            <span className="text-xl font-black text-white tracking-tight">TownBolt</span>
          )}
        </Link>
        
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-20 bg-white text-[#1e293b] p-1 rounded-full shadow-lg border border-slate-200 z-50 hover:bg-[#2874F0] hover:text-white transition-colors"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Nav Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-6 scrollbar-thin scrollbar-thumb-slate-800">
        {NAV_SECTIONS.map((section, idx) => (
          <div key={idx} className="mb-6 px-4">
            {!isCollapsed && (
              <h3 className="text-[10px] font-black tracking-[0.2em] text-slate-500 mb-4 px-2">
                {section.label}
              </h3>
            )}
            
            <div className="space-y-1">
              {section.items.map((item) => (
                <div key={item.id}>
                  {item.subItems ? (
                    <div>
                      <button 
                        onClick={() => toggleSubMenu(item.id)}
                        className={`w-full flex items-center justify-between p-2 rounded-xl transition-all group ${
                          pathname.startsWith(item.href) && !isCollapsed
                          ? 'bg-slate-800/50 text-white' 
                          : 'hover:bg-slate-800/30'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon size={20} className={pathname.startsWith(item.href) ? 'text-[#2874F0]' : 'group-hover:text-[#2874F0]'} />
                          {!isCollapsed && <span className="text-sm font-bold">{item.label}</span>}
                        </div>
                        {!isCollapsed && (
                          <ChevronDown 
                            size={16} 
                            className={`transition-transform duration-300 ${openSubMenus.includes(item.id) ? 'rotate-180' : ''}`} 
                          />
                        )}
                      </button>
                      
                      <AnimatePresence>
                        {openSubMenus.includes(item.id) && !isCollapsed && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="ml-9 mt-1 space-y-1 overflow-hidden"
                          >
                            {item.subItems.map((sub, sIdx) => (
                              <Link 
                                key={sIdx} 
                                href={sub.href}
                                className={`block p-2 text-xs font-bold rounded-lg transition-colors ${
                                  pathname === sub.href ? 'text-[#2874F0]' : 'hover:text-white'
                                }`}
                              >
                                {sub.label}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link 
                      href={item.href}
                      className={`flex items-center justify-between p-2 rounded-xl transition-all group ${
                        isActive(item.href) 
                        ? 'bg-[#2874F0] text-white shadow-lg shadow-blue-500/20' 
                        : 'hover:bg-slate-800/30'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon size={20} className={isActive(item.href) ? 'text-white' : 'group-hover:text-[#2874F0]'} />
                        {!isCollapsed && <span className="text-sm font-bold">{item.label}</span>}
                      </div>
                      {!isCollapsed && item.badge && (
                        <span className="bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-slate-800/50 bg-slate-900/50">
        <Link 
          href="/" 
          target="_blank"
          className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-800 transition-colors group mb-1"
        >
          <ExternalLink size={20} className="group-hover:text-[#2874F0]" />
          {!isCollapsed && <span className="text-sm font-bold">Visit Shop</span>}
        </Link>
        <button 
          onClick={() => logout()}
          className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-colors group"
        >
          <LogOut size={20} />
          {!isCollapsed && <span className="text-sm font-bold">Logout</span>}
        </button>
      </div>
    </motion.aside>
  )
}
