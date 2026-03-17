'use client'

import React, { useRef } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Smartphone, Tv, Shirt, Home, Sparkles, 
  Dumbbell, BookOpen, Gamepad2, ShoppingBasket, 
  Armchair, Zap, Footprints, ChevronLeft, ChevronRight
} from 'lucide-react'
import { CATEGORY_LIST } from '../../constants'

const getCategoryDetails = (slug: string) => {
  switch (slug) {
    case 'mobiles': return { icon: Smartphone, bg: 'bg-blue-50', color: 'text-blue-600' }
    case 'electronics': return { icon: Tv, bg: 'bg-indigo-50', color: 'text-indigo-600' }
    case 'clothing': return { icon: Shirt, bg: 'bg-pink-50', color: 'text-pink-600' }
    case 'footwear': return { icon: Footprints, bg: 'bg-orange-50', color: 'text-orange-600' }
    case 'home-kitchen': return { icon: Home, bg: 'bg-teal-50', color: 'text-teal-600' }
    case 'beauty': return { icon: Sparkles, bg: 'bg-purple-50', color: 'text-purple-600' }
    case 'sports': return { icon: Dumbbell, bg: 'bg-red-50', color: 'text-red-600' }
    case 'books': return { icon: BookOpen, bg: 'bg-yellow-50', color: 'text-yellow-600' }
    case 'toys': return { icon: Gamepad2, bg: 'bg-green-50', color: 'text-green-600' }
    case 'grocery': return { icon: ShoppingBasket, bg: 'bg-lime-50', color: 'text-lime-600' }
    case 'furniture': return { icon: Armchair, bg: 'bg-amber-50', color: 'text-amber-600' }
    case 'appliances': return { icon: Zap, bg: 'bg-cyan-50', color: 'text-cyan-600' }
    default: return { icon: ShoppingBasket, bg: 'bg-gray-50', color: 'text-gray-600' }
  }
}

export function CategoryStrip() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

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

  // Use up to 12 categories
  const categories = CATEGORY_LIST.slice(0, 12)

  return (
    <div className="w-full bg-white py-6 relative group border-b border-gray-100">
      <div className="container mx-auto px-4 relative">
        <div 
          ref={scrollContainerRef}
          className="flex items-start justify-start lg:justify-center overflow-x-auto gap-4 md:gap-8 pb-4 snap-x snap-mandatory no-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.map((cat) => {
            const { icon: Icon, bg, color } = getCategoryDetails(cat.slug)
            return (
              <Link 
                key={cat.slug} 
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
                <span className="text-xs font-medium text-text-primary text-center px-1 whitespace-nowrap group-hover/item:text-primary transition-colors">
                  {cat.name}
                </span>
              </Link>
            )
          })}
        </div>

        {/* Scroll Arrows (Desktop) */}
        <button 
          onClick={scrollLeft}
          className="absolute left-0 top-8 w-8 h-8 bg-white shadow-md rounded-full flex items-center justify-center text-text-secondary hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 z-10 hidden lg:flex"
        >
          <ChevronLeft size={20} />
        </button>
        <button 
          onClick={scrollRight}
          className="absolute right-0 top-8 w-8 h-8 bg-white shadow-md rounded-full flex items-center justify-center text-text-secondary hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity z-10 hidden lg:flex"
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
