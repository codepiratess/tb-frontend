'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '../../lib/utils'

const BANNERS = [
  {
    id: 1,
    title: 'Electronics Sale',
    subtitle: 'Up to 70% Off',
    description: 'Shop Mobiles, Laptops & More',
    buttonText: 'Shop Now',
    link: '/category/electronics',
    bgClasses: 'bg-gradient-to-r from-[#2874F0] to-[#1a5dc8]',
  },
  {
    id: 2,
    title: 'Fashion Week',
    subtitle: 'New Arrivals',
    description: 'Trendy Clothing & Footwear',
    buttonText: 'Explore Now',
    link: '/category/clothing',
    bgClasses: 'bg-gradient-to-r from-[#FF6B35] to-[#FF4500]',
  },
  {
    id: 3,
    title: 'Home Essentials',
    subtitle: 'Starting ₹199',
    description: 'Kitchen, Furniture & Decor',
    buttonText: 'Browse Now',
    link: '/category/home-kitchen',
    bgClasses: 'bg-gradient-to-r from-[#7C3AED] to-[#5B21B6]',
  }
]

export function HeroBanner() {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    setCurrentIdx((prev) => (prev > 0 ? prev - 1 : BANNERS.length - 1))
  }

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    setCurrentIdx((prev) => (prev < BANNERS.length - 1 ? prev + 1 : 0))
  }

  useEffect(() => {
    if (isPaused) return
    const interval = setInterval(handleNext, 4000)
    return () => clearInterval(interval)
  }, [isPaused, currentIdx])

  const banner = BANNERS[currentIdx]

  return (
    <div 
      className="relative w-full h-[250px] md:h-[350px] lg:h-[400px] overflow-hidden group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={banner.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className={cn("absolute inset-0 flex flex-col justify-center px-8 md:px-16 lg:px-24", banner.bgClasses)}
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-white max-w-xl"
          >
            <span className="inline-block px-3 py-1 bg-white/20 text-white text-xs md:text-sm font-bold uppercase tracking-wider rounded-sm mb-3">
              {banner.subtitle}
            </span>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              {banner.title}
            </h2>
            <p className="text-lg md:text-xl text-white/90 mb-8">
              {banner.description}
            </p>
            <Link 
              href={banner.link}
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-900 font-bold rounded-sm hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {banner.buttonText}
            </Link>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <button 
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/30 hover:bg-white/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all z-10"
      >
        <ChevronLeft size={24} />
      </button>

      <button 
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/30 hover:bg-white/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all z-10"
      >
        <ChevronRight size={24} />
      </button>

      {/* Indicators */}
      <div className="absolute top-4 right-4 bg-black/30 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium z-10">
        {currentIdx + 1} / {BANNERS.length}
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {BANNERS.map((_, idx) => (
          <button
            key={idx}
            onClick={(e) => { e.stopPropagation(); setCurrentIdx(idx); }}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              currentIdx === idx ? "w-8 bg-white" : "w-2 bg-white/50 hover:bg-white/80"
            )}
          />
        ))}
      </div>
    </div>
  )
}

export default HeroBanner
