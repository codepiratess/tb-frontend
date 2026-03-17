'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useSelector, useDispatch } from 'react-redux'
import { ShoppingCart, Minus, Plus, Trash2, Heart } from 'lucide-react'
import { RootState } from '../../../store'
import { removeFromCart, updateQuantity, clearCart } from '../../../store/slices/cartSlice'
import { addToWishlist } from '../../../store/slices/wishlistSlice'
import { formatPrice } from '../../../lib/utils'
import { Product } from '../../../types'

export default function CartPage() {
  const dispatch = useDispatch()
  const { items } = useSelector((state: RootState) => state.cart)
  
  const [selectedItems, setSelectedItems] = useState<string[]>(items.map(i => i.product.id))

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedItems(items.map(i => i.product.id))
    } else {
      setSelectedItems([])
    }
  }

  const handleSelectItem = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(prev => prev.filter(i => i !== id))
    } else {
      setSelectedItems(prev => [...prev, id])
    }
  }

  const handleRemoveSelected = () => {
    selectedItems.forEach(id => {
      dispatch(removeFromCart(id))
    })
    setSelectedItems([])
  }

  const handleSaveForLater = (product: Product) => {
    dispatch(addToWishlist(product))
    dispatch(removeFromCart(product.id))
  }

  // Calculate totals for selected items only
  const selectedCartItems = items.filter(item => selectedItems.includes(item.product.id))
  const totalItems = selectedCartItems.reduce((acc, item) => acc + item.quantity, 0)
  const totalOriginalPrice = selectedCartItems.reduce((acc, item) => acc + (item.product.originalPrice * item.quantity), 0)
  const totalPrice = selectedCartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0)
  const discountTotal = totalOriginalPrice - totalPrice
  const deliveryCharges = totalPrice > 499 ? 0 : (totalItems > 0 ? 40 : 0)
  const finalTotal = totalPrice + deliveryCharges

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-[60vh] bg-gray-50 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 rounded-sm shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center w-full max-w-2xl"
        >
          <div className="w-48 h-48 mb-6 text-gray-200">
             {/* Mock SVG for shopping cart illustration */}
             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty!</h2>
          <p className="text-gray-500 mb-6">Add items to it now</p>
          <Link 
            href="/products" 
            className="px-8 py-3 bg-primary text-white font-bold rounded-sm shadow-sm hover:bg-primary-dark transition-colors"
          >
            Shop Now
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 flex flex-col lg:flex-row gap-6">
        
        {/* LEFT COLUMN: Cart Items */}
        <div className="flex-1 flex flex-col gap-4">
          
          <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-4 flex items-center justify-between">
            <h1 className="text-lg font-bold text-gray-900">
              My Cart ({items.length} items)
            </h1>
          </div>

          <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-4 flex items-center justify-between">
             <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                className="w-4 h-4 text-primary rounded ring-primary focus:ring-primary border-gray-300 cursor-pointer"
                checked={selectedItems.length === items.length && items.length > 0}
                onChange={handleSelectAll}
              />
              <span className="font-medium text-gray-900">Select All</span>
            </label>
            {selectedItems.length > 0 && (
              <button 
                onClick={handleRemoveSelected}
                className="text-error font-medium text-sm flex items-center gap-1 hover:bg-red-50 px-2 py-1 rounded"
              >
                <Trash2 size={16} /> Remove Selected
              </button>
            )}
          </div>

          <div className="flex flex-col bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-100">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div 
                  key={item.product.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0, transition: { duration: 0.2 } }}
                  className="p-4 md:p-6 flex flex-col sm:flex-row gap-4 md:gap-6 bg-white overflow-hidden relative"
                >
                  {/* Select Checkbox */}
                  <div className="flex sm:block shrink-0 mt-2">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 text-primary rounded ring-primary focus:ring-primary border-gray-300 cursor-pointer"
                      checked={selectedItems.includes(item.product.id)}
                      onChange={() => handleSelectItem(item.product.id)}
                    />
                  </div>

                  {/* Image */}
                  <div className="w-24 h-24 shrink-0 relative bg-gray-50 rounded-sm overflow-hidden border border-gray-100 group">
                    <Link href={`/products/${item.product.slug}`}>
                      <Image 
                        src={item.product.images[0] || 'https://picsum.photos/200'}
                        alt={item.product.name}
                        fill
                        className="object-contain p-2 mix-blend-multiply group-hover:scale-105 transition-transform"
                      />
                    </Link>
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col md:flex-row gap-4 justify-between">
                    <div className="flex flex-col">
                      <Link href={`/products/${item.product.slug}`} className="hover:text-primary transition-colors">
                        <h3 className="text-base font-semibold text-gray-900 line-clamp-2 mb-1">
                          {item.product.name}
                        </h3>
                      </Link>
                      <span className="text-xs text-text-secondary mb-3">Seller: TownBolt</span>
                      
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-lg font-bold text-gray-900">{formatPrice(item.product.price)}</span>
                        {item.product.discount > 0 && (
                          <>
                            <span className="text-sm font-medium text-gray-500 line-through">
                              {formatPrice(item.product.originalPrice)}
                            </span>
                            <span className="text-sm font-bold text-success">
                              {item.product.discount}% Off
                            </span>
                          </>
                        )}
                      </div>

                      <div className="text-xs font-medium text-gray-900 mb-4 sm:mb-0">
                        Delivery by Tomorrow | <span className="text-success">{item.product.price > 499 ? 'Free' : '₹40'}</span>
                      </div>
                    </div>

                    {/* Quantity & Actions */}
                    <div className="flex flex-row md:flex-col justify-between items-center sm:items-start md:items-end gap-4 min-w-[200px]">
                      
                      {/* Quantity Control */}
                      <div className="flex items-center divide-x border border-gray-300 rounded-sm overflow-hidden bg-white">
                        <button 
                          onClick={() => dispatch(updateQuantity({ id: item.product.id, quantity: Math.max(1, item.quantity - 1) }))}
                          disabled={item.quantity <= 1}
                          className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 font-bold"
                        >
                          <Minus size={14} />
                        </button>
                        <div className="w-10 h-8 flex items-center justify-center text-sm font-bold bg-gray-50">
                          {item.quantity}
                        </div>
                        <button 
                          onClick={() => dispatch(updateQuantity({ id: item.product.id, quantity: Math.min(item.product.stock, item.quantity + 1) }))}
                          disabled={item.quantity >= item.product.stock}
                          className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 font-bold"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      {/* Links */}
                      <div className="flex items-center gap-4 text-sm font-bold">
                        <button 
                          onClick={() => handleSaveForLater(item.product)}
                          className="text-gray-900 hover:text-primary transition-colors flex items-center gap-1 uppercase"
                        >
                          <Heart size={16} /> Save for later
                        </button>
                        <button 
                          onClick={() => dispatch(removeFromCart(item.product.id))}
                          className="text-gray-900 hover:text-error transition-colors flex items-center gap-1 uppercase"
                        >
                          <Trash2 size={16} /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* RIGHT COLUMN: Order Summary */}
        <div className="lg:w-[350px] shrink-0">
          <div className="bg-white rounded-sm shadow-sm border border-gray-100 sticky top-24">
            
            <div className="p-4 border-b border-gray-100">
              <h2 className="text-gray-500 font-bold uppercase tracking-wide">Price Details</h2>
            </div>
            
            <div className="p-4 flex flex-col gap-4 text-base">
              <div className="flex justify-between text-gray-900 font-medium">
                <span>Price ({totalItems} items)</span>
                <span>{formatPrice(totalOriginalPrice)}</span>
              </div>
              <div className="flex justify-between text-gray-900 font-medium">
                <span>Discount</span>
                <span className="text-success">- {formatPrice(discountTotal)}</span>
              </div>
              <div className="flex justify-between text-gray-900 font-medium">
                <span>Delivery Charges</span>
                <span className={deliveryCharges === 0 ? "text-success" : "text-gray-900"}>
                  {deliveryCharges === 0 ? 'FREE Delivery' : formatPrice(deliveryCharges)}
                </span>
              </div>
            </div>

            <div className="p-4 border-t border-dashed border-gray-200">
              <div className="flex justify-between items-center text-xl font-bold text-gray-900">
                <span>Total Amount</span>
                <span>{formatPrice(finalTotal)}</span>
              </div>
            </div>

            {discountTotal > 0 && (
              <div className="p-3 bg-success/10 text-success font-bold text-sm text-center border-t border-gray-100">
                You will save {formatPrice(discountTotal)} on this order
              </div>
            )}

            <div className="p-4">
              <Link
                href={selectedItems.length > 0 ? "/checkout" : "#"}
                className={`w-full flex items-center justify-center py-4 rounded-sm font-bold text-lg shadow-sm transition-colors ${
                  selectedItems.length > 0 
                  ? "bg-accent hover:bg-orange-600 text-white" 
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                PLACE ORDER
              </Link>
            </div>
            
            <div className="p-4 border-t border-gray-100 text-xs text-gray-500 flex items-center gap-2 justify-center bg-gray-50 rounded-b-sm">
              <ShieldCheck size={16} className="text-gray-400" /> Safe and Secure Payments. Easy returns.
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

function ShieldCheck(props: { size?: number, className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size||24} height={props.size||24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
      <path d="m9 12 2 2 4-4"/>
    </svg>
  )
}
