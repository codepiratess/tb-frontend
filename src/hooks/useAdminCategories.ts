import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import api from '@/lib/api'
import { API_ENDPOINTS } from '@/constants'
import { handleApiError } from '@/lib/errorHandler'

export function useAdminCategories() {
  return useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      try {
        const { data } = await api.get('/admin/categories')
        return data.data || data
      } catch (error) {
        console.error('Failed to fetch categories:', error)
        return [] // Return empty array on error
      }
    }
  })
}

export function useCreateCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (dto: any) => {
      const { data } = await api.post('/admin/categories', dto)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] })
      toast.success('Category created successfully!')
    },
    onError: (error: any) => {
      toast.error(handleApiError(error))
    }
  })
}

export function useUpdateCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...dto }: any) => {
      const { data } = await api.put(`/admin/categories/${id}`, dto)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] })
      toast.success('Category updated successfully!')
    },
    onError: (error: any) => {
      toast.error(handleApiError(error))
    }
  })
}

export function useDeleteCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/categories/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] })
      toast.success('Category deleted!')
    },
    onError: (error: any) => {
      toast.error(handleApiError(error))
    }
  })
}
