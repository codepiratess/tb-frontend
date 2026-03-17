'use client'

import React, { useState } from 'react'
import { Star, StarHalf } from 'lucide-react'
import { cn } from '../../lib/utils'

interface RatingStarsProps {
  rating: number
  maxStars?: number
  size?: number
  interactive?: boolean
  onRatingChange?: (rating: number) => void
  className?: string
}

export function RatingStars({
  rating,
  maxStars = 5,
  size = 16,
  interactive = false,
  onRatingChange,
  className
}: RatingStarsProps) {
  const [hoverRating, setHoverRating] = useState(0)
  const currentRating = interactive && hoverRating > 0 ? hoverRating : rating

  const stars = []
  for (let i = 1; i <= maxStars; i++) {
    const isFull = i <= currentRating
    const isHalf = i - 0.5 <= currentRating && i > currentRating

    stars.push(
      <span
        key={i}
        className={cn(
          "cursor-default",
          interactive && "cursor-pointer transition-transform hover:scale-110"
        )}
        onMouseEnter={() => interactive && setHoverRating(i)}
        onMouseLeave={() => interactive && setHoverRating(0)}
        onClick={() => interactive && onRatingChange?.(i)}
      >
        {isFull ? (
          <Star size={size} className="fill-[#388e3c] text-[#388e3c]" /> // Flipkart green for rating stars
        ) : isHalf ? (
          <div className="relative">
            <Star size={size} className="text-gray-300" />
            <div className="absolute top-0 left-0 overflow-hidden w-1/2">
              <Star size={size} className="fill-[#388e3c] text-[#388e3c]" />
            </div>
          </div>
        ) : (
          <Star size={size} className="text-gray-300" />
        )}
      </span>
    )
  }

  return <div className={cn("flex items-center gap-0.5", className)}>{stars}</div>
}
