import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Product } from '../../types'

interface WishlistState {
  items: Product[]
}

const initialState: WishlistState = {
  items: [],
}

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    setWishlistFromServer: (state, action: PayloadAction<Product[]>) => {
      state.items = action.payload || []
    },
    addToWishlist: (state, action: PayloadAction<Product>) => {
      const existingItem = state.items.find((item) => item.id === action.payload.id)
      if (!existingItem) {
        state.items.push(action.payload)
      }
    },
    removeFromWishlist: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload)
    },
    clearWishlist: (state) => {
      state.items = []
    },
  },
})

export const { 
  setWishlistFromServer, 
  addToWishlist, 
  removeFromWishlist, 
  clearWishlist 
} = wishlistSlice.actions
export default wishlistSlice.reducer
