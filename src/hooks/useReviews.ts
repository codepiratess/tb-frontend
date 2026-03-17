import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import api, { publicApi } from '@/lib/api';
import { API_ENDPOINTS } from '@/constants';
import { handleApiError } from '@/lib/errorHandler';

export function useProductReviews(productId: string, filters: any = {}) {
  return useQuery({
    queryKey: ['reviews', productId, filters],
    queryFn: async () => {
      const { data } = await publicApi.get(
        API_ENDPOINTS.REVIEWS.BY_PRODUCT(productId),
        { params: filters }
      );
      return data;
    },
    enabled: !!productId,
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dto: any) => {
      const { data } = await api.post(API_ENDPOINTS.REVIEWS.CREATE, dto);
      return data;
    },
    onSuccess: (data, vars: any) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', vars.productId] });
      queryClient.invalidateQueries({ queryKey: ['product', vars.productSlug || vars.productId] });
      toast.success('Review submitted! Pending approval.');
    },
    onError: (error: any) => {
      toast.error(handleApiError(error));
    },
  });
}
