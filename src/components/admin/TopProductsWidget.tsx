'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Skeleton } from '@/components/ui/Skeleton'

interface TopProduct {
  id: string
  name: string
  category: { name: string }
  images: string[]
  unitsSold: number
  totalRevenue: number
}

interface TopProductsWidgetProps {
  products: TopProduct[] | undefined
  isLoading: boolean
  limit?: number
}

export const TopProductsWidget: React.FC<TopProductsWidgetProps> = ({ 
  products, 
  isLoading,
  limit = 5
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price)
  }

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <Skeleton className="h-6 w-48 mb-6" />
        <div className="space-y-6">
          {Array.from({ length: limit }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-10 w-10 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-full flex flex-col">
      <h3 className="text-lg font-bold text-gray-900 mb-6 font-primary">Top Selling Products</h3>
      
      <div className="flex-1 space-y-6">
        {products?.slice(0, limit).map((product, index) => (
          <div key={product.id} className="flex items-center gap-4 group">
            <span className="text-sm font-bold text-gray-400 w-4">{index + 1}</span>
            <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-gray-50 bg-gray-50 flex-shrink-0">
              <Image 
                src={product.images[0]} 
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-[#2874F0] transition-colors">
                {product.name}
              </p>
              <p className="text-xs text-gray-400 truncate">{product.category.name}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-gray-900">{product.unitsSold}</p>
              <p className="text-[11px] font-bold text-[#2874F0]">{formatPrice(product.totalRevenue)}</p>
            </div>
          </div>
        ))}
      </div>

      <Link 
        href="/admin/products"
        className="mt-8 text-center text-sm font-semibold text-[#2874F0] hover:underline"
      >
        View All Products
      </Link>
    </div>
  )
}
