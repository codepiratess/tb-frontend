'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, Package, ChevronRight, Filter } from 'lucide-react'
import { motion } from 'framer-motion'
import { useOrders } from '../../../hooks/useOrders'
import { formatPrice, formatDate } from '../../../lib/utils'
import { ORDER_STATUS_COLORS } from '../../../constants'
import { Order, OrderItem } from '../../../types'

export default function OrdersPage() {
  const { data: orders, isLoading } = useOrders()
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const filteredOrders = orders?.filter((order: Order) => {
    if (filter !== 'all' && order.status !== filter) return false
    if (search) {
      const s = search.toLowerCase()
      // match order ID or item names
      return order.id.toLowerCase().includes(s) || 
             order.items.some((item: OrderItem) => item.product.name.toLowerCase().includes(s))
    }
    return true
  }) || []

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 flex flex-col lg:flex-row gap-6">
        
        {/* Sidebar Filters (Desktop) */}
        <div className="hidden lg:block w-64 shrink-0">
          <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-4 sticky top-24">
            <h2 className="font-bold text-lg text-gray-900 mb-4 border-b border-gray-100 pb-2">Filters</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Order Status</h3>
                <div className="space-y-2">
                  {[
                    { id: 'all', label: 'All Orders' },
                    { id: 'delivered', label: 'Delivered' },
                    { id: 'shipped', label: 'On the way' },
                    { id: 'cancelled', label: 'Cancelled' },
                    { id: 'returned', label: 'Returned' }
                  ].map(status => (
                    <label key={status.id} className="flex items-center gap-2 cursor-pointer group">
                      <input 
                        type="radio" 
                        name="order-status" 
                        value={status.id}
                        checked={filter === status.id}
                        onChange={() => setFilter(status.id)}
                        className="w-4 h-4 text-primary focus:ring-primary border-gray-300"
                      />
                      <span className="text-sm font-medium text-gray-700 group-hover:text-primary transition-colors">{status.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col gap-4">
          
          {/* Header & Search */}
          <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
               {/* Mobile Filter Toggle */}
              <div className="flex items-center gap-4 w-full md:w-auto">
                 <h1 className="text-lg font-bold text-gray-900 hidden md:block">My Orders</h1>
                 <select 
                    value={filter} 
                    onChange={e => setFilter(e.target.value)}
                    className="md:hidden flex-1 h-10 border border-gray-300 rounded-sm px-3 text-sm font-medium outline-none"
                 >
                    <option value="all">All Orders</option>
                    <option value="delivered">Delivered</option>
                    <option value="shipped">On the way</option>
                    <option value="cancelled">Cancelled</option>
                 </select>
              </div>

              {/* SearchBar */}
              <div className="relative w-full md:w-96">
                <input 
                  type="text" 
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search your orders here" 
                  className="w-full h-10 pl-4 pr-10 border border-gray-300 rounded-sm text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
                <button className="absolute right-0 top-0 h-10 w-12 bg-primary text-white flex items-center justify-center rounded-r-sm hover:bg-primary-dark">
                  <Search size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Orders List */}
          {isLoading ? (
            <div className="space-y-4">
               {[1,2,3].map(i => (
                 <div key={i} className="bg-white h-32 rounded-sm shadow-sm border border-gray-100 animate-pulse" />
               ))}
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-12 flex flex-col items-center justify-center text-center mt-4">
              <Package size={64} className="text-gray-300 mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">No orders found</h2>
              <p className="text-gray-500 mb-6">You haven&apos;t placed any orders matching your criteria.</p>
              <Link href="/products" className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-sm font-bold shadow-sm transition-colors">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order: Order) => (
                <Link key={order.id} href={`/orders/${order.id}`}>
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-sm shadow-sm border border-gray-100 p-4 md:p-6 hover:shadow-md transition-shadow cursor-pointer flex flex-col md:flex-row gap-6 relative group"
                  >
                    {/* Item Imgs */}
                    <div className="flex gap-4 items-start w-full md:w-1/2">
                      <div className="w-20 h-20 bg-gray-50 shrink-0 border border-gray-100 rounded-sm relative overflow-hidden">
                        <Image src={order.items[0].product.images[0]} alt="product" fill className="object-contain p-1" />
                        {order.items.length > 1 && (
                          <div className="absolute inset-0 bg-black/60 text-white flex items-center justify-center text-xs font-bold font-mono">
                            +{order.items.length - 1}
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-2 mb-1">
                          {order.items[0].product.name}
                        </h3>
                        {order.items.length > 1 && (
                          <p className="text-xs text-text-secondary">and {order.items.length - 1} more items</p>
                        )}
                        <p className="text-xs text-text-secondary font-mono mt-2 uppercase tracking-wide">ID: {order.id}</p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="md:w-1/6 flex md:justify-center">
                      <span className="font-bold text-gray-900">{formatPrice(order.totalAmount)}</span>
                    </div>

                    {/* Status */}
                    <div className="md:w-1/3 flex flex-col md:items-end justify-center">
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`w-2.5 h-2.5 rounded-full ${(ORDER_STATUS_COLORS[order.status as keyof typeof ORDER_STATUS_COLORS] || ORDER_STATUS_COLORS.pending).bg}`} />
                        <span className="font-bold text-sm text-gray-900 capitalize">
                          {order.status === 'pending' ? 'Processing' : 
                           order.status === 'shipped' ? 'On the way' : 
                           order.status}
                        </span>
                      </div>
                      {order.status === 'delivered' ? (
                        <p className="text-xs text-gray-500">Delivered on {formatDate(order.updatedAt)}</p>
                      ) : order.status === 'cancelled' ? (
                        <p className="text-xs text-gray-500">Cancelled on {formatDate(order.updatedAt)}</p>
                      ) : (
                        <p className="text-xs text-gray-500">Ordered on {formatDate(order.createdAt)}</p>
                      )}
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
