'use client'

import React, { useState } from 'react'
import { Plus, Search, Filter, ChevronDown, ShoppingBag, IndianRupee, Truck, CheckCircle, Clock, MoreVertical, Eye, Download, Mail, ExternalLink, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useAdminOrders, useUpdateOrderStatus, useOrderStatusCounts } from '@/hooks/useAdminOrders'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { format, formatDistanceToNow, isToday } from 'date-fns'

type OrderStatus = 'all' | 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'

export default function AdminOrdersPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<OrderStatus>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const { data: ordersResponse, isLoading } = useAdminOrders({
    status: activeTab === 'all' ? undefined : activeTab,
    search: searchQuery || undefined,
    page: currentPage,
    limit: 20
  })

  const { data: statusCounts } = useOrderStatusCounts()

  const orders = ordersResponse?.data || []
  const totalCount = ordersResponse?.total || 0

  const tabs: { id: OrderStatus; label: string; count?: number }[] = [
    { id: 'all', label: 'All Orders', count: statusCounts?.all || 0 },
    { id: 'pending', label: 'Pending', count: statusCounts?.pending || 0 },
    { id: 'confirmed', label: 'Confirmed', count: statusCounts?.confirmed || 0 },
    { id: 'shipped', label: 'Shipped', count: statusCounts?.shipped || 0 },
    { id: 'delivered', label: 'Delivered', count: statusCounts?.delivered || 0 },
    { id: 'cancelled', label: 'Cancelled', count: statusCounts?.cancelled || 0 },
  ]

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'bg-green-50 text-green-600'
      case 'shipped': return 'bg-blue-50 text-blue-600'
      case 'confirmed': return 'bg-purple-50 text-purple-600'
      case 'pending': return 'bg-orange-50 text-orange-600'
      case 'cancelled': return 'bg-red-50 text-red-600'
      default: return 'bg-slate-50 text-slate-600'
    }
  }

  const todayOrdersCount = orders.filter(o => isToday(new Date(o.createdAt))).length

  return (
    <div className="space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            Orders
            <span className="text-sm font-black bg-blue-50 text-[#2874F0] px-3 py-1 rounded-full uppercase tracking-wider">
              {totalCount} Total
            </span>
          </h1>
          <p className="text-slate-500 font-bold mt-1">Monitor, manage and update customer order statuses.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-11 px-5 border-slate-200 font-black text-slate-700 bg-white gap-2 rounded-xl shadow-sm transition-all">
            <Download size={18} /> Export List
          </Button>
          <Button className="h-11 px-6 bg-[#2874F0] hover:bg-[#1a5dc8] gap-2 rounded-xl font-black text-white shadow-lg shadow-blue-500/20 transition-all">
            Dashboard View
          </Button>
        </div>
      </div>

      {/* Stats Row (Mini) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Today Orders', value: todayOrdersCount.toString(), icon: ShoppingBag, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: 'Pending', value: statusCounts?.pending?.toString() || '0', icon: Clock, color: 'text-orange-500', bg: 'bg-orange-50' },
          { label: 'Shipped', value: statusCounts?.shipped?.toString() || '0', icon: Truck, color: 'text-purple-500', bg: 'bg-purple-50' },
          { label: 'Completed', value: statusCounts?.delivered?.toString() || '0', icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 group hover:border-slate-200 transition-all">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
              <stat.icon size={22} />
            </div>
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
               <p className="text-lg font-black text-slate-900 leading-none">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-md:w-full max-w-md">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
           <input 
            type="text" 
            placeholder="Search by order number, customer name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-12 pr-4 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:outline-none"
           />
        </div>

        {/* Date Filters */}
        <div className="flex items-center gap-3">
           <button className="flex items-center gap-2 px-4 h-11 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-600 hover:border-slate-300 transition-all whitespace-nowrap">
              <Calendar size={16} />
              <span>Current Month</span>
              <ChevronDown size={14} />
           </button>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex items-center gap-1 bg-slate-100/50 p-1 rounded-xl w-fit overflow-x-auto no-scrollbar max-w-full">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-2.5 text-xs font-black rounded-lg transition-all whitespace-nowrap ${
              activeTab === tab.id 
              ? 'bg-white text-[#2874F0] shadow-sm' 
              : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {tab.label.toUpperCase()}
            {tab.count !== undefined && (
              <span className={`ml-2 px-1.5 py-0.5 rounded-full text-[9px] font-black tracking-widest ${
                activeTab === tab.id ? 'bg-blue-50 text-[#2874F0]' : 'bg-slate-200 text-slate-500'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden overflow-x-auto">
        <table className="w-full text-left min-w-[1000px]">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Order Summary</th>
              <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer Details</th>
              <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Date Placed</th>
              <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Amount</th>
              <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Payment</th>
              <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Fulfillment Status</th>
              <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td colSpan={7} className="px-6 py-8">
                    <div className="h-10 bg-slate-50 rounded-xl animate-pulse w-full" />
                  </td>
                </tr>
              ))
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-16 text-center">
                   <ShoppingBag size={48} className="mx-auto text-slate-200 mb-4" />
                   <p className="font-black text-slate-400">No matching orders found</p>
                </td>
              </tr>
            ) : orders.map((order: any) => (
              <tr key={order.id} className="hover:bg-slate-50 transition-colors group cursor-pointer" onClick={() => router.push(`/admin/orders/${order.id}`)}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-[#2874F0] group-hover:text-white transition-all">
                      <ShoppingBag size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900 leading-none mb-1 group-hover:text-[#2874F0] transition-colors">#{order.orderNumber}</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{order.items?.length || 0} Items Purchased</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <p className="text-sm font-black text-slate-900 leading-tight">
                      {order.user?.firstName} {order.user?.lastName}
                    </p>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 group-hover:text-[#2874F0] transition-colors">
                      <Mail size={12} /> {order.user?.email}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-xs font-bold text-slate-600">
                    {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-sm font-black text-slate-900">₹{order.totalAmount.toLocaleString()}</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${order.paymentStatus === 'paid' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                    {order.paymentStatus}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-slate-400 hover:text-[#2874F0] hover:bg-white rounded-lg shadow-sm transition-all border border-transparent hover:border-slate-100">
                      <Eye size={16} />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-white rounded-lg shadow-sm transition-all border border-transparent hover:border-slate-100">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination (Simplified) */}
      <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
        <p className="text-sm font-bold text-slate-500 italic">Page {currentPage} of {Math.ceil(totalCount / 20)} Registry Entries</p>
        <div className="flex items-center gap-2">
           <Button 
            variant="outline" 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            className="h-9 px-4 text-[10px] font-black uppercase tracking-widest border-slate-200 rounded-lg hover:bg-slate-50 transition-all disabled:opacity-30"
           >
             Older Orders
           </Button>
           <Button 
            variant="outline" 
            disabled={currentPage >= Math.ceil(totalCount / 20)}
            onClick={() => setCurrentPage(prev => prev + 1)}
            className="h-9 px-4 text-[10px] font-black uppercase tracking-widest border-slate-200 rounded-lg bg-slate-900 text-white shadow-lg shadow-slate-900/10 disabled:opacity-30"
           >
             Browse Latest
           </Button>
        </div>
      </div>
    </div>
  )
}
