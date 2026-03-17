import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Order, PaginatedResponse } from '@/types'
import { mockOrders } from '@/lib/mockData'

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true'

export function useAdminOrders(filters: any = {}) {
  return useQuery<PaginatedResponse<Order>>({
    queryKey: ['admin-orders', filters],
    queryFn: async () => {
      if (USE_MOCK) {
        let filtered = [...mockOrders]
        if (filters.status) filtered = filtered.filter(o => o.status === filters.status)
        if (filters.search) filtered = filtered.filter(o => o.id.toLowerCase().includes(filters.search.toLowerCase()))
        
        const limit = filters.limit || 10
        const page = filters.page || 1

        return {
          data: filtered.slice((page - 1) * limit, page * limit),
          total: filtered.length,
          page,
          limit,
          totalPages: Math.ceil(filtered.length / limit)
        }
      }
      const params = new URLSearchParams(filters).toString()
      const res = await fetch(`/api/admin/orders?${params}`)
      return res.json()
    }
  })
}

export function useAdminOrder(id: string) {
  return useQuery<Order>({
    queryKey: ['admin-order', id],
    queryFn: async () => {
      if (USE_MOCK) {
        return mockOrders.find(o => o.id === id) || mockOrders[0]
      }
      const res = await fetch(`/api/admin/orders/${id}`)
      return res.json()
    },
    enabled: !!id
  })
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, status, note, notifyCustomer }: { id: string, status: string, note?: string, notifyCustomer?: boolean }) => {
      if (USE_MOCK) return new Promise(resolve => setTimeout(resolve, 1000))
      const res = await fetch(`/api/admin/orders/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, note, notifyCustomer })
      })
      return res.json()
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] })
      queryClient.invalidateQueries({ queryKey: ['admin-order', variables.id] })
    }
  })
}

export function useAddOrderNote() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, note }: { id: string, note: string }) => {
      if (USE_MOCK) return new Promise(resolve => setTimeout(resolve, 800))
      const res = await fetch(`/api/admin/orders/${id}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note })
      })
      return res.json()
    }
  })
}

export function useExportOrders() {
  return useQuery({
    queryKey: ['export-orders'],
    queryFn: async () => {
      if (USE_MOCK) {
        // Mock blob download
        const blob = new Blob(['Order ID,Customer,Amount,Status\nTB123,John Doe,₹1500,Delivered'], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'orders.csv'
        a.click()
        return true
      }
      const res = await fetch('/api/admin/orders/export?format=csv')
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'orders.csv'
      a.click()
      return true
    },
    enabled: false // Manual trigger
  })
}
