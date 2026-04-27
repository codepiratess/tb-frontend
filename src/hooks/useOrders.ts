import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import api from '@/lib/api';
import { API_ENDPOINTS } from '@/constants';
import { handleApiError } from '@/lib/errorHandler';
import { Order, PaginatedResponse } from '@/types';

export function useOrders(filters?: any) {
  return useQuery<Order[]>({
    queryKey: ['orders', filters],
    queryFn: async () => {
      const { data } = await api.get(API_ENDPOINTS.ORDERS.MY_ORDERS, { params: filters });
      // Handle paginated response - return data array or the data directly
      return data?.data || data || [];
    },
  });
}

export function useOrder(id: string) {
  return useQuery<Order>({
    queryKey: ['order', id],
    queryFn: async () => {
      const { data } = await api.get(API_ENDPOINTS.ORDERS.DETAIL(id));
      return data;
    },
    enabled: !!id,
  });
}

interface ShippingAddress {
  fullName: string
  phone: string
  addressLine1: string
  addressLine2?: string
  landmark?: string
  city: string
  state: string
  pincode: string
  addressType?: string
}

interface OrderItem {
  productId: string
  quantity: number
}

interface CreateOrderPayload {
  items: OrderItem[]
  shippingAddress: ShippingAddress
  paymentMethod: 'cod' | 'razorpay' | 
    'upi' | 'card' | 'netbanking'
  notes?: string
}

export const useCreateOrder = (
  options?: { autoRedirect?: boolean }
) => {
  const autoRedirect = 
    options?.autoRedirect ?? true
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: async (
      dto: CreateOrderPayload
    ) => {
      console.log(
        'Sending order to API:', 
        JSON.stringify(dto, null, 2)
      )
      const res = await api.post(
        '/orders', 
        dto
      )
      return res.data?.data
    },
    onSuccess: (order) => {
      queryClient.invalidateQueries(
        { queryKey: ['cart'] }
      )

      if (order.paymentMethod === 'cod') {
        // Only auto-redirect for COD
        queryClient.invalidateQueries(
          { queryKey: ['orders'] }
        )
        toast.success(
          '🎉 Order placed successfully!'
        )
        if (autoRedirect) {
          router.push(
            `/orders/${order.id}?success=true` 
          )
        }
      }
      // For razorpay: don't redirect here
      // Payment hook handles redirect after
      // payment verification
    },
    onError: (error: any) => {
      console.error('Create order error:', 
        error.response?.data
      )
      const msg = error.response?.data
        ?.message
      const errorText = Array.isArray(msg)
        ? msg.join('\n')
        : msg || 'Failed to place order'
      toast.error(errorText)
    },
  })
}

export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
      const { data } = await api.patch(API_ENDPOINTS.ORDERS.CANCEL(id), { reason });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Order cancelled');
    },
    onError: (error: any) => {
      toast.error(handleApiError(error));
    },
  });
}
