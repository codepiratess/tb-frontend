'use client'

import React, { useRef } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Smartphone, Tv, Shirt, Home, Sparkles, 
  Dumbbell, BookOpen, Gamepad2, ShoppingBasket, 
  Armchair, Zap, Footprints, ChevronLeft, ChevronRight,
  Tag
} from 'lucide-react'
import { useCategories } from '@/hooks/useCategories'

const getCategoryIcon = (slug: string) => {
  const icons: Record<string, any> = {
    'mobiles': { icon: Smartphone, bg: 'bg-blue-50', color: 'text-blue-600' },
    'electronics': { icon: Tv, bg: 'bg-indigo-50', color: 'text-indigo-600' },
    'clothing': { icon: Shirt, bg: 'bg-pink-50', color: 'text-pink-600' },
    'footwear': { icon: Footprints, bg: 'bg-orange-50', color: 'text-orange-600' },
    'home-kitchen': { icon: Home, bg: 'bg-teal-50', color: 'text-teal-600' },
    'beauty': { icon: Sparkles, bg: 'bg-purple-50', color: 'text-purple-600' },
    'sports': { icon: Dumbbell, bg: 'bg-red-50', color: 'text-red-600' },
    'books': { icon: BookOpen, bg: 'bg-yellow-50', color: 'text-yellow-600' },
    'toys': { icon: Gamepad2, bg: 'bg-green-50', color: 'text-green-600' },
    'grocery': { icon: ShoppingBasket, bg: 'bg-lime-50', color: 'text-lime-600' },
    'furniture': { icon: Armchair, bg: 'bg-amber-50', color: 'text-amber-600' },
    'appliances': { icon: Zap, bg: 'bg-cyan-50', color: 'text-cyan-600' },
  }
  return icons[slug] || { icon: Tag, bg: 'bg-gray-50', color: 'text-gray-600' }
}

export function CategoryStrip() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const { data: categories, isLoading } = useCategories()

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -400, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 400, behavior: 'smooth' })
    }
  }

  if (isLoading) {
    return (
      <div className="w-full bg-white py-6 border-b border-gray-100 italic text-center text-slate-400 text-xs font-bold uppercase tracking-widest">
        Loading Categories...
      </div>
    )
  }

  if (!Array.isArray(categories) || categories.length === 0) return null

  return (
    <div className="w-full bg-white py-6 relative group border-b border-gray-100">
      <div className="container mx-auto px-4 relative">
        <div 
          ref={scrollContainerRef}
          className="flex items-start justify-start lg:justify-center overflow-x-auto gap-4 md:gap-8 pb-4 snap-x snap-mandatory no-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.map((cat: any) => {
            const { icon: Icon, bg, color } = getCategoryIcon(cat.slug)
            return (
              <Link 
                key={cat.id} 
                href={`/category/${cat.slug}`}
                className="flex flex-col items-center gap-3 min-w-[70px] snap-center group/item"
              >
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${bg} group-hover/item:shadow-md`}
                >
                  <Icon size={28} className={color} strokeWidth={1.5} />
                </motion.div>
                <span className="text-xs font-bold text-gray-900 text-center px-1 whitespace-nowrap group-hover/item:text-[#2874F0] transition-colors">
                  {cat.name}
                </span>
              </Link>
            )
          })}
        </div>

        {/* Scroll Arrows */}
        <button 
          onClick={scrollLeft}
          className="absolute left-0 top-8 w-8 h-8 bg-white shadow-md rounded-full flex items-center justify-center text-gray-400 hover:text-[#2874F0] opacity-0 group-hover:opacity-100 transition-opacity z-10 hidden lg:flex"
        >
          <ChevronLeft size={20} />
        </button>
        <button 
          onClick={scrollRight}
          className="absolute right-0 top-8 w-8 h-8 bg-white shadow-md rounded-full flex items-center justify-center text-gray-400 hover:text-[#2874F0] opacity-0 group-hover:opacity-100 transition-opacity z-10 hidden lg:flex"
        >
          <ChevronRight size={20} />
        </button>
      </div>
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}

export default CategoryStrip
