'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useDispatch } from 'react-redux'
import { 
  LayoutDashboard, Package, ShoppingBag, Tag, 
  BarChart3, Settings, LogOut, ChevronLeft, 
  Plus, ExternalLink, Zap
} from 'lucide-react'
import { cn } from '../../lib/utils'
import { logout } from '../../store/slices/authSlice'
import { AppDispatch } from '../../store'

interface AdminSidebarProps {
  isCollapsed: boolean
  setIsCollapsed: (value: boolean) => void
}

export function AdminSidebar({ isCollapsed, setIsCollapsed }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  
  const [expandedMenu, setExpandedMenu] = useState<string | null>('products')

  const toggleSubmenu = (menu: string) => {
    if (isCollapsed) {
      setIsCollapsed(false)
      setExpandedMenu(menu)
      return
    }
    setExpandedMenu(expandedMenu === menu ? null : menu)
  }

  const handleLogout = () => {
    dispatch(logout())
    router.push('/auth/login')
  }

  const NAV_ITEMS = [
    { 
      label: 'Dashboard', 
      icon: LayoutDashboard, 
      href: '/admin',
      exact: true
    },
    { 
      id: 'products',
      label: 'Products', 
      icon: Package, 
      submenu: [
        { label: 'All Products', href: '/admin/products' },
        { label: 'Add New', href: '/admin/products/new', icon: Plus }
      ]
    },
    { 
      label: 'Orders', 
      icon: ShoppingBag, 
      href: '/admin/orders' 
    },
    { 
      label: 'Categories', 
      icon: Tag, 
      href: '/admin/categories' 
    },
    { 
      label: 'Analytics', 
      icon: BarChart3, 
      href: '/admin/analytics' 
    }
  ]

  const isRouteActive = (href: string, exact = false) => {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 64 : 240 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed top-0 left-0 h-screen bg-white border-r border-gray-200 z-40 flex flex-col shrink-0 overflow-hidden"
    >
      {/* Header */}
      <div className="h-16 flex items-center px-4 border-b border-gray-100 justify-between shrink-0">
        <div className={cn("flex items-center gap-2 overflow-hidden", isCollapsed && "opacity-0 invisible w-0")}>
          <Link href="/admin" className="flex items-center gap-1 group whitespace-nowrap">
            <div className="bg-primary p-1 rounded-sm">
              <Zap size={16} className="text-yellow-400 fill-yellow-400" />
            </div>
            <span className="font-bold text-lg italic text-primary">TownBolt</span>
            <span className="bg-accent text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-1 uppercase">
              Admin
            </span>
          </Link>
        </div>
        
        {/* If collapsed, show a nice compact central logo */}
        <div className={cn("absolute left-1/2 -translate-x-1/2 transition-opacity", !isCollapsed && "opacity-0 invisible")}>
          <div className="bg-primary p-1.5 rounded-sm">
            <Zap size={18} className="text-yellow-400 fill-yellow-400" />
          </div>
        </div>

        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            "p-1 rounded-full hover:bg-gray-100 transition-colors text-text-secondary",
            isCollapsed && "absolute right-0"
          )}
        >
          <ChevronLeft size={20} className={cn("transition-transform duration-300", isCollapsed && "rotate-180")} />
        </button>
      </div>

      {/* Nav Items */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-6 space-y-1 px-3 custom-scrollbar">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          
          if (item.submenu) {
            const isSubMenuActive = item.submenu.some(sub => isRouteActive(sub.href))
            const isExpanded = expandedMenu === item.id && !isCollapsed

            return (
              <div key={item.id} className="mb-1">
                <button
                  onClick={() => toggleSubmenu(item.id)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2.5 rounded-sm transition-colors group",
                    isSubMenuActive ? "text-primary font-medium" : "text-text-secondary hover:text-primary hover:bg-primary/5"
                  )}
                  title={isCollapsed ? item.label : undefined}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={20} className={cn(isSubMenuActive && "text-primary")} />
                    <motion.span 
                      animate={{ opacity: isCollapsed ? 0 : 1 }}
                      className="whitespace-nowrap flex-1 text-left"
                    >
                      {item.label}
                    </motion.span>
                  </div>
                  {!isCollapsed && (
                    <ChevronLeft size={16} className={cn("transition-transform", isExpanded && "-rotate-90")} />
                  )}
                </button>
                
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden bg-gray-50/50 rounded-sm mt-1"
                    >
                      {item.submenu.map((sub, idx) => {
                        const SubIcon = sub.icon
                        const isActive = isRouteActive(sub.href, true)
                        
                        return (
                          <Link
                            key={idx}
                            href={sub.href}
                            className={cn(
                              "flex flex-col ml-11 py-2 text-sm pr-3 border-l-2 pl-3 transition-colors group whitespace-nowrap",
                              isActive 
                                ? "border-primary text-primary font-medium" 
                                : "border-transparent text-text-secondary hover:text-primary hover:border-text-secondary"
                            )}
                          >
                            <span className="flex items-center gap-2">
                              {SubIcon && <SubIcon size={14} />}
                              {sub.label}
                            </span>
                          </Link>
                        )
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          }

          const isActive = isRouteActive(item.href, item.exact)

          return (
            <Link
              key={item.label}
              href={item.href}
              title={isCollapsed ? item.label : undefined}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-sm transition-colors group relative mb-1",
                isActive 
                  ? "bg-primary text-white font-medium shadow-sm" 
                  : "text-text-secondary hover:text-primary hover:bg-primary/5"
              )}
            >
              <Icon size={20} />
              <motion.span 
                animate={{ opacity: isCollapsed ? 0 : 1 }}
                className="whitespace-nowrap"
              >
                {item.label}
              </motion.span>
              
              {isActive && isCollapsed && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-md" />
              )}
            </Link>
          )
        })}
      </div>

      {/* Footer / Logout */}
      <div className="p-3 border-t border-gray-100 space-y-1 shrink-0 bg-white">
        <Link
          href="/"
          title={isCollapsed ? "Back to Shop" : undefined}
          className="flex items-center gap-3 px-3 py-2.5 rounded-sm transition-colors text-text-secondary hover:text-primary hover:bg-primary/5 group"
        >
          <ExternalLink size={20} />
          <motion.span animate={{ opacity: isCollapsed ? 0 : 1 }} className="whitespace-nowrap flex-1 text-sm font-medium">
            Back to Shop
          </motion.span>
        </Link>
        <button
          onClick={handleLogout}
          title={isCollapsed ? "Logout" : undefined}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-sm transition-colors text-error hover:bg-error/10 hover:text-error group font-medium text-sm"
        >
          <LogOut size={20} />
          <motion.span animate={{ opacity: isCollapsed ? 0 : 1 }} className="whitespace-nowrap flex-1 text-left">
            Logout
          </motion.span>
        </button>
      </div>
    </motion.aside>
  )
}

export default AdminSidebar
