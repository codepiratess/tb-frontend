import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import api from '@/lib/api';
import { API_ENDPOINTS } from '@/constants';
import { handleApiError } from '@/lib/errorHandler';

export function useAdminProducts(filters: any = {}) {
  return useQuery({
    queryKey: ['admin-products', filters],
    queryFn: async () => {
      const { data } = await api.get(API_ENDPOINTS.PRODUCTS.ALL, {
        params: { ...filters, includeInactive: true },
      });
      return data.data || data;
    },
  });
}

export function useAdminProduct(id: string) {
  return useQuery({
    queryKey: ['admin-product', id],
    queryFn: async () => {
      const { data } = await api.get(API_ENDPOINTS.PRODUCTS.DETAIL(id));
      return data.data || data;
    },
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (dto: any) => {
      const { data } = await api.post(API_ENDPOINTS.PRODUCTS.ALL, dto);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success('Product created!');
      router.push('/admin/products');
    },
    onError: (error: any) => {
      toast.error(handleApiError(error));
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...dto }: any) => {
      const { data } = await api.put(API_ENDPOINTS.PRODUCTS.DETAIL(id), dto);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['product', data.slug] });
      toast.success('Product updated!');
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
      await api.delete(API_ENDPOINTS.PRODUCTS.DETAIL(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success('Product deleted!');
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
      const { data } = await api.patch(API_ENDPOINTS.PRODUCTS.TOGGLE_STATUS(id));
      return data;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['admin-products'] });
      const previousProducts = queryClient.getQueryData(['admin-products']);

      queryClient.setQueryData(['admin-products'], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.map((p: any) =>
            p.id === id ? { ...p, isActive: !p.isActive } : p
          ),
        };
      });

      return { previousProducts };
    },
    onError: (err, id, context: any) => {
      queryClient.setQueryData(['admin-products'], context.previousProducts);
      toast.error(handleApiError(err as any));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    },
  });
}

export function useToggleFeatured() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.patch(API_ENDPOINTS.PRODUCTS.TOGGLE_FEATURED(id));
      return data;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['admin-products'] });
      const previousProducts = queryClient.getQueryData(['admin-products']);

      queryClient.setQueryData(['admin-products'], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.map((p: any) =>
            p.id === id ? { ...p, isFeatured: !p.isFeatured } : p
          ),
        };
      });

      return { previousProducts };
    },
    onError: (err, id, context: any) => {
      queryClient.setQueryData(['admin-products'], context.previousProducts);
      toast.error(handleApiError(err as any));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    },
  });
}

// Admin Orders
export function useAdminOrders(filters: any = {}) {
  return useQuery({
    queryKey: ['admin-orders', filters],
    queryFn: async () => {
      const { data } = await api.get(API_ENDPOINTS.ORDERS.ADMIN_ALL, { params: filters });
      return data;
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, dto }: { id: string; dto: any }) => {
      const { data } = await api.patch(API_ENDPOINTS.ORDERS.UPDATE_STATUS(id), dto);
      return data;
    },
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      queryClient.invalidateQueries({ queryKey: ['order', id] });
      toast.success('Order status updated!');
    },
    onError: (error: any) => {
      toast.error(handleApiError(error));
    },
  });
}

// Admin Analytics
export function useDashboardStats() {
  return useQuery({
    queryKey: ['admin-analytics', 'dashboard'],
    queryFn: async () => {
      const { data } = await api.get(API_ENDPOINTS.ANALYTICS.DASHBOARD);
      return data;
    },
    staleTime: 10 * 60 * 1000,
  });
}

export function useRevenueData(period: string = 'daily') {
  return useQuery({
    queryKey: ['admin-analytics', 'revenue', period],
    queryFn: async () => {
      const { data } = await api.get(API_ENDPOINTS.ANALYTICS.REVENUE, { params: { period } });
      return data;
    },
    staleTime: 10 * 60 * 1000,
  });
}

// Upload Hooks
export function useUploadImage() {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const { data } = await api.post(API_ENDPOINTS.UPLOAD.IMAGE, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    },
    onError: (error: any) => {
      toast.error(handleApiError(error));
    },
  });
}

export function useUploadImages() {
  return useMutation({
    mutationFn: async (files: File[]) => {
      const formData = new FormData();
      files.forEach((f) => formData.append('files', f));
      const { data } = await api.post(API_ENDPOINTS.UPLOAD.IMAGES, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    },
    onError: (error: any) => {
      toast.error(handleApiError(error));
    },
  });
}
