import { create } from 'zustand'

interface CartDrawerState {
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
}

export const useCartDrawer = create<CartDrawerState>((set) => ({
  isOpen: false,
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
}))
