import { ProductCardSkeleton } from '../../../components/ui/Skeleton'

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-6 flex gap-6">
      {/* Sidebar Skeleton */}
      <div className="hidden lg:block w-72 shrink-0 h-[calc(100vh-140px)] sticky top-24 bg-white border border-gray-100 rounded-sm p-4 animate-pulse">
        <div className="w-3/4 h-6 bg-gray-200 rounded mb-6" />
        <div className="w-full h-10 bg-gray-200 rounded mb-4" />
        <div className="w-full h-10 bg-gray-200 rounded mb-4" />
        <div className="w-full h-10 bg-gray-200 rounded mb-4" />
      </div>

      {/* Grid Skeleton */}
      <div className="flex-1 w-full flex flex-col">
        <div className="w-full h-14 bg-white border border-gray-100 rounded-sm mb-4 animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[1,2,3,4,5,6,7,8].map(i => (
             <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}
