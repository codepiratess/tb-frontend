import { Order, Product } from '@/types'

/**
 * Export an array of objects to a CSV file and trigger download
 */
export const exportToCSV = (data: any[], filename: string) => {
  if (!data || data.length === 0) return

  const headers = Object.keys(data[0])
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        let val = row[header]
        if (val === null || val === undefined) return ''
        if (typeof val === 'string' && (val.includes(',') || val.includes('\n'))) {
          return `"${val.replace(/"/g, '""')}"`
        }
        return val
      }).join(',')
    )
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Generate a random Order ID
 */
export const generateOrderId = () => {
  return `TB${Math.floor(100000 + Math.random() * 900000)}`
}

/**
 * Generate a SKU for a product
 */
export const generateSKU = (name: string, category: string) => {
  const catPrefix = category.slice(0, 3).toUpperCase()
  const randomNum = Math.floor(1000 + Math.random() * 9000)
  return `TB-${catPrefix}-${randomNum}`
}

/**
 * Get formatted order status metadata
 */
export const formatOrderStatus = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return { label: 'Pending', color: '#F59E0B', bgColor: '#FFFBEB', icon: 'Clock' }
    case 'confirmed':
      return { label: 'Confirmed', color: '#2874F0', bgColor: '#EBF2FF', icon: 'CheckCircle' }
    case 'shipped':
      return { label: 'Shipped', color: '#7C3AED', bgColor: '#F5F3FF', icon: 'Truck' }
    case 'delivered':
      return { label: 'Delivered', color: '#10B981', bgColor: '#ECFDF5', icon: 'CheckCircle2' }
    case 'cancelled':
      return { label: 'Cancelled', color: '#EF4444', bgColor: '#FEF2F2', icon: 'XCircle' }
    default:
      return { label: status, color: '#6B7280', bgColor: '#F9FAFB', icon: 'Info' }
  }
}

/**
 * Calculate summary of revenue from orders
 */
export const calculateRevenueSummary = (orders: Order[]) => {
  if (orders.length === 0) return { total: 0, average: 0, highest: 0, lowest: 0 }

  const amounts = orders.map(o => o.totalAmount)
  const total = amounts.reduce((sum, val) => sum + val, 0)
  
  return {
    total,
    average: Math.round(total / orders.length),
    highest: Math.max(...amounts),
    lowest: Math.min(...amounts)
  }
}

/**
 * Get stock status based on quantity
 */
export const getStockStatus = (stock: number) => {
  if (stock > 50) return { label: 'In Stock', color: 'text-green-600', severity: 'low' }
  if (stock >= 10) return { label: 'Low Stock', color: 'text-yellow-600', severity: 'medium' }
  if (stock > 0) return { label: `Very Low (${stock} left)`, color: 'text-orange-600', severity: 'high' }
  return { label: 'Out of Stock', color: 'text-red-600', severity: 'critical' }
}
