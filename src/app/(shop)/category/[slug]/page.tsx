'use client'

import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { publicApi } from '@/lib/api'
import { useState } from 'react'
import { ProductGrid } from '@/components/product/ProductGrid'
import { ProductFilters } from '@/components/product/ProductFilters'
import Link from 'next/link'

export default function CategoryPage() {
  const params = useParams()
  const slug = params.slug as string
  
  const [filters, setFilters] = useState({
    categories: [slug],
    minPrice: 0,
    maxPrice: 999999,
    rating: 0,
    inStock: false,
    sortBy: 'createdAt',
    sortOrder: 'DESC' as 'ASC' | 'DESC',
    page: 1,
    limit: 20,
  })

  // Step 1: Fetch category by slug
  const { data: categoryData } = useQuery({
    queryKey: ['category', slug],
    queryFn: async () => {
      const res = await publicApi.get(
        `/categories/${slug}`
      )
      return res.data.data
    },
    enabled: !!slug,
  })

  // Step 2: Fetch products by categorySlug
  const { 
    data: productsData, 
    isLoading 
  } = useQuery({
    queryKey: ['products', 'category', 
      slug, filters],
    queryFn: async () => {
      const { rating, categories, ...otherFilters } = filters;
      const res = await publicApi.get(
        '/products',
        {
          params: {
            categorySlug: slug,
            ...otherFilters,
            minRating: rating,
          }
        }
      )
      return res.data.data
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  })

  const products = productsData?.data || []
  const total = productsData?.total || 0
  const totalPages = 
    productsData?.totalPages || 1

  const categoryName = categoryData?.name 
    || slug.charAt(0).toUpperCase() 
    + slug.slice(1)

  return (
    <div className="min-h-screen bg-[#F1F3F6]">
      
      {/* Category Hero Banner */}
      <div className="bg-gradient-to-r from-[#2874F0] to-[#1a5dc8] text-white py-10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-2">
            {categoryName}
          </h1>
          <p className="text-blue-100">
            {total} products found
          </p>
          {/* Breadcrumb */}
          <div className="flex items-center justify-center gap-2 mt-3 text-blue-200 text-sm">
            <Link href="/">Home</Link>
            <span>›</span>
            <span className="text-white">
              {categoryName}
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          
          {/* Filters Sidebar */}
          <div className="hidden lg:block w-64 shrink-0">
            <ProductFilters
              filters={filters as any}
              onFilterChange={(newFilters) => {
                setFilters(prev => ({
                  ...prev,
                  ...newFilters,
                  page: 1,
                }))
              }}
            />
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Sort Bar */}
            <div className="bg-white rounded-lg p-4 mb-4 flex items-center justify-between shadow-sm">
              <p className="text-sm text-gray-600">
                Showing {products.length} of{' '}
                {total} products in{' '}
                <strong>{categoryName}</strong>
              </p>
              <select
                value={`${filters.sortBy}-${filters.sortOrder}`}
                onChange={(e) => {
                  const [sortBy, sortOrder] = 
                    e.target.value.split('-')
                  setFilters(prev => ({
                    ...prev,
                    sortBy,
                    sortOrder: sortOrder as 
                      'ASC' | 'DESC',
                    page: 1,
                  }))
                }}
                className="text-sm border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2874F0]"
              >
                <option value="createdAt-DESC">
                  Newest First
                </option>
                <option value="price-ASC">
                  Price: Low to High
                </option>
                <option value="price-DESC">
                  Price: High to Low
                </option>
                <option value="rating-DESC">
                  Top Rated
                </option>
                <option value="soldCount-DESC">
                  Most Popular
                </option>
              </select>
            </div>

            {/* Product Grid */}
            <ProductGrid
              products={products}
              isLoading={isLoading}
              emptyMessage={
                `No products found in ${categoryName}. Try clearing filters.`
              }
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                {Array.from(
                  { length: totalPages }, 
                  (_, i) => i + 1
                ).map(pageNum => (
                  <button
                    key={pageNum}
                    onClick={() => 
                      setFilters(prev => ({
                        ...prev, 
                        page: pageNum
                      }))
                    }
                    className={`w-10 h-10 rounded-lg font-medium transition-colors
                      ${filters.page === pageNum
                        ? 'bg-[#2874F0] text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-50'
                      }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
