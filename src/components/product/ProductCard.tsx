'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart, ShoppingCart, Check } from 'lucide-react'
import { useSelector } from 'react-redux'
import { Product } from '../../types'
import { formatPrice } from '../../lib/utils'
import { RatingStars } from '../ui/RatingStars'
import { selectIsInCart } from '../../store/selectors/cartSelectors'
import { selectIsInWishlist } from '../../store/selectors/wishlistSelectors'
import { useAddToCart } from '@/hooks/useCart'
import { useAddToWishlist, useRemoveFromWishlist } from '@/hooks/useWishlist'

interface ProductCardProps {
  product: Product
  showAddToCart?: boolean
}

export function ProductCard({ product, showAddToCart = true }: ProductCardProps) {
  const isInCart = useSelector(selectIsInCart(product.id))
  const isInWishlist = useSelector(selectIsInWishlist(product.id))

  const addToCartMutation = useAddToCart()
  const addToWishlistMutation = useAddToWishlist()
  const removeFromWishlistMutation = useRemoveFromWishlist()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isInCart) return
    addToCartMutation.mutate({ product, quantity: 1 })
  }

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isInWishlist) {
      removeFromWishlistMutation.mutate(product.id)
    } else {
      addToWishlistMutation.mutate(product)
    }
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-sm border border-gray-100 shadow-sm hover:shadow-lg flex flex-col h-full overflow-hidden"
    >
      <Link href={`/products/${product.slug}`} className="flex flex-col h-full relative group">

        {/* Image Area */}
        <div className="relative aspect-square w-full overflow-hidden bg-gray-50 flex-shrink-0">
          <Image
            src={product.images[0] || 'https://picsum.photos/400'}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            unoptimized
          />

          {/* Wishlist Button */}
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={handleWishlistToggle}
            className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-sm text-gray-400 hover:text-accent transition-colors z-10"
          >
            <Heart size={18} className={isInWishlist ? "fill-accent text-accent" : ""} />
          </motion.button>

          {/* Discount Badge */}
          {product.discount > 0 && (
            <div className="absolute top-2 left-0 bg-accent text-white text-[10px] font-bold px-2 py-0.5 shadow-sm rounded-r-full z-10">
              {product.discount}% OFF
            </div>
          )}

          {/* Out of Stock Overlay */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
              <span className="bg-white/90 text-text-primary text-xs font-bold px-3 py-1 rounded-sm uppercase tracking-wide">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="p-3 flex flex-col flex-1">
          <h3 className="text-sm font-medium text-text-primary line-clamp-2 min-h-[40px] leading-tight">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-1 mb-2">
            <RatingStars rating={product.rating} size={12} />
            <span className="text-[11px] text-text-secondary">({product.reviewCount})</span>
          </div>

          {/* Price */}
          <div className="mt-auto flex flex-col items-start gap-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-lg font-bold text-text-primary leading-none">
                {formatPrice(product.price)}
              </span>
              {product.discount > 0 && (
                <>
                  <span className="text-[13px] text-text-secondary line-through leading-none">
                    {formatPrice(product.originalPrice)}
                  </span>
                  <span className="text-[12px] font-bold text-success leading-none">
                    {product.discount}% off
                  </span>
                </>
              )}
            </div>

            {product.price > 499 ? (
              <span className="text-[11px] font-medium text-success mt-1">Free Delivery</span>
            ) : (
              <span className="text-[11px] text-text-secondary mt-1">Delivery: ₹40</span>
            )}
          </div>
        </div>
      </Link>

      {/* Action Area */}
      {showAddToCart && (
        <div className="px-3 pb-3 mt-auto flex-shrink-0">
          {isInCart ? (
            <Link
              href="/cart"
              className="w-full h-9 flex items-center justify-center gap-2 border-2 border-success text-success text-sm font-medium rounded-sm hover:bg-success hover:text-white transition-colors"
            >
              <Check size={16} /> Go to Cart
            </Link>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0 || addToCartMutation.isPending}
              className="w-full h-9 bg-primary text-white text-sm font-medium flex items-center justify-center rounded-sm hover:bg-primary-dark transition-colors disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
            >
              {addToCartMutation.isPending ? (
                <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              ) : (
                'Add to Cart'
              )}
            </button>
          )}
        </div>
      )}
    </motion.div>
  )
}

export default ProductCard
