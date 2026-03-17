'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '../../lib/utils'

interface ProductImageGalleryProps {
  images: string[]
  productName: string
}

export function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const [selectedIdx, setSelectedIdx] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    setSelectedIdx((prev) => (prev > 0 ? prev - 1 : images.length - 1))
  }

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    setSelectedIdx((prev) => (prev < images.length - 1 ? prev + 1 : 0))
  }

  // Keyboard navigation for modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isModalOpen) return
      if (e.key === 'ArrowLeft') handlePrev()
      if (e.key === 'ArrowRight') handleNext()
      if (e.key === 'Escape') setIsModalOpen(false)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isModalOpen])

  if (!images || images.length === 0) return null

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 w-full relative">
        
        {/* Thumbnails (Desktop) */}
        <div className="hidden md:flex flex-col gap-2 shrink-0">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIdx(idx)}
              className={cn(
                "w-[70px] h-[70px] border-2 rounded-sm overflow-hidden p-1 transition-colors relative bg-white",
                selectedIdx === idx ? "border-primary" : "border-gray-200 hover:border-gray-300"
              )}
            >
              <Image 
                src={img} 
                alt={`${productName} thumbnail ${idx + 1}`} 
                fill 
                className="object-contain p-1"
                sizes="70px"
              />
            </button>
          ))}
        </div>

        {/* Main Image */}
        <div 
          className="relative w-full aspect-square md:aspect-[4/3] bg-white border border-gray-100 rounded-sm overflow-hidden group cursor-zoom-in"
          onClick={() => setIsModalOpen(true)}
        >
          <Image
            src={images[selectedIdx]}
            alt={productName}
            fill
            className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 500px"
            priority
          />
          
          {/* Mobile Swipe indicators / Nav arrows */}
          <div className="md:hidden absolute inset-0 flex items-center justify-between px-2">
            <button 
              onClick={(e) => { e.stopPropagation(); handlePrev(); }}
              className="bg-white/80 rounded-full p-2 shadow-sm text-gray-700"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
              className="bg-white/80 rounded-full p-2 shadow-sm text-gray-700"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Mobile Dot Pagination */}
          <div className="md:hidden absolute bottom-4 left-0 w-full flex justify-center gap-1.5 z-10">
            {images.map((_, idx) => (
              <div 
                key={idx} 
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  selectedIdx === idx ? "w-4 bg-primary" : "w-1.5 bg-gray-300"
                )}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-4"
          >
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors z-50"
            >
              <X size={28} />
            </button>

            <div className="relative w-full max-w-4xl h-[70vh] flex items-center justify-center">
              <button 
                onClick={handlePrev}
                className="absolute left-4 z-50 text-white/50 hover:text-white p-4 hidden md:block"
              >
                <ChevronLeft size={48} />
              </button>
              
              <div className="relative w-full h-full max-w-[80vw]">
                <Image
                  src={images[selectedIdx]}
                  alt={productName}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  quality={100}
                />
              </div>

              <button 
                onClick={handleNext}
                className="absolute right-4 z-50 text-white/50 hover:text-white p-4 hidden md:block"
              >
                <ChevronRight size={48} />
              </button>
            </div>

            {/* Thumbnail Strip at bottom */}
            <div className="mt-8 flex gap-2 overflow-x-auto max-w-full px-4 no-scrollbar pb-4">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedIdx(idx)}
                  className={cn(
                    "relative w-16 h-16 shrink-0 border-2 rounded-sm overflow-hidden bg-white/5 transition-colors",
                    selectedIdx === idx ? "border-primary" : "border-transparent opacity-50 hover:opacity-100"
                  )}
                >
                  <Image 
                    src={img} 
                    alt={`Thumb ${idx + 1}`} 
                    fill 
                    className="object-contain p-1"
                  />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default ProductImageGallery
