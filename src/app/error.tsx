'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { AlertCircle, RotateCcw, Home } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { usePathname } from 'next/navigation'

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="flex flex-col items-center">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${isAdmin ? 'bg-blue-50 text-[#2874F0]' : 'bg-red-50 text-red-600'}`}>
            <AlertCircle size={40} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 font-primary">
            {isAdmin ? 'Something went wrong in admin panel' : 'Something went wrong!'}
          </h1>
          <p className="text-gray-500 mt-2">
            We encountered an unexpected error while processing your request. Our team has been notified.
          </p>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-left overflow-auto max-h-40">
            <p className="text-xs font-mono text-red-600 break-words">{error.message}</p>
            {error.stack && <pre className="text-[10px] text-gray-400 mt-2 font-mono leading-relaxed">{error.stack}</pre>}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            onClick={() => reset()}
            className={`flex-1 gap-2 ${isAdmin ? 'bg-[#2874F0] hover:bg-blue-600' : 'bg-gray-900 hover:bg-gray-800'}`}
          >
            <RotateCcw size={18} /> Try Again
          </Button>
          <Link href={isAdmin ? '/admin' : '/'} className="flex-1">
            <Button variant="outline" className="w-full gap-2 border-gray-200">
              <Home size={18} /> {isAdmin ? 'Go to Dashboard' : 'Back to Home'}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
