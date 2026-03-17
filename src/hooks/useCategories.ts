import { useQuery } from '@tanstack/react-query';
import { publicApi } from '@/lib/api';
import { API_ENDPOINTS } from '@/constants';
import { Category } from '@/types';

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await publicApi.get<Category[]>(API_ENDPOINTS.CATEGORIES.ALL);
      return data;
    },
    staleTime: 30 * 60 * 1000,
  });
}

export function useCategory(slug: string) {
  return useQuery({
    queryKey: ['category', slug],
    queryFn: async () => {
      const { data } = await publicApi.get<Category>(
        API_ENDPOINTS.CATEGORIES.DETAIL(slug)
      );
      return data;
    },
    enabled: !!slug,
    staleTime: 30 * 60 * 1000,
  });
}
