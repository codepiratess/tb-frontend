'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Filter, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { useProducts } from '../../../hooks/useProducts'
import { ProductGrid } from '../../../components/product/ProductGrid'
import { ProductFilters, FilterState } from '../../../components/product/ProductFilters'
import { cn } from '../../../lib/utils'

export default function ProductsPage() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    categories: searchParams.get('category')?.split(',').filter(Boolean) || [],
    minPrice: Number(searchParams.get('minPrice')) || 0,
    maxPrice: Number(searchParams.get('maxPrice')) || 999999,
    rating: Number(searchParams.get('rating')) || 0,
    inStock: searchParams.get('inStock') === 'true',
  })

  const sort = searchParams.get('sort') || 'relevance'
  const page = Number(searchParams.get('page')) || 1
  const limit = 20
  const q = searchParams.get('q') || ''

  const { data, isLoading } = useProducts({
    page,
    limit,
    categorySlug: filters.categories.join(','),
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    rating: filters.rating,
    inStock: filters.inStock,
    sort,
    q
  })

  // Sync state to URL when filters change
  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters)
    
    const params = new URLSearchParams(searchParams)
    
    if (newFilters.categories.length > 0) params.set('category', newFilters.categories.join(','))
    else params.delete('category')
      
    if (newFilters.minPrice > 0) params.set('minPrice', newFilters.minPrice.toString())
    else params.delete('minPrice')
      
    if (newFilters.maxPrice < 999999) params.set('maxPrice', newFilters.maxPrice.toString())
    else params.delete('maxPrice')
      
    if (newFilters.rating > 0) params.set('rating', newFilters.rating.toString())
    else params.delete('rating')
      
    if (newFilters.inStock) params.set('inStock', 'true')
    else params.delete('inStock')
      
    params.set('page', '1') // reset to first page on filter change
    
    router.push(`${pathname}?${params.toString()}`)
  }

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams)
    params.set('sort', e.target.value)
    params.set('page', '1')
    router.push(`${pathname}?${params.toString()}`)
  }

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', newPage.toString())
    router.push(`${pathname}?${params.toString()}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const getPageNumbers = (totalPages: number, currentPage: number) => {
    const pages = []
    let start = Math.max(1, currentPage - 2)
    const end = Math.min(totalPages, start + 4)
    if (end - start < 4) {
      start = Math.max(1, end - 4)
    }
    for (let i = start; i <= end; i++) pages.push(i)
    return pages
  }

  const totalPages = data ? Math.ceil(data.total / limit) : 1
  const activeFiltersCount = filters.categories.length + (filters.minPrice > 0 ? 1 : 0) + (filters.maxPrice < 999999 ? 1 : 0) + (filters.rating > 0 ? 1 : 0) + (filters.inStock ? 1 : 0)

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="container mx-auto px-4 py-6"
    >
      {/* Breadcrumbs */}
      <div className="text-xs text-text-secondary mb-4 flex items-center gap-2">
        <Link href="/" className="hover:text-primary">Home</Link>
        <ChevronRight size={12} />
        <span className="text-text-primary font-medium">Products</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-72 shrink-0 h-[calc(100vh-140px)] sticky top-24">
          <ProductFilters filters={filters} onFilterChange={handleFilterChange} />
        </div>

        {/* Main Content */}
        <div className="flex-1 w-full flex flex-col min-h-screen">
          
          {/* Top Bar */}
          <div className="bg-white p-4 rounded-sm shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
            
            <div className="flex items-center gap-2 text-sm text-text-primary font-medium">
              {q ? (
                <span>Showing results for &quot;<span className="font-bold">{q}</span>&quot;</span>
              ) : (
                <span>
                  Showing {data ? (page - 1) * limit + 1 : 0}–{data ? Math.min(page * limit, data.total) : 0} of {data?.total || 0} products
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Mobile Filter Button */}
              <button 
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden flex-1 sm:flex-none flex items-center justify-center gap-2 h-10 px-4 bg-white border border-gray-200 rounded-sm text-sm font-medium hover:bg-gray-50"
              >
                <Filter size={16} /> Filters
                {activeFiltersCount > 0 && (
                  <span className="bg-primary text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] ml-1">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              <div className="relative flex-1 sm:flex-none">
                <select 
                  value={sort}
                  onChange={handleSortChange}
                  className="w-full h-10 pl-3 pr-8 bg-white border border-gray-200 rounded-sm text-sm font-medium outline-none focus:border-primary appearance-none cursor-pointer"
                >
                  <option value="relevance">Relevance</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                  <option value="top-rated">Top Rated</option>
                  <option value="popular">Most Popular</option>
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
              </div>
            </div>
          </div>

          <ProductGrid 
            products={data?.data || []} 
            isLoading={isLoading} 
          />

          {/* Pagination */}
          {!isLoading && data?.data && data.data.length > 0 && totalPages > 1 && (
            <div className="mt-8 mb-12 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 pt-6 gap-4">
              <span className="text-sm text-text-secondary">
                Page {page} of {totalPages}
              </span>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="flex items-center justify-center h-10 px-4 text-sm font-medium text-text-primary bg-white border border-gray-200 rounded-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={16} className="mr-1" /> Previous
                </button>
                
                <div className="hidden sm:flex items-center gap-1">
                  {getPageNumbers(totalPages, page).map(num => (
                    <button
                      key={num}
                      onClick={() => handlePageChange(num)}
                      className={cn(
                        "w-10 h-10 flex items-center justify-center text-sm font-medium rounded-sm transition-colors",
                        page === num 
                          ? "bg-primary text-white" 
                          : "bg-white border border-gray-200 text-text-primary hover:bg-gray-50"
                      )}
                    >
                      {num}
                    </button>
                  ))}
                  {totalPages > 5 && page < totalPages - 2 && (
                    <span className="px-2 text-gray-400">...</span>
                  )}
                </div>

                <button
                  onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="flex items-center justify-center h-10 px-4 text-sm font-medium text-text-primary bg-white border border-gray-200 rounded-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next <ChevronRight size={16} className="ml-1" />
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFilterOpen(false)}
              className="fixed inset-0 bg-black/50 z-50 lg:hidden"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 w-full h-[85vh] bg-white z-[60] lg:hidden rounded-t-2xl flex flex-col overflow-hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <h3 className="text-lg font-bold text-text-primary">Filters</h3>
                <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 text-gray-500 hover:text-text-primary hover:bg-gray-100 rounded-full">
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-auto">
                <ProductFilters filters={filters} onFilterChange={setFilters} />
              </div>
              <div className="p-4 border-t border-gray-100 flex gap-4 bg-white">
                <button 
                  onClick={() => setFilters({ categories: [], minPrice: 0, maxPrice: 999999, rating: 0, inStock: false })}
                  className="flex-1 py-3 border border-gray-200 rounded-sm font-bold text-text-primary"
                >
                  Clear All
                </button>
                <button 
                  onClick={() => {
                    handleFilterChange(filters)
                    setIsMobileFilterOpen(false)
                  }}
                  className="flex-1 py-3 bg-primary text-white rounded-sm font-bold"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function ChevronDown({ className, size }: { className?: string, size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m6 9 6 6 6-6"/>
    </svg>
  )
}
