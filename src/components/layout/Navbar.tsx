'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useSelector, useDispatch } from 'react-redux'
import { 
  Zap, Search, ChevronDown, Heart, ShoppingCart, Menu, 
  Smartphone, Monitor, Shirt, Home, Sparkles, Trophy, 
  BookOpen, Puzzle, ShoppingBasket, Sofa, Tv, Tag, Package
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
  const { 
    data: searchData, 
    isLoading: searchLoading, 
    isFetching: searchFetching 
  } = useSearchProducts(debouncedSearch)
  const { data: categories } = useCategories()

  const searchProducts = searchData?.data || []
  const searchSuggestions = searchData?.suggestions || []
  const isSearching = searchLoading || searchFetching

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
              {showDropdown && debouncedSearch.trim().length >= 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute top-full left-0 right-0 bg-white shadow-xl border-t-0 border border-gray-100 rounded-b-lg z-[200] max-h-[400px] overflow-y-auto mt-1"
                >
                  {isSearching ? (
                    <div className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
                        <div className="w-4 h-4 border-2 border-[#2874F0] border-t-transparent rounded-full animate-spin" />
                        Searching for "{debouncedSearch}"
                      </div>
                    </div>
                  ) : searchProducts.length === 0 && searchSuggestions.length === 0 ? (
                    <div className="p-6 text-center">
                      <Search size={32} className="mx-auto mb-3 text-gray-200" />
                      <p className="text-sm font-medium text-gray-500">
                        No results for "{debouncedSearch}"
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Try different keywords
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Category suggestions */}
                      {searchSuggestions.length > 0 && (
                        <div className="border-b border-gray-50 py-1">
                          {searchSuggestions.map((s: any, i: number) => (
                            <button
                              key={i}
                              onMouseDown={(e) => {
                                e.preventDefault()
                                router.push(`/category/${s.slug}`)
                                setShowDropdown(false)
                                setSearchQuery('')
                              }}
                              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 transition-colors text-left"
                            >
                              <Tag size={14} className="text-[#2874F0] shrink-0" />
                              <span className="text-sm text-gray-600">
                                in category{' '}
                                <strong className="text-gray-900">{s.name}</strong>
                              </span>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Product results */}
                      {searchProducts.length > 0 && (
                        <>
                          <div className="px-4 py-2 border-b border-gray-50">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                              Products
                            </p>
                          </div>
                          {searchProducts.map((product: any) => (
                            <button
                              key={product.id}
                              onMouseDown={(e) => {
                                e.preventDefault()
                                router.push(`/products/${product.slug}`)
                                setShowDropdown(false)
                                setSearchQuery('')
                              }}
                              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-50 last:border-0"
                            >
                              <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
                                {product.images?.[0] ? (
                                  <img
                                    src={product.images[0]}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                    <Package size={14} className="text-gray-300" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-900 font-medium line-clamp-1">
                                  {product.name}
                                </p>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-xs text-gray-400">
                                    {product.category?.name}
                                  </span>
                                  <span className="text-xs font-bold text-[#2874F0]">
                                    ₹{product.price?.toLocaleString('en-IN')}
                                  </span>
                                </div>
                              </div>
                            </button>
                          ))}

                          <button
                            onMouseDown={(e) => {
                              e.preventDefault()
                              router.push(`/search?q=${encodeURIComponent(debouncedSearch)}`)
                              setShowDropdown(false)
                            }}
                            className="w-full px-4 py-3 text-sm text-[#2874F0] font-semibold text-center hover:bg-blue-50 border-t border-gray-100 transition-colors"
                          >
                            See all results for "{debouncedSearch}" →
                          </button>
                        </>
                      )}
                    </>
                  )}
                </motion.div>
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
