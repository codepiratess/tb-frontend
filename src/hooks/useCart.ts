'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useDispatch, useSelector } from 'react-redux'
import api from '@/lib/api'
import { 
  addToCart, 
  removeFromCart,
  updateQuantity,
  setCartFromServer,
  clearCart,
} from '@/store/slices/cartSlice'
import { RootState } from '@/store'
import toast from 'react-hot-toast'
import type { Product } from '@/types'

// Fetch cart from server
export const useServerCart = () => {
  const dispatch = useDispatch()
  const accessToken = useSelector((s: RootState) => s.auth.accessToken)

  return useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const res = await api.get('/cart')
      const cartData = res.data?.data

      // Sync server cart to Redux
      if (cartData?.items) {
        const reduxItems = cartData.items.map((item: any) => ({
          product: item.product,
          quantity: item.quantity,
        }))
        dispatch(setCartFromServer(reduxItems))
      }

      return cartData
    },
    enabled: !!accessToken,
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: true, // Refetch when user switches tabs/windows
  })
}

// Add to cart
export const useAddToCart = () => {
  const queryClient = useQueryClient()
  const dispatch = useDispatch()
  const accessToken = useSelector((s: RootState) => s.auth.accessToken)

  return useMutation({
    mutationFn: async ({
      product,
      quantity = 1,
    }: {
      product: Product
      quantity?: number
    }) => {
      if (!accessToken) {
        // Not logged in: only Redux
        return null
      }
      const res = await api.post('/cart/items', { 
        productId: product.id, 
        quantity 
      })
      return res.data?.data
    },
    onMutate: async ({ product, quantity = 1 }) => {
      // Optimistic update
      dispatch(addToCart({ product, quantity }))
    },
    onSuccess: (serverCart) => {
      if (serverCart?.items) {
        const reduxItems = serverCart.items.map((item: any) => ({
          product: item.product,
          quantity: item.quantity,
        }))
        dispatch(setCartFromServer(reduxItems))
      }
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      toast.success('Added to cart! 🛒')
    },
    onError: (error, { product }) => {
      // Rollback
      dispatch(removeFromCart(product.id))
      toast.error('Failed to add to cart')
    },
  })
}

// Remove from cart
export const useRemoveFromCart = () => {
  const queryClient = useQueryClient()
  const dispatch = useDispatch()
  const accessToken = useSelector((s: RootState) => s.auth.accessToken)

  return useMutation({
    mutationFn: async (productId: string) => {
      dispatch(removeFromCart(productId))
      if (!accessToken) return null
      const res = await api.delete(`/cart/items/${productId}`)
      return res.data?.data
    },
    onSuccess: (serverCart) => {
      if (serverCart?.items) {
        const reduxItems = serverCart.items.map((item: any) => ({
          product: item.product,
          quantity: item.quantity,
        }))
        dispatch(setCartFromServer(reduxItems))
      }
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
    onError: () => {
      toast.error('Failed to remove item')
    },
  })
}

// Update cart item quantity
export const useUpdateCartItem = () => {
  const queryClient = useQueryClient()
  const dispatch = useDispatch()
  const accessToken = useSelector((s: RootState) => s.auth.accessToken)

  return useMutation({
    mutationFn: async ({
      productId,
      quantity,
    }: {
      productId: string
      quantity: number
    }) => {
      dispatch(updateQuantity({ productId, quantity }))
      if (!accessToken) return null

      if (quantity <= 0) {
        const res = await api.delete(`/cart/items/${productId}`)
        return res.data?.data
      }

      const res = await api.put(`/cart/items/${productId}`, { quantity })
      return res.data?.data
    },
    onSuccess: (serverCart) => {
      if (serverCart?.items) {
        const reduxItems = serverCart.items.map((item: any) => ({
          product: item.product,
          quantity: item.quantity,
        }))
        dispatch(setCartFromServer(reduxItems))
      }
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })
}

// Sync local cart to server after login
export const useSyncCartOnLogin = () => {
  const dispatch = useDispatch()
  const queryClient = useQueryClient()
  const localItems = useSelector((s: RootState) => s.cart.items)

  return useMutation({
    mutationFn: async () => {
      // Step 1: Get server cart
      const serverRes = await api.get('/cart')
      const serverCart = serverRes.data?.data

      // Step 2: If local has items not in server sync them up
      if (localItems.length > 0) {
        const localItemsForSync = localItems.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
        }))

        const syncRes = await api.post('/cart/sync', { items: localItemsForSync })
        return syncRes.data?.data
      }

      return serverCart
    },
    onSuccess: (finalCart) => {
      if (finalCart?.items) {
        const reduxItems = finalCart.items.map((item: any) => ({
          product: item.product,
          quantity: item.quantity,
        }))
        dispatch(setCartFromServer(reduxItems))
        queryClient.invalidateQueries({ queryKey: ['cart'] })
      }
    },
    onError: (error) => {
      console.error('Cart sync failed:', error)
    },
  })
}

// Clear cart
export const useClearCart = () => {
  const queryClient = useQueryClient()
  const dispatch = useDispatch()
  const accessToken = useSelector((s: RootState) => s.auth.accessToken)

  return useMutation({
    mutationFn: async () => {
      dispatch(clearCart())
      if (!accessToken) return null
      const res = await api.delete('/cart')
      return res.data?.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })
}
