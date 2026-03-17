import { useQuery } from '@tanstack/react-query'
import { 
  mockRevenueData, 
  mockDashboardStats, 
  mockSalesByCategory, 
  mockTopProducts, 
  mockOrdersByHour 
} from '@/lib/mockData'

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true'

export function useRevenueData(period: '7d' | '30d' | '3m' | '1y') {
  return useQuery({
    queryKey: ['admin-revenue', period],
    queryFn: async () => {
      if (USE_MOCK) {
        const count = period === '7d' ? 7 : period === '30d' ? 30 : period === '3m' ? 90 : 365
        return mockRevenueData.slice(-count)
      }
      const res = await fetch(`/api/admin/analytics/revenue?period=${period}`)
      return res.json()
    },
    staleTime: 10 * 60 * 1000
  })
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: async () => {
      if (USE_MOCK) return mockDashboardStats
      const res = await fetch('/api/admin/analytics/dashboard-stats')
      return res.json()
    },
    staleTime: 5 * 60 * 1000
  })
}

export function useSalesByCategory() {
  return useQuery({
    queryKey: ['admin-sales-by-category'],
    queryFn: async () => {
      if (USE_MOCK) return mockSalesByCategory
      const res = await fetch('/api/admin/analytics/sales-by-category')
      return res.json()
    }
  })
}

export function useTopProducts(limit: number = 5) {
  return useQuery({
    queryKey: ['admin-top-products', limit],
    queryFn: async () => {
      if (USE_MOCK) return mockTopProducts.slice(0, limit)
      const res = await fetch(`/api/admin/analytics/top-products?limit=${limit}`)
      return res.json()
    }
  })
}

export function useOrdersByHour() {
  return useQuery({
    queryKey: ['admin-orders-by-hour'],
    queryFn: async () => {
      if (USE_MOCK) return mockOrdersByHour
      const res = await fetch('/api/admin/analytics/orders-by-hour')
      return res.json()
    }
  })
}
