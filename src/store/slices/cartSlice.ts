import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CartItem, Product } from '../../types'

interface CartState {
  items: CartItem[]
}

const initialState: CartState = {
  items: [],
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartFromServer: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload || []
    },
    addToCart: (state, action: PayloadAction<{ product: Product; quantity?: number }>) => {
      const { product, quantity = 1 } = action.payload
      const existingItem = state.items.find((item) => item.product.id === product.id)
      if (existingItem) {
        existingItem.quantity += quantity
      } else {
        state.items.push({ product, quantity })
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.product.id !== action.payload)
    },
    updateQuantity: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
      const { productId, quantity } = action.payload
      const existingItem = state.items.find((item) => item.product.id === productId)
      if (existingItem) {
        if (quantity > 0) {
          existingItem.quantity = quantity
        } else {
          // Remove if 0
          state.items = state.items.filter((item) => item.product.id !== productId)
        }
      }
    },
    clearCart: (state) => {
      state.items = []
    },
  },
})

export const { 
  setCartFromServer, 
  addToCart, 
  removeFromCart, 
  updateQuantity, 
  clearCart 
} = cartSlice.actions
export default cartSlice.reducer
