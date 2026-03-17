import { Skeleton } from '@/components/ui/Skeleton'

export default function ProductsLoading() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-10 w-24 rounded-lg" />
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
      </div>

      <div className="flex gap-4 border-b border-gray-100 pb-px overflow-x-auto">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-28 shrink-0" />
        ))}
      </div>

      <div className="space-y-4">
        <Skeleton className="h-16 w-full rounded-xl" />
        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
          <Skeleton className="h-12 w-full" />
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full border-t border-gray-50" />
          ))}
        </div>
      </div>
    </div>
  )
}
