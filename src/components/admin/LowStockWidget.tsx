'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AlertTriangle, Plus } from 'lucide-react'
import { Product } from '@/types'
import { Skeleton } from '@/components/ui/Skeleton'
import { Badge } from '@/components/ui/Badge'

interface LowStockWidgetProps {
  products: Product[] | undefined
  isLoading: boolean
}

export const LowStockWidget: React.FC<LowStockWidgetProps> = ({ products, isLoading }) => {
  const lowStockCount = products?.length || 0

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-full">
        <Skeleton className="h-6 w-48 mb-6" />
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/4" />
              </div>
              <Skeleton className="h-8 w-16 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-bold text-gray-900 font-primary">Low Stock Alert</h3>
          <AlertTriangle className="text-orange-500" size={20} />
        </div>
        <Badge variant="warning" className="bg-orange-50 text-orange-600 border-none font-bold">
          {lowStockCount} items
        </Badge>
      </div>

      <div className="flex-1 space-y-4">
        {products?.slice(0, 4).map((product) => (
          <div key={product.id} className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-gray-50 flex-shrink-0">
              <Image 
                src={product.images[0]} 
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{product.name}</p>
              <p className="text-xs font-bold text-red-600">Only {product.stock} left</p>
            </div>
            <button className="px-3 py-1.5 text-xs font-bold text-[#2874F0] border border-[#2874F0] rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-1">
              <Plus size={12} /> Restock
            </button>
          </div>
        ))}
        
        {lowStockCount === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mb-3">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
            <p className="text-sm font-medium text-gray-900">All systems go!</p>
            <p className="text-xs text-gray-500">Inventory levels are healthy.</p>
          </div>
        )}
      </div>

      {lowStockCount > 0 && (
        <Link 
          href="/admin/products?filter=low-stock"
          className="mt-6 text-center text-sm font-semibold text-[#2874F0] hover:underline"
        >
          View All Low Stock
        </Link>
      )}
    </div>
  )
}
