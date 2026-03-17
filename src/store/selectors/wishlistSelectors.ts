import { RootState } from '../index'

export const selectWishlistItems = (state: RootState) => state.wishlist?.items || []

export const selectWishlistCount = (state: RootState) => state.wishlist?.items?.length || 0

export const selectIsInWishlist = (productId: string) => (state: RootState) =>
  state.wishlist?.items?.some((item) => item.id === productId) || false
