'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useSelector } from 'react-redux'
import { 
  Home, Grid2X2, Search, Heart, ShoppingCart, 
  X, ChevronDown, ChevronRight, Zap, User as UserIcon,
  ShoppingBasket
} from 'lucide-react'
import { selectCartCount } from '../../store/selectors/cartSelectors'
import { selectWishlistCount } from '../../store/selectors/wishlistSelectors'
import { RootState } from '../../store'
import { CATEGORY_LIST } from '../../constants'
import { cn } from '../../lib/utils'
import { useCartDrawer } from '../../store/useCartDrawer'

export function MobileNav() {
  const pathname = usePathname()
  
  const cartCount = useSelector(selectCartCount)
  const wishlistCount = useSelector(selectWishlistCount)
  const { user } = useSelector((state: RootState) => state.auth)
  
  const openCart = useCartDrawer(state => state.openCart)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)

  // Part A: Bottom Tab Bar data
  const tabs = [
    { name: 'Home', icon: Home, href: '/' },
    { name: 'Categories', icon: Grid2X2, href: '/category' },
    { name: 'Search', icon: Search, href: '/search' },
    { name: 'Wishlist', icon: Heart, href: '/wishlist', badge: wishlistCount },
    { name: 'Cart', icon: ShoppingCart, onClick: openCart, badge: cartCount },
  ]

  // Listen to openDrawer events if dispatched (e.g., from Navbar hamburger)
  // We can expose this via a global store or handle it simply with DOM events for now
  React.useEffect(() => {
    const handleOpenDrawer = () => setIsDrawerOpen(true)
    // Hacky way to communicate from Navbar hamburger to here without another Zustand store
    document.addEventListener('openMobileDrawer', handleOpenDrawer)
    return () => document.removeEventListener('openMobileDrawer', handleOpenDrawer)
  }, [])

  return (
    <>
      {/* PART A - Bottom Tab Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 z-40 md:hidden pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-around h-16">
          {tabs.map((tab, idx) => {
            const Icon = tab.icon
            const isActive = tab.href ? pathname === tab.href : false
            
            const content = (
              <>
                <div className="relative">
                  <Icon size={22} className={cn(isActive ? "text-primary stroke-[2.5]" : "text-text-secondary")} />
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-accent text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                      {tab.badge > 99 ? '99+' : tab.badge}
                    </span>
                  )}
                </div>
                <span className={cn(
                  "text-[10px] mt-1 font-medium",
                  isActive ? "text-primary font-semibold" : "text-text-secondary"
                )}>
                  {tab.name}
                </span>
              </>
            )

            if (tab.onClick) {
              return (
                <button key={idx} onClick={tab.onClick} className="flex flex-col items-center justify-center w-full h-full">
                  {content}
                </button>
              )
            }

            return (
              <Link key={idx} href={tab.href as string} className="flex flex-col items-center justify-center w-full h-full">
                {content}
              </Link>
            )
          })}
        </div>
      </div>

      {/* PART B - Left Drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-50 md:hidden"
              onClick={() => setIsDrawerOpen(false)}
            />
            
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="fixed top-0 left-0 h-full w-[80%] max-w-sm bg-white z-[60] shadow-2xl flex flex-col md:hidden overflow-hidden"
            >
              {/* Drawer Header */}
              <div className="bg-primary text-white p-4 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-1 group" onClick={() => setIsDrawerOpen(false)}>
                  <span className="text-xl font-bold italic tracking-tight">TownBolt</span>
                  <div className="bg-white/20 p-1 rounded-full">
                    <Zap size={16} className="text-yellow-400 fill-yellow-400" />
                  </div>
                </Link>
                <button onClick={() => setIsDrawerOpen(false)} className="p-1">
                  <X size={24} />
                </button>
              </div>

              {/* User Section */}
              <div className="p-4 border-b border-gray-100 flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                  <UserIcon size={24} />
                </div>
                {user ? (
                  <div className="flex flex-col">
                    <span className="font-semibold text-text-primary line-clamp-1">{user.firstName} {user.lastName}</span>
                    <span className="text-xs text-text-secondary line-clamp-1">{user.email || user.phone}</span>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Link href="/auth/login" className="text-sm font-semibold text-primary" onClick={() => setIsDrawerOpen(false)}>Login</Link>
                    <span className="text-gray-300">|</span>
                    <Link href="/auth/register" className="text-sm font-semibold text-primary" onClick={() => setIsDrawerOpen(false)}>Register</Link>
                  </div>
                )}
              </div>

              {/* Links */}
              <div className="flex-1 overflow-y-auto py-2">
                <Link href="/" className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 text-text-primary" onClick={() => setIsDrawerOpen(false)}>
                  <Home size={20} className="text-text-secondary" />
                  <span className="font-medium">Home</span>
                </Link>

                <Link href="/products" className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 text-text-primary" onClick={() => setIsDrawerOpen(false)}>
                  <Grid2X2 size={20} className="text-text-secondary" />
                  <span className="font-medium">All Products</span>
                </Link>

                <div>
                  <button 
                    onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 text-text-primary"
                  >
                    <div className="flex items-center gap-4">
                      <Grid2X2 size={20} className="text-text-secondary" />
                      <span className="font-medium">Categories</span>
                    </div>
                    <ChevronDown size={16} className={cn("transition-transform", isCategoriesOpen ? "rotate-180" : "")} />
                  </button>
                  
                  <AnimatePresence>
                    {isCategoriesOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-gray-50"
                      >
                        {CATEGORY_LIST.map((cat) => (
                          <Link
                            key={cat.slug}
                            href={`/category/${cat.slug}`}
                            className="flex items-center pl-12 pr-4 py-3 hover:bg-gray-100 text-sm font-medium text-text-secondary hover:text-primary transition-colors border-l-4 border-transparent hover:border-primary"
                            onClick={() => setIsDrawerOpen(false)}
                          >
                            {cat.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Link href="/orders" className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 text-text-primary" onClick={() => setIsDrawerOpen(false)}>
                  <ShoppingBasket size={20} className="text-text-secondary" />
                  <span className="font-medium">My Orders</span>
                </Link>
                
                <Link href="/wishlist" className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 text-text-primary" onClick={() => setIsDrawerOpen(false)}>
                  <Heart size={20} className="text-text-secondary" />
                  <span className="font-medium">Wishlist</span>
                </Link>

                <div className="border-t border-gray-100 my-2"></div>
                
                <Link href="/contact" className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 text-text-secondary text-sm" onClick={() => setIsDrawerOpen(false)}>
                  Contact Us
                </Link>
                <Link href="/faq" className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 text-text-secondary text-sm" onClick={() => setIsDrawerOpen(false)}>
                  FAQs
                </Link>

                {user?.role === 'admin' && (
                  <div className="mt-4 px-4">
                    <Link href="/admin" className="block w-full bg-primary-light text-primary text-center py-2 rounded-sm font-semibold text-sm" onClick={() => setIsDrawerOpen(false)}>
                      Admin Dashboard
                    </Link>
                  </div>
                )}
              </div>

              {/* Drawer Footer */}
              <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-center text-xs text-gray-400 font-medium">
                v1.0.0
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default MobileNav
