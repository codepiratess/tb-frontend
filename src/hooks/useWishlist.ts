'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useDispatch, useSelector } from 'react-redux'
import api from '@/lib/api'
import {
  addToWishlist,
  removeFromWishlist,
  setWishlistFromServer,
  clearWishlist,
} from '@/store/slices/wishlistSlice'
import { RootState } from '@/store'
import toast from 'react-hot-toast'
import type { Product } from '@/types'

// Fetch wishlist from server
export const useServerWishlist = () => {
  const dispatch = useDispatch()
  const accessToken = useSelector((s: RootState) => s.auth.accessToken)

  return useQuery({
    queryKey: ['wishlist'],
    queryFn: async () => {
      const res = await api.get('/wishlist')
      const data = res.data?.data

      if (data?.products) {
        dispatch(setWishlistFromServer(data.products))
      }

      return data
    },
    enabled: !!accessToken,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  })
}

// Add to wishlist
export const useAddToWishlist = () => {
  const queryClient = useQueryClient()
  const dispatch = useDispatch()
  const accessToken = useSelector((s: RootState) => s.auth.accessToken)

  return useMutation({
    mutationFn: async (product: Product) => {
      dispatch(addToWishlist(product))
      if (!accessToken) return null
      const res = await api.post(`/wishlist/${product.id}`)
      return res.data?.data
    },
    onSuccess: (data) => {
      if (data?.products) {
        dispatch(setWishlistFromServer(data.products))
      }
      queryClient.invalidateQueries({ queryKey: ['wishlist'] })
      toast.success('Added to wishlist! ❤️')
    },
    onError: (_, product) => {
      dispatch(removeFromWishlist(product.id))
      toast.error('Failed to add to wishlist')
    },
  })
}

// Remove from wishlist
export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient()
  const dispatch = useDispatch()
  const accessToken = useSelector((s: RootState) => s.auth.accessToken)

  return useMutation({
    mutationFn: async (productId: string) => {
      dispatch(removeFromWishlist(productId))
      if (!accessToken) return null
      const res = await api.delete(`/wishlist/${productId}`)
      return res.data?.data
    },
    onSuccess: (data) => {
      if (data?.products) {
        dispatch(setWishlistFromServer(data.products))
      }
      queryClient.invalidateQueries({ queryKey: ['wishlist'] })
      toast.success('Removed from wishlist')
    },
  })
}

// Sync wishlist on login
export const useSyncWishlistOnLogin = () => {
  const dispatch = useDispatch()
  const queryClient = useQueryClient()
  const localItems = useSelector((s: RootState) => s.wishlist.items)

  return useMutation({
    mutationFn: async () => {
      if (localItems.length > 0) {
        const syncRes = await api.post('/wishlist/sync', { 
          productIds: localItems.map(p => p.id) 
        })
        return syncRes.data?.data
      }

      const res = await api.get('/wishlist')
      return res.data?.data
    },
    onSuccess: (data) => {
      if (data?.products) {
        dispatch(setWishlistFromServer(data.products))
        queryClient.invalidateQueries({ queryKey: ['wishlist'] })
      }
    },
    onError: (error) => {
      console.error('Wishlist sync failed:', error)
    },
  })
}
