'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { cn } from '../../lib/utils'
import { useBanners } from '@/hooks/useBanners'

const FALLBACK_GRIADIENTS = [
  'from-[#2874F0] to-[#1a5dc8]',
  'from-[#FF6B35] to-[#FF4500]',
  'from-[#7C3AED] to-[#5B21B6]',
  'from-[#059669] to-[#065F46]',
  'from-[#DC2626] to-[#991B1B]',
  'from-[#0891B2] to-[#164E63]',
]

export function HeroBanner() {
  const { data: bannersData, isLoading } = useBanners(true)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const banners = useMemo(() => {
    if (!bannersData || !Array.isArray(bannersData)) return []
    return bannersData.map((b: any, index: number) => ({
      ...b,
      // Assign a consistent "random" fallback gradient based on index if bgColor is not provided
      randomBg: FALLBACK_GRIADIENTS[index % FALLBACK_GRIADIENTS.length]
    }))
  }, [bannersData])

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    setCurrentIdx((prev) => (prev > 0 ? prev - 1 : banners.length - 1))
  }

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    setCurrentIdx((prev) => (prev < banners.length - 1 ? prev + 1 : 0))
  }

  useEffect(() => {
    if (isPaused || banners.length <= 1) return
    const interval = setInterval(handleNext, 5000)
    return () => clearInterval(interval)
  }, [isPaused, currentIdx, banners.length])

  if (isLoading) {
    return (
      <div className="w-full h-[250px] md:h-[350px] lg:h-[400px] bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    )
  }

  if (banners.length === 0) return null

  const banner = banners[currentIdx]

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
          className={cn(
            "absolute inset-0 flex flex-col justify-center px-8 md:px-16 lg:px-24",
            !banner.image && (banner.bgColor ? `bg-gradient-to-r ${banner.bgColor}` : `bg-gradient-to-r ${banner.randomBg}`)
          )}
          style={banner.image ? {
            backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.4), rgba(0,0,0,0.1)), url(${banner.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          } : {}}
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-white max-w-xl z-10"
          >
            {banner.subtitle && (
              <span className="inline-block px-3 py-1 bg-white/20 text-white text-xs md:text-sm font-bold uppercase tracking-wider rounded-sm mb-3 backdrop-blur-sm">
                {banner.subtitle}
              </span>
            )}
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight drop-shadow-md">
              {banner.title}
            </h2>
            {banner.description && (
              <p className="text-lg md:text-xl text-white/90 mb-8 line-clamp-2 drop-shadow-sm">
                {banner.description}
              </p>
            )}
            {banner.buttonLink && (
              <Link
                href={banner.buttonLink}
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-900 font-bold rounded-sm hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {banner.buttonText || 'Shop Now'}
              </Link>
            )}
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      {banners.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-black/20 hover:bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all z-20"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-black/20 hover:bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all z-20"
          >
            <ChevronRight size={24} />
          </button>

          {/* Indicators */}
          <div className="absolute top-4 right-4 bg-black/30 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium z-20">
            {currentIdx + 1} / {banners.length}
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {banners.map((_: any, idx: number) => (
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
        </>
      )}
    </div>
  )
}

export default HeroBanner
