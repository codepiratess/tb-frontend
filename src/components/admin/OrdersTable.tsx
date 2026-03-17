'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { 
  Eye, 
  RefreshCw, 
  Printer, 
  X, 
  MoreVertical, 
  ChevronDown, 
  ChevronUp,
  Download,
  Trash2,
  Package
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Order } from '@/types'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { format } from 'date-fns'

interface OrdersTableProps {
  orders: Order[] | undefined
  isLoading: boolean
  onStatusUpdate: (id: string, status: string) => void
  onViewOrder: (id: string) => void
  showPagination?: boolean
  pageSize?: number
}

type SortField = 'id' | 'createdAt' | 'totalAmount' | 'status'
type SortOrder = 'asc' | 'desc'

export const OrdersTable: React.FC<OrdersTableProps> = ({
  orders,
  isLoading,
  onStatusUpdate,
  onViewOrder,
  showPagination = true,
  pageSize = 10
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [sortField, setSortField] = useState<SortField>('createdAt')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked && orders) {
      setSelectedIds(orders.map(o => o.id))
    } else {
      setSelectedIds([])
    }
  }

  const handleSelectOne = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    )
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'success'
      case 'shipped': return 'secondary'
      case 'confirmed': return 'info'
      case 'cancelled': return 'danger'
      default: return 'warning'
    }
  }

  const getPaymentColor = (status: string) => {
    switch (status) {
      case 'paid': return 'success'
      case 'failed': return 'danger'
      default: return 'warning'
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price)
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    )
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
          <Package size={32} className="text-gray-300" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">No orders found</h3>
        <p className="text-gray-500 mt-1 max-w-xs">We couldn't find any orders matching your search criteria.</p>
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden">
      {/* Bulk Actions Bar */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="absolute top-0 left-0 right-0 z-20 bg-[#2874F0] text-white px-6 py-3 flex items-center justify-between shadow-lg rounded-t-xl"
          >
            <span className="font-semibold">{selectedIds.length} orders selected</span>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm font-medium">
                <Download size={16} /> Export Selected
              </button>
              <button className="flex items-center gap-2 px-3 py-1.5 bg-red-500 hover:bg-red-600 rounded-lg transition-colors text-sm font-medium">
                <Trash2 size={16} /> Delete Selected
              </button>
              <button onClick={() => setSelectedIds([])} className="p-1 hover:bg-white/10 rounded-full">
                <X size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-separate border-spacing-0">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-4 rounded-tl-xl border-b border-gray-100">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded border-gray-300 text-[#2874F0] focus:ring-[#2874F0]" 
                  onChange={handleSelectAll}
                  checked={selectedIds.length === orders.length && orders.length > 0}
                />
              </th>
              <th 
                className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider cursor-pointer border-b border-gray-100"
                onClick={() => handleSort('id')}
              >
                <div className="flex items-center gap-1">
                  Order ID {sortField === 'id' && (sortOrder === 'asc' ? <ChevronUp size={14}/> : <ChevronDown size={14}/>)}
                </div>
              </th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">Customer</th>
              <th 
                className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider cursor-pointer border-b border-gray-100"
                onClick={() => handleSort('createdAt')}
              >
                <div className="flex items-center gap-1">
                   Date {sortField === 'createdAt' && (sortOrder === 'asc' ? <ChevronUp size={14}/> : <ChevronDown size={14}/>)}
                </div>
              </th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">Items</th>
              <th 
                className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider cursor-pointer border-b border-gray-100"
                onClick={() => handleSort('totalAmount')}
              >
                <div className="flex items-center gap-1">
                  Amount {sortField === 'totalAmount' && (sortOrder === 'asc' ? <ChevronUp size={14}/> : <ChevronDown size={14}/>)}
                </div>
              </th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">Payment</th>
              <th 
                className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider cursor-pointer border-b border-gray-100"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center gap-1">
                  Status {sortField === 'status' && (sortOrder === 'asc' ? <ChevronUp size={14}/> : <ChevronDown size={14}/>)}
                </div>
              </th>
              <th className="px-6 py-4 rounded-tr-xl border-b border-gray-100"></th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {orders.map((order, idx) => (
              <tr 
                key={order.id} 
                className={`group hover:bg-blue-50/30 transition-colors ${selectedIds.includes(order.id) ? 'bg-blue-50/50' : ''}`}
              >
                <td className="px-6 py-4 border-b border-gray-100">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-gray-300 text-[#2874F0] focus:ring-[#2874F0]" 
                    checked={selectedIds.includes(order.id)}
                    onChange={() => handleSelectOne(order.id)}
                  />
                </td>
                <td className="px-6 py-4 border-b border-gray-100">
                  <span className="font-mono text-xs font-semibold text-[#2874F0] cursor-pointer" onClick={() => onViewOrder(order.id)}>
                    #{order.id.slice(0, 8).toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-[#2874F0] font-bold text-xs">
                      {order.shippingAddress.fullName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 line-clamp-1">{order.shippingAddress.fullName}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 border-b border-gray-100">
                   <p className="text-sm text-gray-500">{format(new Date(order.createdAt), 'MMM dd, hh:mm a')}</p>
                </td>
                <td className="px-6 py-4 border-b border-gray-100">
                  <p className="text-sm text-gray-900">{order.items.length} {order.items.length === 1 ? 'item' : 'items'}</p>
                  <p className="text-xs text-gray-400 truncate max-w-[120px]">
                    {order.items[0].product.name}
                  </p>
                </td>
                <td className="px-6 py-4 border-b border-gray-100">
                  <p className="text-sm font-bold text-gray-900">{formatPrice(order.totalAmount)}</p>
                </td>
                <td className="px-6 py-4 border-b border-gray-100">
                  <Badge variant={getPaymentColor(order.paymentStatus)} className="capitalize">
                    {order.paymentStatus}
                  </Badge>
                </td>
                <td className="px-6 py-4 border-b border-gray-100">
                  <Badge variant={getStatusColor(order.status)} className="capitalize">
                    {order.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 border-b border-gray-100 text-right">
                  <div className="relative inline-block text-left">
                    <button 
                      onClick={() => setOpenMenuId(openMenuId === order.id ? null : order.id)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
                    >
                      <MoreVertical size={18} />
                    </button>
                    
                    {openMenuId === order.id && (
                      <>
                        <div className="fixed inset-0 z-30" onClick={() => setOpenMenuId(null)}></div>
                        <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-40 transform origin-top-right transition-all">
                          <button 
                            onClick={() => { onViewOrder(order.id); setOpenMenuId(null); }}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <Eye size={16} /> View Details
                          </button>
                          <button 
                            onClick={() => { onStatusUpdate(order.id, 'confirmed'); setOpenMenuId(null); }}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <RefreshCw size={16} /> Update Status
                          </button>
                          <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-50">
                            <Printer size={16} /> Print Invoice
                          </button>
                          <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                            <X size={16} /> Cancel Order
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showPagination && orders.length > 0 && (
        <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-100 rounded-b-xl">
           <p className="text-sm text-gray-500">
            Showing <span className="font-medium">1</span> to <span className="font-medium">{orders.length}</span> of <span className="font-medium">{orders.length}</span> results
          </p>
          <div className="flex gap-2">
            <button className="px-4 py-1.5 text-sm font-medium text-gray-400 bg-white border border-gray-200 rounded-lg cursor-not-allowed">
              Previous
            </button>
            <button className="px-4 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:border-[#2874F0] transition-colors">
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
