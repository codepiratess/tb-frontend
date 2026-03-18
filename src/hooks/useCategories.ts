import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api, { publicApi } from '@/lib/api';
import { Category } from '@/types';
import { toast } from 'react-hot-toast';
import { handleApiError } from '@/lib/errorHandler';

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await publicApi.get('/categories');
      return data.data || data;
    },
    staleTime: 30 * 60 * 1000,
  });
}

export function useCategory(slug: string) {
  return useQuery({
    queryKey: ['category', slug],
    queryFn: async () => {
      const { data } = await publicApi.get(`/categories/${slug}`);
      return data.data || data;
    },
    enabled: !!slug,
    staleTime: 30 * 60 * 1000,
  });
}

// Admin hooks
export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dto: any) => {
      const res = await api.post('/categories', dto);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category created successfully!');
    },
    onError: (error: any) => {
      toast.error(handleApiError(error));
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, dto }: { id: string; dto: any }) => {
      const res = await api.put(`/categories/${id}`, dto);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category updated successfully!');
    },
    onError: (error: any) => {
      toast.error(handleApiError(error));
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(handleApiError(error));
    },
  });
}
