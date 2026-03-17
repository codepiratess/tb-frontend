'use client'

import React, { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useSelector, useDispatch } from 'react-redux'
import { X, Trash2, ShoppingCart, Minus, Plus } from 'lucide-react'
import { RootState, AppDispatch } from '../../store'
import { removeFromCart, updateQuantity } from '../../store/slices/cartSlice'
import { selectCartTotal, selectCartCount } from '../../store/selectors/cartSelectors'
import { useCartDrawer } from '../../store/useCartDrawer'
import { formatPrice } from '../../lib/utils'

export function CartDrawer() {
  const dispatch = useDispatch<AppDispatch>()
  const { items } = useSelector((state: RootState) => state.cart)
  const cartTotal = useSelector(selectCartTotal)
  const cartCount = useSelector(selectCartCount)
  
  const isOpen = useCartDrawer((state) => state.isOpen)
  const closeCart = useCartDrawer((state) => state.closeCart)

  // Calculate savings (mock logic for now, assumes originalPrice is available)
  const totalOriginalPrice = items.reduce((total, item) => total + (item.product.originalPrice || item.product.price) * item.quantity, 0)
  const savings = totalOriginalPrice - cartTotal

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart()
    }
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, closeCart])

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      dispatch(updateQuantity({ id, quantity: newQuantity }))
    }
  }

  const handleRemove = (id: string) => {
    dispatch(removeFromCart(id))
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
            className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-[60] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white">
              <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                My Cart
                <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full font-bold">
                  {cartCount} items
                </span>
              </h2>
              <button
                onClick={closeCart}
                className="p-1.5 rounded-full hover:bg-gray-100 transition-colors text-text-secondary hover:text-text-primary"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto bg-gray-50/50 p-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                    <ShoppingCart size={40} className="text-gray-300" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary mb-1">Your cart is empty</h3>
                    <p className="text-text-secondary text-sm">Looks like you haven&apos;t added anything yet.</p>
                  </div>
                  <Link
                    href="/products"
                    onClick={closeCart}
                    className="mt-4 bg-primary text-white px-6 py-2.5 rounded-sm font-medium hover:bg-primary-dark transition-colors"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.product.id} className="bg-white p-3 rounded-sm border border-gray-100 flex gap-4 shadow-sm relative">
                      {/* Image */}
                      <Link 
                        href={`/products/${item.product.slug}`} 
                        className="w-[80px] h-[80px] flex-shrink-0 border border-gray-100 rounded-sm overflow-hidden bg-white flex items-center justify-center"
                        onClick={closeCart}
                      >
                        <Image
                          src={item.product.images[0] || 'https://picsum.photos/200/200'}
                          alt={item.product.name}
                          width={80}
                          height={80}
                          className="object-contain w-full h-full p-1"
                        />
                      </Link>

                      {/* Content */}
                      <div className="flex flex-col flex-1 min-w-0">
                        <Link 
                          href={`/products/${item.product.slug}`}
                          onClick={closeCart}
                          className="font-medium text-sm text-text-primary hover:text-primary transition-colors line-clamp-2 pr-6"
                        >
                          {item.product.name}
                        </Link>
                        
                        <div className="mt-1 flex items-center gap-2">
                          <span className="font-bold text-text-primary">{formatPrice(item.product.price)}</span>
                          {item.product.originalPrice > item.product.price && (
                            <span className="text-xs text-text-secondary line-through">
                              {formatPrice(item.product.originalPrice)}
                            </span>
                          )}
                        </div>

                        {/* Controls */}
                        <div className="mt-auto pt-3 flex items-center justify-between">
                          <div className="flex items-center border border-gray-200 rounded-sm">
                            <button
                              onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="w-7 h-7 flex items-center justify-center text-text-secondary hover:bg-gray-50 disabled:opacity-50 transition-colors"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-8 text-center text-sm font-medium border-x border-gray-200 h-7 flex items-center justify-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                              disabled={item.quantity >= Math.min(10, item.product.stock)}
                              className="w-7 h-7 flex items-center justify-center text-text-secondary hover:bg-gray-50 disabled:opacity-50 transition-colors"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => handleRemove(item.product.id)}
                        className="absolute top-3 right-3 text-gray-300 hover:text-accent transition-colors"
                        title="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>

                      {/* Discount Badge */}
                      {item.product.discount > 0 && (
                        <div className="absolute top-0 left-0 bg-success text-white text-[10px] font-bold px-1.5 py-0.5 rounded-br-sm z-10">
                          {item.product.discount}% OFF
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-100 bg-white p-4 space-y-3 shrink-0">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-text-secondary">Subtotal</span>
                  <span className="font-medium text-text-primary">{formatPrice(totalOriginalPrice)}</span>
                </div>
                
                {savings > 0 && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-text-secondary">Savings</span>
                    <span className="text-success font-medium">-{formatPrice(savings)}</span>
                  </div>
                )}
                
                <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                  <span className="font-semibold text-text-primary">Total Amount</span>
                  <span className="text-xl font-bold text-text-primary">{formatPrice(cartTotal)}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Link
                    href="/cart"
                    onClick={closeCart}
                    className="w-full h-11 border-2 border-primary text-primary font-medium flex items-center justify-center rounded-sm hover:bg-primary/5 transition-colors"
                  >
                    View Full Cart
                  </Link>
                  <Link
                    href="/checkout"
                    onClick={closeCart}
                    className="w-full h-11 bg-primary text-white font-medium flex items-center justify-center rounded-sm hover:bg-primary-dark shadow-sm transition-colors"
                  >
                    Checkout Now
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default CartDrawer
