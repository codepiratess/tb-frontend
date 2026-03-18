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
  const { data, isLoading } = useQuery<any>({
    queryKey,
    enabled: !!queryKey,
  });

  const products = Array.isArray(data) ? data : (data?.data || []);

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
        <div className="border-l-4 border-[#2874F0] pl-4">
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-gray-500 mt-1 max-w-2xl text-sm font-medium">{subtitle}</p>
          )}
        </div>
        
        <Link 
          href={viewAllLink}
          className="text-[#2874F0] font-black text-xs uppercase tracking-widest hover:underline hidden md:block"
        >
          VIEW ALL →
        </Link>
      </div>

      {!isLoading && products.length === 0 ? (
        <div className="py-20 text-center border-2 border-dashed rounded-3xl bg-white/50">
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
            No products found matching "{title}"
          </p>
          <p className="text-slate-300 font-medium text-[11px] mt-1 italic">
            Admin: Add products from the dashboard to populate this section.
          </p>
        </div>
      ) : (
        <ProductCarousel 
          title="" 
          products={products} 
          isLoading={isLoading} 
        />
      )}

      {products.length > 0 && (
        <div className="mt-8 flex justify-center md:hidden">
          <Link 
            href={viewAllLink}
            className="w-full text-center py-3 bg-white border border-gray-200 text-gray-900 font-bold rounded-sm shadow-sm"
          >
            View All {title}
          </Link>
        </div>
      )}
    </motion.section>
  )
}

export default FeaturedSection
