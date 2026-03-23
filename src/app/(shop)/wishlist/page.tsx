'use client'

import React from 'react'
import { useSelector } from 'react-redux'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Trash2 } from 'lucide-react'
import { RootState } from '@/store'
import { ProductCard } from '@/components/product/ProductCard'
import { useRemoveFromWishlist } from '@/hooks/useWishlist'

export default function WishlistPage() {
  const { items } = useSelector((state: RootState) => state.wishlist)
  const removeFromWishlistMutation = useRemoveFromWishlist()

  const handleRemove = (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    removeFromWishlistMutation.mutate(id)
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        
        <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-4 mb-6">
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            My Wishlist <span className="text-gray-500 font-normal">({items.length} items)</span>
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-12 flex flex-col items-center justify-center text-center">
            <Heart size={80} className="text-gray-200 mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Empty Wishlist</h2>
            <p className="text-gray-500 mb-8 max-w-md">You have no items in your wishlist. Start adding items you love!</p>
            <Link 
              href="/products" 
              className="px-8 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-sm shadow-sm transition-colors"
            >
              Discover Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <AnimatePresence>
              {items.map((product) => (
                <motion.div 
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="relative group"
                >
                  <ProductCard product={product} />
                  
                  {/* Delete Overlay Button */}
                  <button 
                    onClick={(e) => handleRemove(product.id, e)}
                    disabled={removeFromWishlistMutation.isPending}
                    className="absolute top-2 left-2 z-20 w-8 h-8 bg-white/80 backdrop-blur text-gray-500 hover:text-error rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                    title="Remove from wishlist"
                  >
                    <Trash2 size={16} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

      </div>
    </div>
  )
}
