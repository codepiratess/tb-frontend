import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api, { publicApi } from '@/lib/api';
import { Product } from '@/types';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { handleApiError } from '@/lib/errorHandler';

interface ProductFilters {
  search?: string;
  q?: string;
  categoryId?: string;
  categorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStock?: boolean;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  sort?: string;
  includeInactive?: boolean;
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Public hooks
export function useProducts(filters: ProductFilters = {}) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: async () => {
      const { data } = await publicApi.get('/products', { params: filters });
      return data.data || data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const { data } = await publicApi.get(`/products/${slug}`);
      return data.data || data;
    },
    enabled: !!slug,
    staleTime: 10 * 60 * 1000,
  });
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: async () => {
      const { data } = await publicApi.get('/products/featured');
      return data.data || data;
    },
    staleTime: 10 * 60 * 1000,
  });
}

export function useNewArrivals() {
  return useQuery({
    queryKey: ['products', 'new-arrivals'],
    queryFn: async () => {
      const { data } = await publicApi.get('/products/new-arrivals');
      return data.data || data;
    },
    staleTime: 10 * 60 * 1000,
  });
}

export const useSearchProducts = (
  query: string
) => {
  return useQuery({
    queryKey: [
      'products', 'search', query
    ],
    queryFn: async () => {
      if (!query || 
          query.trim().length < 2) {
        return { 
          data: [], 
          total: 0, 
          suggestions: [] 
        }
      }
      try {
        const res = await publicApi.get(
          '/products/search',
          { 
            params: { 
              q: query.trim(), 
              limit: 8 
            } 
          }
        )
        
        // NestJS TransformInterceptor 
        // wraps in { success, data, ... }
        // The actual search result is 
        // inside res.data.data
        const result = res.data?.data 
          || res.data 
          || { data: [], total: 0,
               suggestions: [] }
        
        return {
          data: result.data || [],
          total: result.total || 0,
          suggestions: 
            result.suggestions || [],
        }
      } catch (error) {
        console.error(
          'Search API error:', error
        )
        return { 
          data: [], 
          total: 0, 
          suggestions: [] 
        }
      }
    },
    enabled: query.trim().length >= 2,
    staleTime: 30 * 1000,
    retry: 1,
  })
}


// Admin hooks
export function useAdminProducts(filters: ProductFilters = {}) {
  return useQuery({
    queryKey: ['admin', 'products', filters],
    queryFn: async () => {
      const { data } = await api.get('/products', { 
        params: { ...filters, includeInactive: true } 
      });
      return data.data || data;
    },
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (dto: any) => {
      const res = await api.post('/products', dto);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      toast.success('Product created successfully!');
      router.push('/admin/products');
    },
    onError: (error: any) => {
      toast.error(handleApiError(error));
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async ({ id, dto }: { id: string; dto: any }) => {
      const res = await api.put(`/products/${id}`, dto);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      queryClient.invalidateQueries({ queryKey: ['product', data.slug] });
      toast.success('Product updated successfully!');
      router.push('/admin/products');
    },
    onError: (error: any) => {
      toast.error(handleApiError(error));
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      toast.success('Product deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(handleApiError(error));
    },
  });
}

export function useToggleProductStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.patch(`/products/${id}/toggle-status`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      toast.success('Status updated');
    },
    onError: (error: any) => {
      toast.error(handleApiError(error));
    },
  });
}

export const useProductsByCategory = (
  slug: string,
  filters?: any
) => {
  return useQuery({
    queryKey: [
      'products', 'category', slug, filters
    ],
    queryFn: async () => {
      const res = await publicApi.get(
        '/products',
        {
          params: {
            categorySlug: slug,
            ...filters,
          }
        }
      )
      return res.data.data
    },
    enabled: !!slug && slug.length > 0,
    staleTime: 5 * 60 * 1000,
  })
}

export const useCategoryBySlug = (
  slug: string
) => {
  return useQuery({
    queryKey: ['category', slug],
    queryFn: async () => {
      const res = await publicApi.get(
        `/categories/${slug}`
      )
      return res.data.data
    },
    enabled: !!slug,
    staleTime: 30 * 60 * 1000,
  })
}

export function useToggleFeatured() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.patch(`/products/${id}/toggle-featured`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      toast.success('Featured status updated');
    },
    onError: (error: any) => {
      toast.error(handleApiError(error));
    },
  });
}
