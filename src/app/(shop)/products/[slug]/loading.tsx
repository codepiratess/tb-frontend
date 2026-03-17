export default function Loading() {
  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-sm border border-gray-100 p-6 flex flex-col lg:flex-row gap-8 animate-pulse">
          {/* Gallery Skeleton */}
          <div className="w-full lg:w-[40%] flex gap-4">
            <div className="hidden md:flex flex-col gap-2">
               {[1,2,3,4].map(i => <div key={i} className="w-16 h-16 bg-gray-200 rounded-sm" />)}
            </div>
            <div className="w-full aspect-square bg-gray-200 rounded-sm" />
          </div>

          {/* Details Skeleton */}
          <div className="w-full lg:w-[60%] flex flex-col gap-4">
             <div className="w-32 h-4 bg-gray-200 rounded" />
             <div className="w-full h-8 bg-gray-200 rounded mt-2" />
             <div className="w-2/3 h-8 bg-gray-200 rounded mb-4" />
             <div className="w-48 h-10 bg-success/20 rounded mb-4" />
             <div className="w-full h-24 bg-gray-100 rounded mb-4" />
             <div className="w-full h-24 bg-gray-100 rounded mb-4" />
          </div>
        </div>
      </div>
    </div>
  )
}
