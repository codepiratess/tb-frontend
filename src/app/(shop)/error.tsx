'use client'
 
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { AlertCircle } from 'lucide-react'
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])
 
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center w-full max-w-md bg-white p-8 rounded-sm shadow-sm border border-red-100"
      >
        <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle size={32} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h2>
        <p className="text-gray-500 mb-8">{error.message || "We're having trouble loading this page right now."}</p>
        
        <div className="flex gap-4">
          <button
            onClick={() => window.location.href = '/'}
            className="flex-1 px-4 py-3 bg-gray-100 font-bold text-gray-700 hover:bg-gray-200 rounded-sm transition-colors"
          >
            Go to Home
          </button>
          <button
            onClick={() => reset()}
            className="flex-1 px-4 py-3 bg-primary font-bold text-white hover:bg-primary-dark rounded-sm transition-colors"
          >
            Try Again
          </button>
        </div>
      </motion.div>
    </div>
  )
}
