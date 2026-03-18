'use client'

import React from 'react'
import { Package } from 'lucide-react'
import { Product } from '../../types'
import { ProductCard } from './ProductCard'
import { ProductCardSkeleton } from '../ui/Skeleton'

interface ProductGridProps {
  products: Product[]
  isLoading: boolean
  emptyMessage?: string
}

export function ProductGrid({
  products,
  isLoading,
  emptyMessage = "No products found"
}: ProductGridProps) {

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {Array.from({ length: 10 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="w-full py-20 flex flex-col items-center justify-center text-center bg-white rounded-sm border border-gray-100 shadow-sm">
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-4">
          <Package size={48} className="text-gray-300" />
        </div>
        <h3 className="text-lg font-semibold text-text-primary mb-2">{emptyMessage}</h3>
        <p className="text-text-secondary text-sm">Try adjusting your filters or search query.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

export default ProductGrid
