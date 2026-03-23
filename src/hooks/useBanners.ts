import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api, { publicApi } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { handleApiError } from '@/lib/errorHandler';

export function useBanners(onlyActive = false) {
  return useQuery({
    queryKey: ['banners', { onlyActive }],
    queryFn: async () => {
      const { data } = await publicApi.get('/banners', { params: { onlyActive } });
      return data.data || data;
    },
    staleTime: 10 * 60 * 1000,
  });
}

export function useCreateBanner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dto: any) => {
      const res = await api.post('/banners', dto);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
      toast.success('Banner created successfully!');
    },
    onError: (error: any) => {
      toast.error(handleApiError(error));
    },
  });
}

export function useUpdateBanner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, dto }: { id: string; dto: any }) => {
      const res = await api.put(`/banners/${id}`, dto);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
      toast.success('Banner updated successfully!');
    },
    onError: (error: any) => {
      toast.error(handleApiError(error));
    },
  });
}

export function useDeleteBanner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/banners/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
      toast.success('Banner deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(handleApiError(error));
    },
  });
}
