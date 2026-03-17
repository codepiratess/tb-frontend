import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import api from '@/lib/api'
import { handleApiError } from '@/lib/errorHandler'

export function useAdminSubcategories() {
  return useQuery({
    queryKey: ['admin-subcategories'],
    queryFn: async () => {
      try {
        const { data } = await api.get('/admin/subcategories')
        return data.data || data
      } catch (error) {
        console.error('Failed to fetch subcategories:', error)
        return []
      }
    }
  })
}

export function useCreateSubcategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (dto: any) => {
      const { data } = await api.post('/admin/subcategories', dto)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-subcategories'] })
      toast.success('Sub-category created successfully!')
    },
    onError: (error: any) => {
      toast.error(handleApiError(error))
    }
  })
}

export function useUpdateSubcategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: any) => {
      const { data: response } = await api.put(`/admin/subcategories/${id}`, data)
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-subcategories'] })
      toast.success('Sub-category updated successfully!')
    },
    onError: (error: any) => {
      toast.error(handleApiError(error))
    }
  })
}

export function useDeleteSubcategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/subcategories/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-subcategories'] })
      toast.success('Sub-category deleted!')
    },
    onError: (error: any) => {
      toast.error(handleApiError(error))
    }
  })
}
