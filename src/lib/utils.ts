import { clsx, type ClassValue } from 'clsx'
import { format, parseISO } from 'date-fns'

/**
 * Merge classnames using clsx
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

/**
 * Format number to Indian Rupee
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price)
}

/**
 * Format ISO date string to "12 Jan 2025" format
 */
export function formatDate(dateString: string): string {
  try {
    const date = parseISO(dateString)
    return format(date, 'dd MMM yyyy')
  } catch (err) {
    return dateString
  }
}

/**
 * Calculate discount percentage from original and current price
 */
export function calculateDiscount(originalPrice: number, currentPrice: number): number {
  if (originalPrice <= 0) return 0
  const discount = ((originalPrice - currentPrice) / originalPrice) * 100
  return Math.round(discount)
}

/**
 * Truncate text to a maximum length and add ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

/**
 * Generate a URL-friendly slug from a string
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
