import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export interface AdminUsersFilters {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export function useAdminUsers(filters: AdminUsersFilters = {}) {
  return useQuery({
    queryKey: ['admin-users', filters],
    queryFn: async () => {
      const { data } = await api.get('/users', {
        params: {
          ...filters,
          limit: filters.limit || 20,
          page: filters.page || 1,
        },
      });
      return data;
    },
    staleTime: 2 * 60 * 1000,
  });
}
