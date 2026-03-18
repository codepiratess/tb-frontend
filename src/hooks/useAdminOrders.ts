import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Order, PaginatedResponse } from '@/types'
import api from '@/lib/api'
import { API_ENDPOINTS } from '@/constants'

export function useAdminOrders(filters: any = {}) {
  return useQuery<PaginatedResponse<Order>>({
    queryKey: ['admin-orders', filters],
    queryFn: async () => {
      const { data } = await api.get(API_ENDPOINTS.ORDERS.ADMIN_ALL, { params: filters })
      return data.data || data;
    },
    staleTime: 1 * 60 * 1000,
    refetchInterval: 30 * 1000,
  })
}

export function useOrderStatusCounts() {
  return useQuery({
    queryKey: ['admin-orders-counts'],
    queryFn: async () => {
      const { data } = await api.get(API_ENDPOINTS.ORDERS.ADMIN_ALL, { 
        params: { groupByStatus: true } 
      })
      return data.data || data;
    },
    staleTime: 1 * 60 * 1000,
  })
}

export function useAdminOrder(id: string) {
  return useQuery<Order>({
    queryKey: ['admin-order', id],
    queryFn: async () => {
      const { data } = await api.get(API_ENDPOINTS.ORDERS.DETAIL(id)); // Note: this might need adjustment if admin detail route is different
      return data.data || data
    },
    enabled: !!id
  })
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, status, note }: { id: string, status: string, note?: string }) => {
      const { data } = await api.patch(API_ENDPOINTS.ORDERS.UPDATE_STATUS(id), { status, note })
      return data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] })
      queryClient.invalidateQueries({ queryKey: ['admin-orders-counts'] })
      queryClient.invalidateQueries({ queryKey: ['admin-order', variables.id] })
    }
  })
}
