'use client'

import React, { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { useSearchProducts } from '../../../hooks/useProducts'
import { ProductGrid } from '../../../components/product/ProductGrid'

function SearchContent() {
  const searchParams = useSearchParams()
  const q = searchParams.get('q') || ''

  const { data, isLoading } = useSearchProducts(q)

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto px-4 py-8 min-h-[60vh]"
    >
      <div className="text-xs text-text-secondary mb-4 flex items-center gap-2">
        <Link href="/" className="hover:text-primary">Home</Link>
        <ChevronRight size={12} />
        <span className="text-text-primary font-medium">Search</span>
      </div>

      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
        {q ? `Results for "${q}"` : "Enter something to search"}
      </h1>

      {q && !isLoading && data?.data.length === 0 && (
        <div className="mb-8">
          <p className="text-gray-600 mb-4">Did you mean: </p>
          <div className="flex gap-2">
            <Link href="/search?q=phone" className="px-4 py-2 bg-gray-100 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors">phone</Link>
            <Link href="/search?q=laptop" className="px-4 py-2 bg-gray-100 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors">laptop</Link>
            <Link href="/search?q=shirt" className="px-4 py-2 bg-gray-100 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors">shirt</Link>
          </div>
        </div>
      )}

      {q && (
        <ProductGrid 
          products={data?.data || []} 
          isLoading={isLoading} 
          emptyMessage={`Sorry, no results found!`}
        />
      )}
    </motion.div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="container mx-auto py-20 text-center">Loading search...</div>}>
      <SearchContent />
    </Suspense>
  )
}
