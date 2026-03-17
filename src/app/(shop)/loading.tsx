export default function Loading() {
  return (
    <div className="w-full min-h-screen animate-pulse bg-gray-50 flex flex-col gap-6 p-4">
      {/* Hero Skeleton */}
      <div className="w-full h-[250px] md:h-[400px] bg-gray-200 rounded-sm" />
      
      {/* Category Strip Skeleton */}
      <div className="container mx-auto flex items-center justify-between gap-4 py-8">
        {[1,2,3,4,5,6].map(i => (
          <div key={i} className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-gray-200" />
            <div className="w-12 h-3 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}
