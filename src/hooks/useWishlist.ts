import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import api from '@/lib/api';
import { API_ENDPOINTS } from '@/constants';
import { RootState } from '@/store';
import { handleApiError } from '@/lib/errorHandler';

export function useWishlist() {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  return useQuery({
    queryKey: ['wishlist'],
    queryFn: async () => {
      const { data } = await api.get(API_ENDPOINTS.WISHLIST.GET);
      return data;
    },
    enabled: !!accessToken,
  });
}

export function useAddToWishlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      const { data } = await api.post(API_ENDPOINTS.WISHLIST.ADD(productId));
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast.success('Added to wishlist');
    },
    onError: (error: any) => {
      toast.error(handleApiError(error));
    },
  });
}

export function useRemoveFromWishlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      const { data } = await api.delete(API_ENDPOINTS.WISHLIST.REMOVE(productId));
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast.success('Removed from wishlist');
    },
    onError: (error: any) => {
      toast.error(handleApiError(error));
    },
  });
}
