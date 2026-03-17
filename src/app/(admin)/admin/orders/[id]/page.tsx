'use client'

import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  ChevronLeft, 
  Printer, 
  Truck, 
  Package, 
  MapPin, 
  CreditCard, 
  Calendar, 
  Clock, 
  Mail, 
  Phone, 
  User,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Plus
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useAdminOrder, useUpdateOrderStatus } from '@/hooks/useAdminOrders'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

export default function OrderDetailPage() {
  const { id } = useParams() as { id: string }
  const router = useRouter()
  
  const { data: orderResponse, isLoading } = useAdminOrder(id)
  const order = orderResponse as any // Use actual type if available

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
         <div className="w-10 h-10 border-4 border-slate-100 border-t-[#2874F0] rounded-full animate-spin" />
         <p className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Fetching Order #{id}...</p>
      </div>
    )
  }

  // Fallback if not found (Mock UI)
  const displayOrder = order || {
    id: id,
    createdAt: '2026-03-14T10:30:00Z',
    status: 'pending',
    paymentStatus: 'paid',
    paymentMethod: 'Razorpay (Online)',
    totalAmount: 14820,
    items: [
      { id: 1, name: 'Sony WH-1000XM5 Wireless Headphones', price: 2999, quantity: 2, image: 'https://placehold.co/100x100?text=Sony' },
      { id: 2, name: 'Samsung Galaxy Buds 2 Pro', price: 8822, quantity: 1, image: 'https://placehold.co/100x100?text=Samsung' },
    ],
    customer: {
      name: 'Aadesh Ittechxpert',
      email: 'aadesh.ittechxpert@gmail.com',
      phone: '+91 9876543210'
    },
    shippingAddress: {
      line1: '123 Tech Park, Phase II',
      city: 'Pune',
      state: 'Maharashtra',
      postalCode: '411001',
      country: 'India'
    }
  }

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

  return (
    <div className="space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <button 
            onClick={() => router.back()} 
            className="text-xs font-black text-slate-400 hover:text-[#2874F0] flex items-center gap-1 mb-2 uppercase tracking-widest transition-all"
          >
            <ChevronLeft size={14} /> Back to Orders
          </button>
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Order #{displayOrder.id.substring(0, 8)}</h1>
            <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusColor(displayOrder.status)}`}>
              {displayOrder.status}
            </span>
          </div>
          <p className="text-slate-500 font-bold mt-1">
             Placed on <span className="text-slate-900">March 14, 2026 • 12:44 PM</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-11 px-5 border-slate-200 font-black text-slate-700 bg-white gap-2 rounded-xl shadow-sm">
            <Printer size={18} /> Print Invoice
          </Button>
          <select className="h-11 bg-[#2874F0] text-white border-0 rounded-xl px-5 text-xs font-black uppercase tracking-widest outline-none shadow-lg shadow-blue-500/20 cursor-pointer">
            <option>Set Delivered</option>
            <option>Set Shipped</option>
            <option>Set Confirmed</option>
            <option>Cancel Order</option>
          </select>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Order Date', value: '14 Mar, 2026', icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: 'Payment Method', value: displayOrder.paymentMethod, icon: CreditCard, color: 'text-green-500', bg: 'bg-green-50' },
          { label: 'Shipping Address', value: `${displayOrder.shippingAddress.city}, ${displayOrder.shippingAddress.state}`, icon: MapPin, color: 'text-orange-500', bg: 'bg-orange-50' },
          { label: 'Delivery Estimate', value: '18 Mar, 2026', icon: Clock, color: 'text-purple-500', bg: 'bg-purple-50' },
        ].map((card, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${card.bg} ${card.color}`}>
              <card.icon size={22} />
            </div>
            <div className="min-w-0">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{card.label}</p>
               <p className="text-sm font-black text-slate-900 leading-tight truncate">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left (2/3): Products & Timeline */}
        <div className="lg:col-span-2 space-y-8">
          {/* Order Items */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
             <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                <h3 className="font-black text-slate-900 flex items-center gap-2">
                   <Package size={20} className="text-[#2874F0]" />
                   Ordered Items
                </h3>
                <span className="text-[10px] font-black text-slate-400 uppercase">{displayOrder.items.length} Units Total</span>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead className="bg-slate-50/50">
                    <tr>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Product</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Qty</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Price</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {displayOrder.items.map((item: any, idx: number) => (
                      <tr key={idx}>
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-4">
                             <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden relative shrink-0">
                               <Image src={item.image} alt={item.name} fill className="object-cover" />
                             </div>
                             <div>
                               <p className="text-sm font-black text-slate-900 leading-tight">{item.name}</p>
                               <p className="text-[10px] font-bold text-[#2874F0] uppercase tracking-tighter mt-1">Electronics • Mobiles</p>
                             </div>
                           </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                           <span className="text-sm font-black text-slate-600">x{item.quantity}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <span className="text-sm font-bold text-slate-600">₹{item.price.toLocaleString()}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <span className="text-sm font-black text-slate-900">₹{(item.price * item.quantity).toLocaleString()}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
               </table>
             </div>
             
             {/* Totals */}
             <div className="bg-slate-50/50 p-6 flex flex-col items-end gap-3 border-t border-slate-50">
                <div className="flex justify-between w-full max-w-[280px] text-sm font-bold text-slate-500">
                   <span>Subtotal</span>
                   <span>₹{displayOrder.totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between w-full max-w-[280px] text-sm font-bold text-slate-500">
                   <span>Shipping (Standard)</span>
                   <span className="text-green-500">FREE</span>
                </div>
                <div className="flex justify-between w-full max-w-[280px] pt-3 border-t border-slate-200">
                   <span className="text-lg font-black text-slate-900 uppercase">Grand Total</span>
                   <span className="text-xl font-black text-[#2874F0]">₹{displayOrder.totalAmount.toLocaleString()}</span>
                </div>
             </div>
          </div>

          {/* Timeline */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
             <h3 className="text-lg font-black text-slate-900 border-b border-slate-50 pb-4 flex items-center gap-2">
                <Clock size={20} className="text-[#2874F0]" />
                Order Journey
             </h3>
             <div className="space-y-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
                {[
                  { title: 'Order Delivered', time: 'Pending', status: 'upcoming', icon: CheckCircle },
                  { title: 'Out for Delivery', time: 'Pending', status: 'upcoming', icon: Truck },
                  { title: 'Order Dispatched', time: 'Yesterday, 4:22 PM', status: 'completed', icon: Package },
                  { title: 'Order Confirmed', time: '14 Mar, 1:05 PM', status: 'completed', icon: CheckCircle },
                  { title: 'Order Placed', time: '14 Mar, 12:44 PM', status: 'completed', icon: Plus },
                ].map((step, idx) => (
                  <div key={idx} className="flex gap-6 relative group">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center z-10 ${step.status === 'completed' ? 'bg-green-50 text-white' : 'bg-slate-100 text-slate-300'}`}>
                       <step.icon size={12} />
                    </div>
                    <div>
                       <p className={`text-sm font-black ${step.status === 'completed' ? 'text-slate-900' : 'text-slate-400'}`}>{step.title}</p>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{step.time}</p>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Right (1/3): Customer & Address */}
        <div className="space-y-8">
          {/* Customer Profile */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
             <div className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white relative overflow-hidden">
                <div className="relative z-10 flex flex-col items-center">
                   <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-2xl font-black mb-4 border border-white/20">
                      {displayOrder.customer.name.charAt(0)}
                   </div>
                   <h4 className="text-xl font-black tracking-tight">{displayOrder.customer.name}</h4>
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Premium Customer</p>
                </div>
                {/* Decoration */}
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl" />
             </div>
             
             <div className="p-6 space-y-5">
                <div className="flex items-center gap-4 group">
                   <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-[#2874F0] transition-colors">
                      <Mail size={18} />
                   </div>
                   <div className="min-w-0">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Email Address</p>
                      <p className="text-sm font-bold text-slate-900 truncate">{displayOrder.customer.email}</p>
                   </div>
                </div>
                <div className="flex items-center gap-4 group">
                   <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-green-50 group-hover:text-green-500 transition-colors">
                      <Phone size={18} />
                   </div>
                   <div className="min-w-0">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Phone Number</p>
                      <p className="text-sm font-bold text-slate-900 truncate">{displayOrder.customer.phone}</p>
                   </div>
                </div>
                <div className="h-px bg-slate-50"></div>
                <Link href="/admin/users/test-id" className="flex items-center justify-between text-xs font-black text-[#2874F0] hover:underline uppercase tracking-widest">
                   VIEW FULL PROFILE <ExternalLink size={14} />
                </Link>
             </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-5">
             <div className="flex items-center justify-between">
                <h3 className="font-black text-slate-900 flex items-center gap-2">
                   <MapPin size={18} className="text-[#2874F0]" />
                   Shipping Address
                </h3>
             </div>
             <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm font-bold text-slate-700 leading-relaxed">
                {displayOrder.customer.name}<br />
                {displayOrder.shippingAddress.line1}<br />
                {displayOrder.shippingAddress.city}, {displayOrder.shippingAddress.state}<br />
                PIN: {displayOrder.shippingAddress.postalCode}<br />
                {displayOrder.shippingAddress.country}
             </div>
          </div>

          {/* Internal Note */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
             <h3 className="font-black text-slate-900 flex items-center gap-2 uppercase tracking-widest text-[10px]">
                <AlertCircle size={14} className="text-slate-400" />
                Staff Note
             </h3>
             <textarea 
              className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm font-medium focus:outline-none min-h-[100px]"
              placeholder="Add a private note regarding this order..."
             />
             <Button className="w-full h-10 text-[10px] font-black uppercase tracking-widest border border-slate-200 bg-white text-slate-600 hover:bg-slate-50">Save Note</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
