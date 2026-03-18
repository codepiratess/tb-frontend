'use client'

import React from 'react'
import Link from 'next/link'
import { Order } from '@/types'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'

interface RecentOrdersWidgetProps {
  orders: Order[] | undefined
  isLoading: boolean
}

export const RecentOrdersWidget: React.FC<RecentOrdersWidgetProps> = ({ orders, isLoading }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'success'
      case 'shipped': return 'secondary'
      case 'confirmed': return 'info'
      case 'cancelled': return 'danger'
      default: return 'warning'
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-full">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="w-8 h-8 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-900 font-primary">Recent Orders</h3>
        <Link 
          href="/admin/orders"
          className="text-xs font-semibold text-[#2874F0] hover:underline"
        >
          View All
        </Link>
      </div>

      <div className="flex-1 space-y-5">
        {(orders || []).slice(0, 5).map((order) => (
          <div key={order.id} className="flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-[#2874F0] font-bold text-xs shrink-0 group-hover:bg-[#2874F0] group-hover:text-white transition-colors">
                {order.shippingAddress.fullName.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-mono font-bold text-[#2874F0]">#{order.id.slice(0, 6).toUpperCase()}</p>
                <p className="text-sm font-semibold text-gray-900 truncate max-w-[120px]">{order.shippingAddress.fullName}</p>
              </div>
            </div>
            <div className="text-right flex flex-col items-end gap-1">
              <p className="text-sm font-bold text-gray-900">{formatPrice(order.totalAmount)}</p>
              <Badge variant={getStatusColor(order.status)} className="text-[10px] py-0 px-2 h-5 flex items-center capitalize">
                {order.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
