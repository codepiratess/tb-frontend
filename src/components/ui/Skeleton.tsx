import React from 'react'
import { cn } from '../../lib/utils'

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-gray-200', className)}
      {...props}
    />
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-sm border border-gray-200 overflow-hidden flex flex-col p-4 w-full h-[350px]">
      <Skeleton className="w-full h-40 mb-4 rounded-sm" />
      <Skeleton className="h-5 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2 mb-4" />
      <div className="mt-auto flex justify-between items-center">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-8 w-24 rounded-sm" />
      </div>
    </div>
  )
}

export function ProductDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse">
      <Skeleton className="w-full aspect-square md:aspect-[4/3] rounded-sm" />
      <div className="space-y-6">
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-12 w-1/4" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        <div className="flex gap-4 pt-4">
          <Skeleton className="h-12 w-40" />
          <Skeleton className="h-12 w-40" />
        </div>
      </div>
    </div>
  )
}

export function OrderItemSkeleton() {
  return (
    <div className="flex items-center gap-4 py-4 border-b border-gray-200 w-full animate-pulse">
      <Skeleton className="w-16 h-16 rounded-sm" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-3 w-1/4" />
      </div>
      <div className="w-24 flex flex-col items-end space-y-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-6 w-16 rounded-3xl" />
      </div>
    </div>
  )
}
