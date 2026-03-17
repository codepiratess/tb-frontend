import { Skeleton } from '@/components/ui/Skeleton'

export default function AnalyticsLoading() {
  return (
    <div className="space-y-10 pb-10">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-10 w-40 rounded-xl" />
          <Skeleton className="h-10 w-10 rounded-xl" />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-2xl" />
        ))}
      </div>

      <Skeleton className="h-[450px] w-full rounded-2xl" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Skeleton className="h-[450px] w-full rounded-2xl" />
        <Skeleton className="h-[450px] w-full rounded-2xl lg:col-span-2" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Skeleton className="h-[400px] w-full rounded-2xl" />
        <Skeleton className="h-[400px] w-full rounded-2xl" />
        <Skeleton className="h-[400px] w-full rounded-2xl" />
      </div>
    </div>
  )
}
