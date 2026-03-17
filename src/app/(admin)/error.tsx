'use client'

import React from 'react'

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[500px] p-6 text-center">
      <div className="w-16 h-16 bg-red-100 text-error rounded-full flex items-center justify-center mb-6">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
           <circle cx="12" cy="12" r="10"></circle>
           <line x1="12" y1="8" x2="12" y2="12"></line>
           <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong in admin panel</h2>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        We encountered an error while trying to process your request. 
      </p>

      {process.env.NODE_ENV === 'development' && (
        <div className="bg-red-50 text-error p-4 rounded-md text-left text-sm w-full max-w-2xl overflow-auto mb-8 mx-auto font-mono">
           {error.message || JSON.stringify(error)}
        </div>
      )}

      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="px-6 py-2 bg-white border border-gray-300 rounded font-medium text-gray-700 hover:bg-gray-50"
        >
          Try Again
        </button>
        <button
          onClick={() => window.location.href = '/admin'}
          className="px-6 py-2 bg-primary text-white rounded font-medium hover:bg-blue-600"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  )
}
