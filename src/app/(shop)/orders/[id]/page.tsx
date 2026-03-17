'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Check, ChevronRight, Download, Package, Truck, ShieldCheck } from 'lucide-react'
import { useOrders } from '../../../../hooks/useOrders'
import { formatPrice, formatDate } from '../../../../lib/utils'
import { Order, OrderItem } from '../../../../types'

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params)
  const { data: orders, isLoading } = useOrders()
  const order = orders?.find((o: Order) => o.id === id)

  if (isLoading) return <div className="container mx-auto p-20 text-center">Loading details...</div>
  
  if (!order) return (
    <div className="container mx-auto p-20 text-center">
      <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
      <Link href="/orders" className="text-primary hover:underline">Back to Orders</Link>
    </div>
  )

  const trackingSteps = [
    { id: 'placed', label: 'Order Placed', date: order.createdAt, done: true },
    { id: 'packed', label: 'Packed', date: order.updatedAt, done: ['shipped', 'delivered'].includes(order.status) || order.status === 'confirmed' },
    { id: 'shipped', label: 'Shipped', date: order.updatedAt, done: ['shipped', 'delivered'].includes(order.status) },
    { id: 'delivered', label: 'Delivered', date: order.updatedAt, done: order.status === 'delivered' }
  ]

  if (order.status === 'cancelled') {
    trackingSteps[3] = { id: 'cancelled', label: 'Cancelled', date: order.updatedAt, done: true }
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        
        {/* Breadcrumb & Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-text-secondary font-medium uppercase tracking-wide">
            <Link href="/" className="hover:text-primary">Home</Link>
            <ChevronRight size={12} />
            <Link href="/orders" className="hover:text-primary">My Orders</Link>
            <ChevronRight size={12} />
            <span className="text-text-primary">Order {order.id}</span>
          </div>
          
          <button className="hidden md:flex items-center gap-2 text-primary font-bold text-sm bg-white px-4 py-2 border border-gray-200 shadow-sm rounded-sm hover:bg-gray-50">
            <Download size={16} /> Download Invoice
          </button>
        </div>

        {/* Address & Actions Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-6 md:col-span-2">
            <h3 className="font-bold text-gray-900 mb-3 uppercase tracking-wide text-sm border-b border-gray-100 pb-2">Delivery Address</h3>
            <div className="text-sm">
              <p className="font-bold text-gray-900 mb-1">{order.shippingAddress.fullName}</p>
              <p className="text-gray-700 leading-relaxed max-w-sm">
                {order.shippingAddress.addressLine1}, {order.shippingAddress.addressLine2 ? order.shippingAddress.addressLine2 + ', ' : ''}
                {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
              </p>
              <p className="font-medium text-gray-900 mt-2">
                Phone number: {order.shippingAddress.phone}
              </p>
            </div>
          </div>
          <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-6 flex flex-col justify-between">
            <div>
               <h3 className="font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2 flex justify-between">
                 <span>Order Details</span>
               </h3>
               <div className="text-sm space-y-2 text-gray-700">
                 <div className="flex justify-between"><span>Order Date</span> <span className="font-medium">{formatDate(order.createdAt)}</span></div>
                 <div className="flex justify-between"><span>Order Total</span> <span className="font-bold">{formatPrice(order.totalAmount)}</span></div>
               </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-sm shadow-sm border border-gray-100 mb-4 overflow-hidden">
          {order.items.map((item: OrderItem, idx: number) => (
            <div key={idx} className="p-6 border-b border-gray-100 last:border-b-0 flex flex-col md:flex-row gap-8 relative">
              
              {/* Image & Main details */}
              <div className="flex gap-4 w-full md:w-1/2">
                <Link href={`/products/${item.product.slug}`} className="w-20 h-20 bg-gray-50 shrink-0 border border-gray-100 rounded-sm relative overflow-hidden group">
                  <Image src={item.product.images[0]} alt={item.product.name} fill className="object-contain p-1 group-hover:scale-105 transition-transform" />
                </Link>
                <div className="flex-1">
                  <Link href={`/products/${item.product.slug}`}>
                    <h3 className="text-sm font-semibold text-gray-900 hover:text-primary transition-colors line-clamp-2 mb-1">
                      {item.product.name}
                    </h3>
                  </Link>
                  <p className="text-xs text-text-secondary mb-2">Seller: TownBolt</p>
                  <p className="font-bold text-gray-900">{formatPrice(item.unitPrice)}</p>
                  
                  {/* Actions for delivered items */}
                  {order.status === 'delivered' && (
                    <div className="flex gap-4 mt-3">
                      <button className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
                        <ShieldCheck size={14} /> Return Item
                      </button>
                      <button className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
                         Write Review
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Tracker */}
              <div className="w-full md:w-1/2 md:border-l md:border-gray-100 md:pl-8 flex flex-col justify-center">
                {order.status === 'cancelled' ? (
                  <div className="flex items-center gap-3 text-error">
                    <div className="w-4 h-4 rounded-full bg-error" />
                    <div>
                      <h4 className="font-bold text-base">Cancelled</h4>
                      <p className="text-xs text-gray-500">As per your request on {formatDate(order.updatedAt)}</p>
                    </div>
                  </div>
                ) : (
                  <div className="relative pt-2">
                    {/* The Track Line */}
                    <div className="absolute left-[7px] top-4 bottom-5 w-0.5 bg-gray-200" />
                    
                    <div className="space-y-6">
                      {trackingSteps.map((step, sIdx) => {
                        if (order.status !== 'cancelled' && step.id === 'cancelled') return null

                        const isDone = step.done
                        const isCurrent = order.status === step.id || (order.status === 'pending' && step.id === 'placed')
                        
                        return (
                          <div key={sIdx} className="flex gap-4 items-start relative z-10">
                            {/* Dot */}
                            <div className={`w-[16px] h-[16px] rounded-full mt-0.5 shrink-0 flex items-center justify-center
                              ${isDone ? 'bg-success' : 'bg-gray-300'}
                              ${isCurrent && !isDone ? 'bg-primary animate-pulse w-[16px] h-[16px] ring-4 ring-primary/20' : ''}
                            `}>
                              {isDone && <Check size={10} className="text-white" strokeWidth={3} />}
                            </div>
                            {/* Text */}
                            <div>
                              <h4 className={`text-sm font-bold ${isDone || isCurrent ? 'text-gray-900' : 'text-gray-400'}`}>
                                {step.label}
                              </h4>
                              {isDone && step.date && (
                                <p className="text-xs text-gray-500">{formatDate(step.date)}</p>
                              )}
                              {!isDone && isCurrent && (
                                <p className="text-xs text-primary font-medium mt-1">Expected soon</p>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
