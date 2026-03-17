'use client'
 
import { useEffect } from 'react'
import { AlertCircle } from 'lucide-react'
import Link from 'next/link'
 
export default function ProductError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])
 
  return (
    <div className="container mx-auto px-4 py-20">
      <div className="bg-red-50 border border-red-200 rounded-sm p-8 text-center max-w-2xl mx-auto flex flex-col items-center">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">We couldn&apos;t load this product</h2>
        <p className="text-gray-600 mb-6">The product might have been removed or is temporarily unavailable.</p>
        <div className="flex gap-4">
          <button
            onClick={() => reset()}
            className="px-6 py-2 bg-white border border-red-300 font-medium text-red-600 rounded-sm hover:bg-red-50 transition-colors"
          >
            Try Again
          </button>
          <Link
            href="/products"
            className="px-6 py-2 bg-primary font-medium text-white rounded-sm hover:bg-primary-dark transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  )
}
