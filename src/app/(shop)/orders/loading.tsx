'use client'

export default function Loading() {
  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 flex flex-col lg:flex-row gap-6 animate-pulse">
        
        {/* Sidebar */}
        <div className="hidden lg:block w-64 shrink-0">
          <div className="bg-white rounded-sm border border-gray-100 p-4 h-64 sticky top-24" />
        </div>

        <div className="flex-1 flex flex-col gap-4">
          <div className="h-16 bg-white rounded-sm border border-gray-100" />
          
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-white rounded-sm border border-gray-100 p-4 flex gap-6">
                <div className="w-20 h-20 bg-gray-200 rounded-sm shrink-0" />
                <div className="flex-1 space-y-3 pt-2">
                  <div className="w-1/2 h-4 bg-gray-200" />
                  <div className="w-1/4 h-3 bg-gray-200" />
                  <div className="w-32 h-3 bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
