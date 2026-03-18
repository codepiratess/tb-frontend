'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useSelector, useDispatch } from 'react-redux'
import { 
  Zap, Search, ChevronDown, Heart, ShoppingCart, Menu, 
  Smartphone, Monitor, Shirt, Home, Sparkles, Trophy, 
  BookOpen, Puzzle, ShoppingBasket, Sofa, Tv, Tag
} from 'lucide-react'
import { selectCartCount } from '../../store/selectors/cartSelectors'
import { selectWishlistCount } from '../../store/selectors/wishlistSelectors'
import { RootState, AppDispatch } from '../../store'
import { useCartDrawer } from '../../store/useCartDrawer'
import { useSearchProducts } from '../../hooks/useProducts'
import { useCategories } from '../../hooks/useCategories'
import { useDebounce } from '../../hooks/useDebounce'
import { logout } from '../../store/slices/authSlice'
import { Input } from '../ui/Input'

const getCategoryIcon = (slug: string) => {
  switch (slug) {
    case 'electronics': return <Monitor size={16} />
    case 'clothing': return <Shirt size={16} />
    case 'footwear': return <Sparkles size={16} />
    case 'home-kitchen': return <Home size={16} />
    case 'beauty': return <Sparkles size={16} />
    case 'sports': return <Trophy size={16} />
    case 'books': return <BookOpen size={16} />
    case 'toys': return <Puzzle size={16} />
    case 'grocery': return <ShoppingBasket size={16} />
    case 'furniture': return <Sofa size={16} />
    case 'mobiles': return <Smartphone size={16} />
    case 'appliances': return <Tv size={16} />
    default: return <Tag size={16} />
  }
}

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  
  const cartCount = useSelector(selectCartCount)
  const wishlistCount = useSelector(selectWishlistCount)
  const { user } = useSelector((state: RootState) => state.auth)
  
  const openCart = useCartDrawer((state) => state.openCart)
  
  const [isScrolled, setIsScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  
  const debouncedSearch = useDebounce(searchQuery, 400)
  const { data: searchResults, isLoading: isSearchLoading } = useSearchProducts(debouncedSearch)
  const { data: categories } = useCategories()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setShowDropdown(false)
    }
  }

  const handleLogout = () => {
    dispatch(logout())
    router.push('/auth/login')
  }

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex flex-col">
      {/* TOP ROW */}
      <div className="bg-[#2874F0] text-white h-[60px] md:h-[72px] flex items-center shadow-sm">
        <div className="container mx-auto px-4 flex items-center justify-between gap-4 lg:gap-8 max-w-7xl">
          
          <div className="flex items-center gap-3">
            <button className="md:hidden p-1">
              <Menu size={24} />
            </button>
            <Link href="/" className="flex items-center gap-1 group">
              <span className="text-xl md:text-2xl font-black italic tracking-tight">
                TownBolt
              </span>
              <Zap size={20} className="text-yellow-400 fill-yellow-400 animate-pulse" />
            </Link>
          </div>

          <div className="flex-1 max-w-2xl hidden md:block relative z-60">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setShowDropdown(true)
                }}
                onFocus={() => setShowDropdown(true)}
                placeholder="Search for products, categories and more"
                className="w-full h-10 pl-4 pr-12 rounded-sm text-gray-900 text-sm focus:outline-none bg-white"
              />
              <button 
                type="submit" 
                className="absolute right-0 top-0 h-10 w-12 flex items-center justify-center text-[#2874F0]"
              >
                <Search size={20} />
              </button>
            </form>
            
            <AnimatePresence>
              {showDropdown && debouncedSearch && (
                <>
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-40 bg-black/10"
                    onClick={() => setShowDropdown(false)}
                  />
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="absolute top-12 left-0 w-full bg-white rounded-sm shadow-xl z-50 overflow-hidden border border-gray-100"
                    >
                      {isSearchLoading ? (
                        <div className="p-4 text-center text-sm text-gray-400 italic">Searching...</div>
                      ) : (searchResults?.data?.length || 0) > 0 ? (
                        <div className="max-h-80 overflow-y-auto">
                          {searchResults?.data.slice(0, 5).map((product: any) => (
                            <Link 
                              key={product.id} 
                              href={`/products/${product.slug}`}
                              className="flex items-center gap-3 p-3 hover:bg-gray-50 border-b border-gray-50 last:border-0"
                              onClick={() => {
                                setShowDropdown(false)
                                setSearchQuery('')
                              }}
                            >
                              <Search size={16} className="text-gray-400 flex-shrink-0" />
                              <div className="flex flex-col">
                                <span className="text-sm text-gray-900 font-bold line-clamp-1">{product.name}</span>
                                <span className="text-[10px] text-gray-400 font-black uppercase">{product.category?.name}</span>
                              </div>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 text-center text-sm text-gray-400">
                          No results found
                        </div>
                      )}
                    </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-2 lg:gap-6">
            <div className="hidden md:block relative group">
              {user ? (
                <div className="flex items-center gap-1 cursor-pointer py-2 hover:opacity-90 font-bold">
                  {user.firstName}
                  <ChevronDown size={16} className="group-hover:rotate-180 transition-transform duration-200" />
                  
                  <div className="absolute top-full right-0 pt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="bg-white rounded-xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden text-gray-900 p-2">
                      {user.role === 'admin' && (
                        <Link href="/admin" className="px-4 py-3 text-xs font-black uppercase hover:bg-blue-50 hover:text-[#2874F0] rounded-lg transition-colors">
                          Admin Panel
                        </Link>
                      )}
                      <Link href="/orders" className="px-4 py-3 text-xs font-black uppercase hover:bg-slate-50 rounded-lg transition-colors">
                        My Orders
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="px-4 py-3 text-xs font-black uppercase hover:bg-red-50 text-red-500 rounded-lg text-left"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link href="/auth/login" className="bg-white text-[#2874F0] px-6 py-1.5 rounded-sm font-black text-sm uppercase shadow-lg shadow-black/10">
                  Login
                </Link>
              )}
            </div>

            <Link href="/wishlist" className="hidden md:flex items-center gap-1">
              <div className="relative">
                <Heart size={22} className="text-white" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-orange-500 text-white text-[10px] font-black h-4 w-4 rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </div>
            </Link>

            <button 
              onClick={openCart}
              className="flex items-center gap-2 relative"
            >
              <ShoppingCart size={22} className="text-white" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-orange-500 text-white text-[10px] font-black h-4 w-4 rounded-full flex items-center justify-center shadow-lg">
                  {cartCount}
                </span>
              )}
              <span className="font-black text-sm uppercase hidden md:block">Cart</span>
            </button>
          </div>
        </div>
      </div>

      {/* BOTTOM ROW (Categories) */}
      <AnimatePresence>
        {!isScrolled && categories && (
          <motion.div 
            initial={{ height: 40, opacity: 0 }}
            animate={{ height: 40, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="hidden md:block bg-white border-b shadow-sm z-[-1]"
          >
            <div className="container mx-auto px-4 h-full flex items-center justify-between max-w-7xl overflow-x-auto no-scrollbar">
              {(Array.isArray(categories) ? categories : []).slice(0, 10).map((cat: any) => (
                <Link 
                  key={cat.id} 
                  href={`/category/${cat.slug}`}
                  className={`flex items-center gap-1.5 px-3 py-2 text-[11px] font-black uppercase tracking-wider transition-colors relative group
                    ${pathname === `/category/${cat.slug}` ? 'text-[#2874F0]' : 'text-gray-500 hover:text-[#2874F0]'}
                  `}
                >
                  {getCategoryIcon(cat.slug)}
                  {cat.name}
                  <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-[#2874F0] transform transition-transform duration-300 ${pathname === `/category/${cat.slug}` ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Navbar
