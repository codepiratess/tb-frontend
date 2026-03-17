import { Skeleton } from '@/components/ui/Skeleton'

export default function OrdersLoading() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>

      <div className="grid grid-cols-4 gap-6">
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
      </div>

      <div className="space-y-4">
        <Skeleton className="h-16 w-full rounded-xl" />
        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
          <Skeleton className="h-12 w-full" />
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full border-t border-gray-50" />
          ))}
        </div>
      </div>
    </div>
  )
}
