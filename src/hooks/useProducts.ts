import { useQuery } from '@tanstack/react-query';
import { publicApi } from '@/lib/api';
import { API_ENDPOINTS } from '@/constants';
import { Product } from '@/types';

interface ProductFilters {
  search?: string;
  q?: string;
  categoryId?: string;
  categorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  inStock?: boolean;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  sort?: string;
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function useProducts(filters: ProductFilters = {}) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: async () => {
      const { data } = await publicApi.get<PaginatedResponse<Product>>(
        API_ENDPOINTS.PRODUCTS.ALL,
        { params: filters }
      );
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const { data } = await publicApi.get<Product>(
        API_ENDPOINTS.PRODUCTS.DETAIL(slug)
      );
      return data;
    },
    enabled: !!slug,
    staleTime: 10 * 60 * 1000,
  });
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: async () => {
      const { data } = await publicApi.get<Product[]>(
        API_ENDPOINTS.PRODUCTS.FEATURED
      );
      return data;
    },
    staleTime: 15 * 60 * 1000,
  });
}

export function useNewArrivals() {
  return useQuery({
    queryKey: ['products', 'new-arrivals'],
    queryFn: async () => {
      const { data } = await publicApi.get<Product[]>(
        API_ENDPOINTS.PRODUCTS.NEW_ARRIVALS
      );
      return data;
    },
    staleTime: 15 * 60 * 1000,
  });
}

export function useSearchProducts(query: string) {
  return useQuery({
    queryKey: ['products', 'search', query],
    queryFn: async () => {
      const { data } = await publicApi.get<PaginatedResponse<Product>>(
        API_ENDPOINTS.PRODUCTS.SEARCH,
        { params: { q: query } }
      );
      return data;
    },
    enabled: query.length >= 2,
    staleTime: 2 * 60 * 1000,
  });
}
