'use client'

import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { Skeleton } from '@/components/ui/Skeleton'

// Lazy load recharts components
const ResponsiveContainer = dynamic(
  () => import('recharts').then((mod) => mod.ResponsiveContainer),
  { ssr: false, loading: () => <Skeleton className="w-full h-[350px]" /> }
)
const LineChart = dynamic(
  () => import('recharts').then((mod) => mod.LineChart),
  { ssr: false }
)
const Line = dynamic(
  () => import('recharts').then((mod) => mod.Line),
  { ssr: false }
)
const BarChart = dynamic(
  () => import('recharts').then((mod) => mod.BarChart),
  { ssr: false }
)
const Bar = dynamic(
  () => import('recharts').then((mod) => mod.Bar),
  { ssr: false }
)
const AreaChart = dynamic(
  () => import('recharts').then((mod) => mod.AreaChart),
  { ssr: false }
)
const Area = dynamic(
  () => import('recharts').then((mod) => mod.Area),
  { ssr: false }
)
const XAxis = dynamic(
  () => import('recharts').then((mod) => mod.XAxis),
  { ssr: false }
)
const YAxis = dynamic(
  () => import('recharts').then((mod) => mod.YAxis),
  { ssr: false }
)
const CartesianGrid = dynamic(
  () => import('recharts').then((mod) => mod.CartesianGrid),
  { ssr: false }
)
const Tooltip = dynamic(
  () => import('recharts').then((mod) => mod.Tooltip),
  { ssr: false }
)

type ViewType = 'revenue' | 'orders' | 'customers'
type TimeFilter = '7d' | '30d' | '3m' | '1y'

const timeFilters: { label: string; value: TimeFilter }[] = [
  { label: '7 Days', value: '7d' },
  { label: '30 Days', value: '30d' },
  { label: '3 Months', value: '3m' },
  { label: '1 Year', value: '1y' },
]

interface RevenueChartProps {
  data: any[]
  isLoading?: boolean
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ data, isLoading = false }) => {
  const [activeView, setActiveView] = useState<ViewType>('revenue')
  const [activeFilter, setActiveFilter] = useState<TimeFilter>('30d')

  // Filter mock data based on selected period
  const filteredData = React.useMemo(() => {
    if (!data) return []
    const count = activeFilter === '7d' ? 7 : activeFilter === '30d' ? 30 : activeFilter === '3m' ? 90 : 365
    return data.slice(-count)
  }, [data, activeFilter])

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-[480px]">
        <div className="flex justify-between items-center mb-8">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-8 w-64" />
        </div>
        <Skeleton className="w-full h-[350px] rounded-lg" />
      </div>
    )
  }

  const formatCurrency = (val: number) => `₹${val.toLocaleString('en-IN')}`

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex p-1 bg-gray-50 rounded-lg border border-gray-100">
          {(['revenue', 'orders', 'customers'] as ViewType[]).map((view) => (
            <button
              key={view}
              onClick={() => setActiveView(view)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md capitalize transition-all ${
                activeView === view
                  ? 'bg-white text-[#2874F0] shadow-sm ring-1 ring-gray-200'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {view}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          {timeFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setActiveFilter(filter.value)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeFilter === filter.value
                  ? 'bg-[#2874F0]/10 text-[#2874F0]'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {activeView === 'revenue' ? (
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2874F0" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#2874F0" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#64748B' }}
                dy={10}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#64748B' }}
                tickFormatter={(val) => `₹${val >= 1000 ? (val/1000).toFixed(0) + 'k' : val}`}
              />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100">
                        <p className="text-xs text-gray-500 mb-1">{payload[0].payload.date}</p>
                        <p className="font-bold text-gray-900">{formatCurrency(payload[0].value as number)}</p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#2874F0" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorRevenue)" 
                activeDot={{ r: 6, fill: '#2874F0', strokeWidth: 2, stroke: '#fff' }}
              />
            </AreaChart>
          ) : activeView === 'orders' ? (
            <BarChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#64748B' }}
                dy={10}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#64748B' }}
              />
              <Tooltip 
                cursor={{ fill: '#F8FAFC' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100">
                        <p className="text-xs text-gray-500 mb-1">{payload[0].payload.date}</p>
                        <p className="font-bold text-gray-900">{payload[0].value} Orders</p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Bar 
                dataKey="orders" 
                fill="#2874F0" 
                radius={[4, 4, 0, 0]} 
                barSize={32}
              />
            </BarChart>
          ) : (
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient id="colorCustomers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#64748B' }}
                dy={10}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#64748B' }}
              />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100">
                        <p className="text-xs text-gray-500 mb-1">{payload[0].payload.date}</p>
                        <p className="font-bold text-[#7C3AED]">{payload[0].value} New Customers</p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Area 
                type="monotone" 
                dataKey="customers" 
                stroke="#7C3AED" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorCustomers)" 
                activeDot={{ r: 6, fill: '#7C3AED', strokeWidth: 2, stroke: '#fff' }}
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  )
}
