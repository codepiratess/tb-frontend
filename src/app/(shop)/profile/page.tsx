'use client'

import React, { useState } from 'react'
import { 
  User, 
  ShoppingBag, 
  Heart, 
  MapPin, 
  Lock, 
  LogOut, 
  ChevronRight, 
  Mail, 
  Phone, 
  Calendar, 
  CheckCircle, 
  Clock, 
  ArrowRight, 
  Settings, 
  ShieldCheck, 
  ExternalLink, 
  Star, 
  Package, 
  Truck, 
  CreditCard 
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

export default function UserProfilePage() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')

  const menuItems = [
    { id: 'profile', label: 'My Profile', icon: User, desc: 'Personal details and credentials' },
    { id: 'orders', label: 'My Orders', icon: ShoppingBag, desc: 'Track your purchases & history' },
    { id: 'wishlist', label: 'Wishlist', icon: Heart, desc: 'Items you saved for later' },
    { id: 'addresses', label: 'Addresses', icon: MapPin, desc: 'Manage your delivery locations' },
    { id: 'security', label: 'Security', icon: Lock, desc: 'Password and session management' },
  ]

  const orders = [
    { id: 'TB-847291', date: 'Mar 14, 2026', items: 2, total: 4299, status: 'delivered', img: 'https://placehold.co/100x100?text=Order' },
    { id: 'TB-842918', date: 'Feb 28, 2026', items: 1, total: 12999, status: 'shipped', img: 'https://placehold.co/100x100?text=Order' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Sidebar Navigation */}
        <div className="lg:col-span-4 space-y-8">
           {/* Profile Summary Card */}
           <div className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 p-8 border border-slate-50 relative overflow-hidden group">
              <div className="relative z-10 flex flex-col items-center">
                 <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#2874F0] to-blue-600 flex items-center justify-center text-3xl font-black text-white shadow-2xl shadow-blue-500/30 mb-4 transform rotate-3 group-hover:rotate-6 transition-transform">
                    {user?.firstName?.charAt(0) || 'U'}
                 </div>
                 <h2 className="text-2xl font-black text-slate-900 tracking-tight">{user?.firstName} {user?.lastName || ''}</h2>
                 <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">Premium Member • 12 Orders</p>
                 
                 <div className="mt-8 grid grid-cols-2 gap-4 w-full">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                       <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Tier Points</p>
                       <p className="text-lg font-black text-[#2874F0]">1,240</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                       <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Saved Items</p>
                       <p className="text-lg font-black text-slate-900">18</p>
                    </div>
                 </div>
              </div>
              {/* Decor */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl" />
           </div>

           {/* Navigation Menu */}
           <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/40 p-3 border border-slate-50 space-y-1">
              {menuItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between p-5 rounded-2xl transition-all group ${
                    activeTab === item.id 
                    ? 'bg-[#2874F0] text-white shadow-xl shadow-blue-500/20' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                   <div className="flex items-center gap-4">
                      <div className={`p-2.5 rounded-xl ${activeTab === item.id ? 'bg-white/10' : 'bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-[#2874F0]'}`}>
                         <item.icon size={20} />
                      </div>
                      <div className="text-left">
                         <span className="text-sm font-black uppercase tracking-tight block leading-none">{item.label}</span>
                         <span className={`text-[10px] font-bold ${activeTab === item.id ? 'text-blue-100' : 'text-slate-400'}`}>{item.desc}</span>
                      </div>
                   </div>
                   <ChevronRight size={18} className={`transition-transform ${activeTab === item.id ? 'translate-x-0' : '-translate-x-2 opacity-0 group-hover:opacity-100'}`} />
                </button>
              ))}
              
              <div className="px-5 py-4 pt-10">
                 <button 
                  onClick={logout}
                  className="w-full h-14 rounded-2xl border-2 border-slate-100 bg-white text-slate-400 hover:bg-red-50 hover:border-red-100 hover:text-red-500 transition-all font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3"
                 >
                    <LogOut size={18} /> Logout Session
                 </button>
              </div>
           </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-8">
           <AnimatePresence mode="wait">
              {activeTab === 'profile' && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="space-y-8"
                >
                   <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200/40 border border-slate-50 space-y-10">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-50">
                         <div>
                            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Account Information</h3>
                            <p className="text-sm font-bold text-slate-400 mt-1">Manage your basic details and how we contact you.</p>
                         </div>
                         <Button className="h-10 px-8 bg-slate-900 hover:bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-900/10">Edit Profile</Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                         <div className="space-y-6">
                            <div className="p-5 bg-slate-50/50 rounded-3xl border border-slate-100 group hover:border-[#2874F0]/30 transition-all">
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                                  <User size={12} /> Full Identity
                               </p>
                                <p className="text-lg font-black text-slate-900 tracking-tight">{user?.firstName} {user?.lastName || ''}</p>
                            </div>
                            <div className="p-5 bg-slate-50/50 rounded-3xl border border-slate-100 group hover:border-[#2874F0]/30 transition-all">
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                                  <Mail size={12} /> Email Address
                               </p>
                               <p className="text-lg font-black text-slate-900 tracking-tight">{user?.email || 'email@example.com'}</p>
                            </div>
                         </div>
                         <div className="space-y-6">
                            <div className="p-5 bg-slate-50/50 rounded-3xl border border-slate-100 group hover:border-[#2874F0]/30 transition-all">
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                                  <Phone size={12} /> Registered Mobile
                               </p>
                               <p className="text-lg font-black text-slate-900 tracking-tight">+91 98765 43210</p>
                            </div>
                            <div className="p-5 bg-slate-50/50 rounded-3xl border border-slate-100 group hover:border-[#2874F0]/30 transition-all">
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                                  <Calendar size={12} /> Member Since
                               </p>
                               <p className="text-lg font-black text-slate-900 tracking-tight">Jan 12, 2024</p>
                            </div>
                         </div>
                      </div>

                      <div className="pt-8 flex items-center gap-3 p-6 bg-blue-50 rounded-[2rem] border border-blue-100">
                         <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-blue-600 shadow-sm shrink-0">
                            <ShieldCheck size={24} />
                         </div>
                         <div className="min-w-0">
                            <p className="text-sm font-black text-blue-900 uppercase tracking-tight">Email Verified</p>
                            <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Double check your recovery settings periodically.</p>
                         </div>
                      </div>
                   </div>
                </motion.div>
              )}

              {activeTab === 'orders' && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                   <div className="flex items-center justify-between mb-4 px-2">
                      <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Recent Purchases</h3>
                      <span className="text-xs font-black text-slate-400 uppercase border border-slate-200 px-3 py-1 rounded-lg">Last 12 Months</span>
                   </div>
                   
                   <div className="space-y-6">
                      {orders.map((order, i) => (
                        <div key={i} className="bg-white p-6 rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-50 group hover:shadow-2xl transition-all">
                           <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                              <div className="flex items-center gap-6">
                                 <div className="w-20 h-20 rounded-2xl bg-slate-100 overflow-hidden relative shrink-0">
                                    <Image src={order.img} alt="Product" fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                                 </div>
                                 <div className="space-y-2">
                                    <p className="text-xs font-black text-[#2874F0] uppercase tracking-widest mb-1">ORDER ID: {order.id}</p>
                                    <h4 className="text-xl font-black text-slate-900 leading-none">₹{order.total.toLocaleString()}</h4>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-2">
                                       <Package size={12} /> {order.items} Units • {order.date}
                                    </p>
                                 </div>
                              </div>
                              <div className="flex flex-col items-end gap-3 w-full md:w-auto">
                                 <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${order.status === 'delivered' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                                    {order.status}
                                 </div>
                                 <button className="flex items-center gap-2 text-[10px] font-black text-slate-400 group-hover:text-slate-900 uppercase tracking-widest transition-colors">
                                    Order Details <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                 </button>
                              </div>
                           </div>
                        </div>
                      ))}
                   </div>

                   <Button className="w-full h-16 rounded-[2rem] border-2 border-dashed border-slate-200 bg-transparent text-slate-400 hover:bg-slate-50 hover:border-slate-300 font-black uppercase text-xs tracking-widest transition-all">
                      Browse Full History Registry
                   </Button>
                </motion.div>
              )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
