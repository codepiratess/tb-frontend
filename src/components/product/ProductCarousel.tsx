'use client'

import React, { useRef } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Product } from '../../types'
import { ProductCard } from './ProductCard'
import { ProductCardSkeleton } from '../ui/Skeleton'

interface ProductCarouselProps {
  title: string
  products: Product[]
  viewAllLink?: string
  isLoading?: boolean
}

export function ProductCarousel({ 
  title, 
  products, 
  viewAllLink, 
  isLoading = false 
}: ProductCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -800, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 800, behavior: 'smooth' })
    }
  }

  return (
    <div className="w-full relative group bg-white p-4 rounded-sm shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg md:text-xl font-bold text-text-primary">{title}</h2>
        {viewAllLink && (
          <Link 
            href={viewAllLink}
            className="text-primary text-sm font-semibold hover:opacity-80 transition-opacity"
          >
            VIEW ALL
          </Link>
        )}
      </div>

      <div className="relative">
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-4 snap-x snap-mandatory no-scrollbar pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="min-w-[180px] md:min-w-[220px] snap-start shrink-0">
                <ProductCardSkeleton />
              </div>
            ))
          ) : (
            products.map((product) => (
              <div key={product.id} className="w-[180px] md:w-[220px] snap-start shrink-0 h-full">
                <ProductCard product={product} />
              </div>
            ))
          )}
        </div>

        {/* Scroll Buttons (Desktop Only) */}
        {!isLoading && products.length > 0 && (
          <>
            <button 
              onClick={scrollLeft}
              className="absolute left-0 top-1/2 -translate-y-1/2 -mt-4 w-10 h-20 bg-white shadow-[2px_0_8px_rgba(0,0,0,0.1)] rounded-r-md flex items-center justify-center text-text-primary opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 z-10 hidden md:flex"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={scrollRight}
              className="absolute right-0 top-1/2 -translate-y-1/2 -mt-4 w-10 h-20 bg-white shadow-[-2px_0_8px_rgba(0,0,0,0.1)] rounded-l-md flex items-center justify-center text-text-primary opacity-0 group-hover:opacity-100 transition-opacity z-10 hidden md:flex"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}

export default ProductCarousel
