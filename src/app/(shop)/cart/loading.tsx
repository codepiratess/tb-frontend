'use client'

export default function Loading() {
  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 flex flex-col lg:flex-row gap-6 animate-pulse">
        
        {/* Left Col Skeleton */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="h-14 bg-white rounded-sm border border-gray-100" />
          <div className="h-10 bg-white rounded-sm border border-gray-100" />
          
          <div className="flex flex-col bg-white rounded-sm border border-gray-100 divide-y divide-gray-100">
            {[1, 2, 3].map(i => (
              <div key={i} className="p-4 md:p-6 flex gap-4 md:gap-6">
                <div className="w-24 h-24 bg-gray-200 rounded-sm shrink-0" />
                <div className="flex-1 space-y-3">
                  <div className="w-3/4 h-4 bg-gray-200" />
                  <div className="w-1/4 h-3 bg-gray-200" />
                  <div className="w-1/3 h-5 bg-gray-200 pt-2" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col Skeleton */}
        <div className="lg:w-[350px] shrink-0">
          <div className="bg-white rounded-sm border border-gray-100 h-80 sticky top-24">
             <div className="h-14 border-b border-gray-100 bg-gray-50/50" />
             <div className="p-4 space-y-4">
                <div className="flex justify-between"><div className="w-24 h-4 bg-gray-200"/><div className="w-16 h-4 bg-gray-200"/></div>
                <div className="flex justify-between"><div className="w-20 h-4 bg-gray-200"/><div className="w-16 h-4 bg-gray-200"/></div>
                <div className="flex justify-between"><div className="w-28 h-4 bg-gray-200"/><div className="w-16 h-4 bg-gray-200"/></div>
             </div>
             <div className="p-4 border-t border-dashed border-gray-200">
               <div className="flex justify-between"><div className="w-32 h-6 bg-gray-200"/><div className="w-24 h-6 bg-gray-200"/></div>
             </div>
             <div className="p-4"><div className="w-full h-12 bg-gray-200 rounded-sm" /></div>
          </div>
        </div>

      </div>
    </div>
  )
}
