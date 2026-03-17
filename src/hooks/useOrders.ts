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
      return data;
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

export function useCreateOrder() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (dto: any) => {
      const { data } = await api.post(API_ENDPOINTS.ORDERS.CREATE, dto);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Order placed successfully!');
      router.push(`/orders/${data.id}`);
    },
    onError: (error: any) => {
      toast.error(handleApiError(error));
    },
  });
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
