'use client'

import React, { useState } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Filter, X, ChevronRight, ChevronDown } from 'lucide-react'
import { useProducts } from '../../../../hooks/useProducts'
import { ProductGrid } from '../../../../components/product/ProductGrid'
import { ProductFilters, FilterState } from '../../../../components/product/ProductFilters'
import { CATEGORY_LIST } from '../../../../constants'
import { cn } from '../../../../lib/utils'

export default function CategoryPageClient({ slug }: { slug: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const category = CATEGORY_LIST.find(c => c.slug === slug)

  console.log("category--------------->", category)

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    categories: [slug], // Pre-filled with current category
    minPrice: Number(searchParams.get('minPrice')) || 0,
    maxPrice: Number(searchParams.get('maxPrice')) || 999999,
    rating: Number(searchParams.get('rating')) || 0,
    inStock: searchParams.get('inStock') === 'true',
  })

  const sort = searchParams.get('sort') || 'relevance'
  const page = Number(searchParams.get('page')) || 1
  const limit = 20

  const { data, isLoading } = useProducts({
    page,
    limit,
    categorySlug: filters.categories.join(','), // Will initially just be 'slug'
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    minRating: filters.rating,
    inStock: filters.inStock,
    sortBy: sort === 'price-asc' ? 'price' : sort === 'price-desc' ? 'price' : sort === 'newest' ? 'createdAt' : sort === 'top-rated' ? 'rating' : sort === 'popular' ? 'soldCount' : 'createdAt',
    sortOrder: sort === 'price-asc' ? 'ASC' : 'DESC',
  })

  // Sync state to URL when filters change
  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters)

    const params = new URLSearchParams(searchParams)

    // We update categories if user multi-selects, but base slug should probably stay if they are on this route.
    if (newFilters.categories.length > 0) params.set('categories', newFilters.categories.join(','))
    else params.delete('categories')

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

  const totalPages = data ? Math.ceil(data.total / limit) : 1
  const activeFiltersCount = (filters.categories.length > 1 ? filters.categories.length - 1 : 0) + (filters.minPrice > 0 ? 1 : 0) + (filters.maxPrice < 999999 ? 1 : 0) + (filters.rating > 0 ? 1 : 0) + (filters.inStock ? 1 : 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto px-4 py-6"
    >
      {/* Category Hero Banner */}
      <div className="w-full bg-gradient-to-r from-blue-100 to-indigo-50 rounded-sm p-6 mb-6 flex flex-col items-center justify-center text-center shadow-sm border border-blue-200">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{category?.name || 'Category'}</h1>
        <p className="text-gray-600 text-sm">Explore top products, new arrivals, and best sellers</p>
      </div>

      {/* Breadcrumbs */}
      <div className="text-xs text-text-secondary mb-4 flex items-center gap-2">
        <Link href="/" className="hover:text-primary">Home</Link>
        <ChevronRight size={12} />
        <Link href="/products" className="hover:text-primary">Products</Link>
        <ChevronRight size={12} />
        <span className="text-text-primary font-medium">{category?.name || slug}</span>
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
              <span>
                Showing {data ? (page - 1) * limit + 1 : 0}–{data ? Math.min(page * limit, data.total) : 0} of {data?.total || 0} products
              </span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
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

          {/* simple pagination next prev */}
          {!isLoading && data?.data && data.data.length > 0 && totalPages > 1 && (
            <div className="mt-8 mb-12 flex items-center justify-center gap-4">
              <button
                onClick={() => handlePageChange(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-6 py-2 bg-white border border-gray-300 font-bold rounded-sm disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm font-bold">Page {page} of {totalPages}</span>
              <button
                onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-6 py-2 bg-white border border-gray-300 font-bold rounded-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter */}
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
                  onClick={() => setFilters({ categories: [slug], minPrice: 0, maxPrice: 999999, rating: 0, inStock: false })}
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
