'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import { Skeleton } from '@/components/ui/Skeleton'

const ResponsiveContainer = dynamic(
  () => import('recharts').then((mod) => mod.ResponsiveContainer),
  { ssr: false, loading: () => <Skeleton className="w-full h-[300px]" /> }
)
const PieChart = dynamic(
  () => import('recharts').then((mod) => mod.PieChart),
  { ssr: false }
)
const Pie = dynamic(
  () => import('recharts').then((mod) => mod.Pie),
  { ssr: false }
)
const Cell = dynamic(
  () => import('recharts').then((mod) => mod.Cell),
  { ssr: false }
)
const Tooltip = dynamic(
  () => import('recharts').then((mod) => mod.Tooltip),
  { ssr: false }
)

const COLORS = [
  '#2874F0', // Blue
  '#7C3AED', // Purple
  '#EC4899', // Pink
  '#F59E0B', // Amber
  '#10B981', // Emerald
  '#3B82F6', // Blue 500
  '#6366F1', // Indigo
  '#8B5CF6', // Violet
  '#EF4444', // Red
  '#F97316', // Orange
  '#06B6D4', // Cyan
  '#84CC16', // Lime
]

interface SalesByCategoryChartProps {
  data: { category: string; revenue: number; percentage: number }[] | undefined
  isLoading?: boolean
}

export const SalesByCategoryChart: React.FC<SalesByCategoryChartProps> = ({ data, isLoading = false }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price)
  }

  const totalRevenue = data?.reduce((acc, curr) => acc + curr.revenue, 0) || 0

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-[480px]">
        <Skeleton className="h-6 w-48 mb-6" />
        <div className="flex justify-center items-center h-[300px]">
          <Skeleton className="w-64 h-64 rounded-full" />
        </div>
        <div className="grid grid-cols-2 gap-4 mt-6">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col h-full">
      <h3 className="text-lg font-bold text-gray-900 mb-6 font-primary">Sales by Category</h3>
      
      <div className="relative h-[300px] w-full">
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Total Sales</p>
          <p className="text-xl font-bold text-gray-900">{formatPrice(totalRevenue)}</p>
        </div>
        
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={85}
              outerRadius={110}
              paddingAngle={5}
              cornerRadius={4}
              dataKey="revenue"
            >
              {data?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100">
                      <p className="text-xs font-bold text-gray-900 mb-1">{payload[0].name}</p>
                      <p className="text-sm font-bold text-[#2874F0]">{formatPrice(payload[0].value as number)}</p>
                      <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                        {(payload[0].payload?.percentage || 0).toFixed(1)}% of total
                      </p>
                    </div>
                  )
                }
                return null
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="flex-1 overflow-y-auto mt-6 pr-2 custom-scrollbar">
        <div className="grid grid-cols-2 gap-x-6 gap-y-3">
          {data?.map((item, index) => (
            <div key={item.category} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full shrink-0" 
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-xs font-medium text-gray-600 truncate">{item.category}</span>
              <span className="text-xs font-bold text-gray-900 ml-auto">{(item.percentage || 0).toFixed(0)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
