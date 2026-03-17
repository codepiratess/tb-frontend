'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Star } from 'lucide-react'
import { CATEGORY_LIST } from '../../constants'
import { cn } from '../../lib/utils'

export interface FilterState {
  categories: string[]
  minPrice: number
  maxPrice: number
  rating: number
  inStock: boolean
}

interface ProductFiltersProps {
  filters: FilterState
  onFilterChange: (filters: FilterState) => void
}

const PRICE_RANGES = [
  { label: 'Under ₹500', min: 0, max: 500 },
  { label: '₹500 - ₹1000', min: 500, max: 1000 },
  { label: '₹1000 - ₹5000', min: 1000, max: 5000 },
  { label: 'Above ₹5000', min: 5000, max: 999999 },
]

export function ProductFilters({ filters, onFilterChange }: ProductFiltersProps) {
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    price: true,
    rating: true,
    availability: true,
  })

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const handleCategoryChange = (slug: string) => {
    const newCategories = filters.categories.includes(slug)
      ? filters.categories.filter(c => c !== slug)
      : [...filters.categories, slug]
    
    onFilterChange({ ...filters, categories: newCategories })
  }

  const hasActiveFilters = filters.categories.length > 0 || 
    filters.minPrice > 0 || filters.maxPrice < 999999 || 
    filters.rating > 0 || filters.inStock

  const clearAllFilters = () => {
    onFilterChange({
      categories: [],
      minPrice: 0,
      maxPrice: 999999,
      rating: 0,
      inStock: false
    })
  }

  return (
    <div className="bg-white rounded-sm shadow-sm border border-gray-100 flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
        <h2 className="font-bold text-lg text-text-primary">Filters</h2>
        {hasActiveFilters && (
          <button 
            onClick={clearAllFilters}
            className="text-primary text-xs font-medium uppercase hover:underline"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto w-full custom-scrollbar">
        
        {/* Categories */}
        <div className="border-b border-gray-100">
          <button 
            className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors"
            onClick={() => toggleSection('categories')}
          >
            <span className="font-semibold text-sm text-text-primary uppercase tracking-wide">Categories</span>
            <ChevronDown size={16} className={cn("text-gray-400 transition-transform", expandedSections.categories && "rotate-180")} />
          </button>
          
          <AnimatePresence>
            {expandedSections.categories && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden bg-white"
              >
                <div className="px-4 pb-4 space-y-2 max-h-[250px] overflow-y-auto custom-scrollbar">
                  {CATEGORY_LIST.map((cat) => (
                    <label key={cat.slug} className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center justify-center w-4 h-4">
                        <input
                          type="checkbox"
                          checked={filters.categories.includes(cat.slug)}
                          onChange={() => handleCategoryChange(cat.slug)}
                          className="peer appearance-none w-4 h-4 border border-gray-300 rounded-[2px] checked:bg-primary checked:border-primary transition-colors cursor-pointer shrink-0"
                        />
                        <svg className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100" viewBox="0 0 14 10" fill="none">
                          <path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <span className="text-sm text-text-primary group-hover:text-primary transition-colors line-clamp-1">{cat.name}</span>
                    </label>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Price */}
        <div className="border-b border-gray-100">
          <button 
            className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors"
            onClick={() => toggleSection('price')}
          >
            <span className="font-semibold text-sm text-text-primary uppercase tracking-wide">Price</span>
            <ChevronDown size={16} className={cn("text-gray-400 transition-transform", expandedSections.price && "rotate-180")} />
          </button>
          
          <AnimatePresence>
            {expandedSections.price && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden bg-white"
              >
                <div className="px-4 pb-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex-1">
                      <span className="text-xs text-text-secondary w-full block text-center mb-1">Min</span>
                      <div className="relative">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 text-sm">₹</span>
                        <input 
                          type="number" 
                          value={filters.minPrice || ''}
                          className="w-full h-8 pl-6 pr-2 bg-gray-50 border border-gray-200 rounded-sm text-sm outline-none focus:border-primary"
                          placeholder="0"
                          onChange={(e) => onFilterChange({...filters, minPrice: Number(e.target.value) || 0})}
                        />
                      </div>
                    </div>
                    <span className="text-gray-400 mt-4">to</span>
                    <div className="flex-1">
                      <span className="text-xs text-text-secondary w-full block text-center mb-1">Max</span>
                      <div className="relative">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 text-sm">₹</span>
                        <input 
                          type="number" 
                          value={filters.maxPrice === 999999 ? '' : filters.maxPrice}
                          className="w-full h-8 pl-6 pr-2 bg-gray-50 border border-gray-200 rounded-sm text-sm outline-none focus:border-primary"
                          placeholder="Any"
                          onChange={(e) => onFilterChange({...filters, maxPrice: Number(e.target.value) || 999999})}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mt-4">
                    {PRICE_RANGES.map((range, idx) => (
                      <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative flex items-center justify-center w-4 h-4 rounded-full border border-gray-300">
                          <input
                            type="radio"
                            name="price-range"
                            checked={filters.minPrice === range.min && filters.maxPrice === range.max}
                            onChange={() => onFilterChange({...filters, minPrice: range.min, maxPrice: range.max})}
                            className="peer appearance-none absolute inset-0 w-full h-full rounded-full cursor-pointer checked:border-primary checked:border-2 transition-all"
                          />
                          <div className="w-2 h-2 rounded-full bg-primary scale-0 peer-checked:scale-100 transition-transform" />
                        </div>
                        <span className="text-sm text-text-primary group-hover:text-primary transition-colors">{range.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Rating */}
        <div className="border-b border-gray-100">
          <button 
            className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors"
            onClick={() => toggleSection('rating')}
          >
            <span className="font-semibold text-sm text-text-primary uppercase tracking-wide">Customer Rating</span>
            <ChevronDown size={16} className={cn("text-gray-400 transition-transform", expandedSections.rating && "rotate-180")} />
          </button>
          
          <AnimatePresence>
            {expandedSections.rating && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden bg-white"
              >
                <div className="px-4 pb-4 space-y-3">
                  {[4, 3, 2].map((stars) => (
                    <label key={stars} className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center justify-center w-4 h-4 rounded-full border border-gray-300 shrink-0">
                        <input
                          type="radio"
                          name="rating-filter"
                          checked={filters.rating === stars}
                          onChange={() => onFilterChange({...filters, rating: stars})}
                          className="peer appearance-none absolute inset-0 w-full h-full rounded-full cursor-pointer checked:border-primary checked:border-2 transition-all"
                        />
                        <div className="w-2 h-2 rounded-full bg-primary scale-0 peer-checked:scale-100 transition-transform" />
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-sm text-text-primary font-medium">{stars}</span>
                        <Star size={12} className="fill-[#388e3c] text-[#388e3c]" />
                        <span className="text-sm text-text-primary">& above</span>
                      </div>
                    </label>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Availability */}
        <div>
          <button 
            className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors"
            onClick={() => toggleSection('availability')}
          >
            <span className="font-semibold text-sm text-text-primary uppercase tracking-wide">Availability</span>
            <ChevronDown size={16} className={cn("text-gray-400 transition-transform", expandedSections.availability && "rotate-180")} />
          </button>
          
          <AnimatePresence>
            {expandedSections.availability && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden bg-white"
              >
                <div className="px-4 pb-4">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center w-4 h-4">
                      <input
                        type="checkbox"
                        checked={filters.inStock}
                        onChange={() => onFilterChange({...filters, inStock: !filters.inStock})}
                        className="peer appearance-none w-4 h-4 border border-gray-300 rounded-[2px] checked:bg-primary checked:border-primary transition-colors cursor-pointer shrink-0"
                      />
                      <svg className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100" viewBox="0 0 14 10" fill="none">
                        <path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <span className="text-sm text-text-primary group-hover:text-primary transition-colors">Exclude Out of Stock</span>
                  </label>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  )
}

export default ProductFilters
