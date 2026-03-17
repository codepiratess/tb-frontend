import React from 'react'
import Link from 'next/link'
import { ShoppingBag, Search, ChevronRight } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      {/* Illustration Area */}
      <div className="relative mb-8">
        <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center -rotate-12 transform hover:rotate-0 transition-transform duration-500">
          <ShoppingBag size={64} className="text-primary" />
        </div>
        <div className="absolute -top-4 -right-4 bg-white shadow-xl rounded-full w-12 h-12 flex items-center justify-center text-accent font-bold text-2xl rotate-12">
          ?
        </div>
        <div className="absolute -bottom-2 -left-4 w-16 h-16 bg-accent/10 rounded-full -z-10 blur-xl" />
      </div>

      <div className="text-center space-y-4 max-w-md">
        <h1 className="text-8xl font-black text-primary tracking-tighter drop-shadow-sm">
          404
        </h1>
        
        <h2 className="text-2xl md:text-3xl font-bold text-text-primary">
          Oops! Page not found
        </h2>
        
        <p className="text-text-secondary text-base mb-8">
          The page you&apos;re looking for doesn&apos;t exist, has been removed, or is temporarily unavailable.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link 
            href="/"
            className="w-full sm:w-auto px-8 py-3 bg-white text-text-primary font-medium rounded-sm border border-gray-300 hover:bg-gray-50 hover:border-text-primary transition-all shadow-sm"
          >
            Go Home
          </Link>
          <Link 
            href="/products"
            className="w-full sm:w-auto px-8 py-3 bg-primary text-white font-medium rounded-sm hover:bg-primary-dark transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <Search size={18} />
            Browse Products
          </Link>
        </div>
        
        {/* Support Link */}
        <div className="mt-12 text-sm text-text-secondary">
          Need help? <Link href="/contact" className="text-primary hover:underline font-medium inline-flex items-center">Contact Support <ChevronRight size={14} /></Link>
        </div>
      </div>
    </div>
  )
}
