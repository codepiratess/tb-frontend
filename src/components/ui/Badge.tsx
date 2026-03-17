import React from 'react'
import { cn } from '../../lib/utils'

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'default' | 'secondary'
  children: React.ReactNode
}

export function Badge({ variant = 'default', className, children, ...props }: BadgeProps) {
  const variants = {
    success: 'bg-green-100 text-green-800 border border-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    danger: 'bg-red-100 text-red-800 border border-red-200',
    info: 'bg-blue-100 text-blue-800 border border-blue-200',
    secondary: 'bg-gray-100 text-gray-800 border border-gray-200',
    default: 'bg-gray-100 text-gray-800 border border-gray-200',
  }

  return (
    <div
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-medium',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
