'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import MobileNav from '../../components/layout/MobileNav'
import CartDrawer from '../../components/cart/CartDrawer'

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* 
        Main content padding
        Desktop: 72px (top row) + 40px (bottom row) = 112px
        Mobile: 60px (top row)
      */}
      <main className="flex-1 w-full pt-[60px] md:pt-[112px] pb-[64px] md:pb-0 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="w-full h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
      <MobileNav />
      <CartDrawer />
    </div>
  )
}
