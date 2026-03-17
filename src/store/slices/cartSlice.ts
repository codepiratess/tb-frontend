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
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const { id, quantity } = action.payload
      const existingItem = state.items.find((item) => item.product.id === id)
      if (existingItem) {
        if (quantity > 0) {
          existingItem.quantity = quantity
        } else {
          // Remove if 0
          state.items = state.items.filter((item) => item.product.id !== id)
        }
      }
    },
    clearCart: (state) => {
      state.items = []
    },
  },
})

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions
export default cartSlice.reducer
