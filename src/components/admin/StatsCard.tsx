'use client'

import React from 'react'
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react'
import { motion } from 'framer-motion'
import { Skeleton } from '@/components/ui/Skeleton'

interface StatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  iconColor: string
  iconBg: string
  trend: number
  trendLabel?: string
  prefix?: string
  isLoading?: boolean
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  iconColor,
  iconBg,
  trend,
  trendLabel = 'from last month',
  prefix = '',
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm overflow-hidden min-h-[140px]">
        <div className="flex items-start gap-4">
          <Skeleton className="w-12 h-12 rounded-lg" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
      </div>
    )
  }

  const isPositive = trend >= 0

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div 
            className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
            style={{ backgroundColor: iconBg }}
          >
            <Icon size={24} style={{ color: iconColor }} />
          </div>
          
          <div>
            <p className="text-[12px] font-semibold text-gray-500 uppercase tracking-widest mb-1">
              {title}
            </p>
            <h3 className="text-28px font-bold text-gray-900">
              {prefix}{value}
            </h3>
            
            <div className="flex items-center gap-1.5 mt-2">
              <span className={`flex items-center gap-0.5 text-sm font-medium ${
                isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                {isPositive ? (
                  <TrendingUp size={14} className="shrink-0" />
                ) : (
                  <TrendingDown size={14} className="shrink-0" />
                )}
                {isPositive ? '+' : ''}{trend}%
              </span>
              <span className="text-sm text-gray-400">
                {trendLabel}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
