'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShoppingCart, Heart } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { Product } from '../../types'
import { formatPrice } from '../../lib/utils'
import { RatingStars } from '../ui/RatingStars'
import { addToCart } from '../../store/slices/cartSlice'
import { addToWishlist, removeFromWishlist } from '../../store/slices/wishlistSlice'
import { selectIsInWishlist } from '../../store/selectors/wishlistSelectors'
import { useFeaturedProducts } from '../../hooks/useProducts'

export function DealOfTheDay() {
  const dispatch = useDispatch()
  const { data: products } = useFeaturedProducts()
  const dealProduct = products?.[0] as Product | undefined

  const isInWishlist = useSelector(dealProduct ? selectIsInWishlist(dealProduct.id) : () => false)

  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59
  })

  // Timer logic
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 }
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 }
        return { hours: 23, minutes: 59, seconds: 59 } // Reset daily
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  if (!dealProduct) return null

  const handleAddToCart = () => {
    dispatch(addToCart({ product: dealProduct, quantity: 1 }))
    toast.success('Added to cart!')
  }

  const handleWishlistToggle = () => {
    if (isInWishlist) {
      dispatch(removeFromWishlist(dealProduct.id))
    } else {
      dispatch(addToWishlist(dealProduct))
      toast.success('Added to wishlist!')
    }
  }

  const savings = dealProduct.originalPrice - dealProduct.price

  return (
    <div className="w-full bg-[#f0f5ff] rounded-sm overflow-hidden shadow-sm border border-blue-100 flex flex-col md:flex-row my-8 relative">
      
      {/* Left Column: Timer */}
      <div className="md:w-1/3 bg-primary p-6 md:p-8 flex flex-col justify-center items-center text-center text-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
        
        <h2 className="text-3xl md:text-4xl font-bold mb-2 z-10">Deal of the Day 🔥</h2>
        <p className="text-white/80 mb-6 z-10">Hurry up! Offer ends in:</p>
        
        <div className="flex items-center gap-3 z-10">
          <div className="bg-white text-primary w-16 h-16 rounded-md flex flex-col items-center justify-center shadow-[0_4px_10px_rgba(0,0,0,0.2)]">
            <span className="text-2xl font-bold">{timeLeft.hours.toString().padStart(2, '0')}</span>
            <span className="text-[10px] font-bold uppercase tracking-wide">Hours</span>
          </div>
          <span className="text-2xl font-bold">:</span>
          <div className="bg-white text-primary w-16 h-16 rounded-md flex flex-col items-center justify-center shadow-[0_4px_10px_rgba(0,0,0,0.2)]">
            <span className="text-2xl font-bold">{timeLeft.minutes.toString().padStart(2, '0')}</span>
            <span className="text-[10px] font-bold uppercase tracking-wide">Mins</span>
          </div>
          <span className="text-2xl font-bold">:</span>
          <div className="bg-white text-primary w-16 h-16 rounded-md flex flex-col items-center justify-center shadow-[0_4px_10px_rgba(0,0,0,0.2)]">
            <span className="text-2xl font-bold">{timeLeft.seconds.toString().padStart(2, '0')}</span>
            <span className="text-[10px] font-bold uppercase tracking-wide">Secs</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="md:w-2/3 p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center bg-white/50 backdrop-blur-sm z-10">
        
        {/* Image */}
        <Link href={`/products/${dealProduct.slug}`} className="relative w-full md:w-1/2 aspect-square max-w-[300px] bg-white rounded-md shadow-sm border border-gray-100 flex-shrink-0 group">
          <Image
            src={dealProduct.images[0] || 'https://picsum.photos/400'}
            alt={dealProduct.name}
            fill
            unoptimized
            className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute top-4 left-4 bg-accent text-white px-3 py-1 text-sm font-bold rounded-full shadow-md z-10">
            {dealProduct.discount}% OFF
          </div>
        </Link>
        
        {/* Details */}
        <div className="w-full md:w-1/2 flex flex-col justify-center">
          <Link href={`/products/${dealProduct.slug}`} className="group inline-block w-fit">
            <h3 className="text-2xl font-bold text-text-primary mb-2 group-hover:text-primary transition-colors line-clamp-2">
              {dealProduct.name}
            </h3>
          </Link>

          <div className="flex items-center gap-2 mb-4">
            <RatingStars rating={dealProduct.rating} size={16} />
            <span className="text-sm text-text-secondary">({dealProduct.reviewCount} reviews)</span>
          </div>

          <div className="mb-6">
            <div className="flex items-end gap-3 mb-1">
              <span className="text-3xl font-bold text-text-primary">{formatPrice(dealProduct.price)}</span>
              <span className="text-lg text-text-secondary line-through mb-1">{formatPrice(dealProduct.originalPrice)}</span>
            </div>
            {savings > 0 && (
              <span className="text-sm font-semibold text-success">
                You save {formatPrice(savings)}!
              </span>
            )}
          </div>

          {/* Stock Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-1.5">
              <span className="font-medium text-text-secondary">Available Stock</span>
              <span className="font-bold text-accent">Only {dealProduct.stock} left!</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (dealProduct.stock / 100) * 100)}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-accent rounded-full"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleAddToCart}
              disabled={dealProduct.stock === 0}
              className="flex-1 bg-primary text-white h-12 rounded-sm font-bold flex items-center justify-center gap-2 hover:bg-primary-dark transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart size={20} /> Add to Cart
            </button>
            <button
              onClick={handleWishlistToggle}
              className="w-12 h-12 bg-white border border-gray-200 text-gray-500 rounded-sm flex items-center justify-center hover:bg-gray-50 hover:text-accent transition-colors shadow-sm"
            >
              <Heart size={20} className={isInWishlist ? "fill-accent text-accent" : ""} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DealOfTheDay
