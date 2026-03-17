'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { ProductCarousel } from '../product/ProductCarousel'

interface FeaturedSectionProps {
  title: string
  subtitle?: string
  queryKey: any[]
  viewAllLink: string
}

export function FeaturedSection({ 
  title, 
  subtitle, 
  queryKey,
  viewAllLink 
}: FeaturedSectionProps) {
  const { data: products = [], isLoading } = useQuery<any[]>({
    queryKey,
    enabled: !!queryKey,
  });

  return (
    <motion.section 
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
      }}
      className="w-full my-12 bg-transparent"
    >
      <div className="mb-6 flex items-end justify-between border-b border-gray-100 pb-4">
        <div className="border-l-4 border-primary pl-4">
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-gray-500 mt-1 max-w-2xl text-sm font-medium">{subtitle}</p>
          )}
        </div>
        
        <Link 
          href={viewAllLink}
          className="text-primary font-bold text-sm hover:underline hidden md:block"
        >
          VIEW ALL →
        </Link>
      </div>

      <ProductCarousel 
        title="" 
        products={products} 
        isLoading={isLoading} 
      />

      <div className="mt-8 flex justify-center md:hidden">
        <Link 
          href={viewAllLink}
          className="w-full text-center py-3 bg-white border border-gray-200 text-gray-900 font-bold rounded-sm shadow-sm"
        >
          View All {title}
        </Link>
      </div>
    </motion.section>
  )
}

export default FeaturedSection
