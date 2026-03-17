import React from 'react'
import { RotateCw } from 'lucide-react'
import { cn } from '../../lib/utils'

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
  const sizes = {
    sm: 16,
    md: 24,
    lg: 32,
  }

  return (
    <RotateCw
      size={sizes[size]}
      className={cn("animate-spin text-primary", className)}
    />
  )
}
