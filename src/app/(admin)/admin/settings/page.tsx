'use client'

import React, { useState } from 'react'
import { 
  Settings, 
  Store, 
  CreditCard, 
  Truck, 
  Bell, 
  Shield, 
  Globe, 
  Mail, 
  Smartphone, 
  Database, 
  Lock, 
  ExternalLink, 
  Save, 
  ChevronRight,
  Plus,
  ArrowRight,
  Info,
  CheckCircle2
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('store')

  const tabs = [
    { id: 'store', label: 'Store Profile', icon: Store, desc: 'Branding & identity' },
    { id: 'payments', label: 'Payment Gateway', icon: CreditCard, desc: 'Flow & settlements' },
    { id: 'shipping', label: 'Delivery & Shipping', icon: Truck, desc: 'Zones & logistics' },
    { id: 'notifications', label: 'Notifications', icon: Bell, desc: 'SMS & Email alerts' },
    { id: 'config', label: 'Core Configuration', icon: Settings, desc: 'Internal overrides' },
  ]

  return (
    <div className="max-w-7xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4">
             System Settings
             <span className="text-xs font-black bg-slate-900 text-white px-3 py-1 rounded-full uppercase tracking-widest leading-none">V2.4.0</span>
          </h1>
          <p className="text-slate-500 font-bold mt-2">Global infrastructure configuration for the TownBolt ecosystem.</p>
        </div>
        <div className="flex items-center gap-3">
           <Button variant="outline" className="h-12 px-6 border-slate-200 font-black text-slate-700 bg-white gap-2 rounded-2xl shadow-sm">
             <Info size={18} /> View Docs
           </Button>
           <Button className="h-12 px-8 bg-[#2874F0] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/20">
             SAVE ALL CHANGES
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
         {/* Navigation Sidebar */}
         <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-3 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-2">
               {tabs.map((tab) => (
                  <button
                     key={tab.id}
                     onClick={() => setActiveTab(tab.id)}
                     className={`w-full flex items-center gap-4 px-6 py-5 rounded-[1.8rem] text-left transition-all relative overflow-hidden group ${
                        activeTab === tab.id 
                        ? 'bg-slate-900 text-white shadow-2xl shadow-slate-900/10' 
                        : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'
                     }`}
                  >
                     <tab.icon size={22} className={`${activeTab === tab.id ? 'text-blue-400' : 'text-slate-300'} group-hover:scale-110 transition-transform`} />
                     <div className="min-w-0">
                        <p className={`text-[10px] font-black uppercase tracking-widest leading-none mb-1 ${activeTab === tab.id ? 'text-white' : 'text-slate-900'}`}>
                           {tab.label}
                        </p>
                        <p className={`text-[9px] font-bold truncate leading-none ${activeTab === tab.id ? 'text-slate-400' : 'text-slate-400'}`}>
                           {tab.desc}
                        </p>
                     </div>
                     {activeTab === tab.id && <ArrowRight size={16} className="ml-auto opacity-50" />}
                  </button>
               ))}
            </div>

            <div className="p-6 bg-gradient-to-br from-blue-600 to-blue-700 rounded-[2.5rem] text-white space-y-4 shadow-xl shadow-blue-500/20 relative overflow-hidden">
                <div className="relative z-10">
                   <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Production Mode</p>
                   <p className="text-sm font-bold mt-1">Global store visibility is set to Public for all users.</p>
                   <button className="flex items-center gap-2 text-[10px] font-black uppercase mt-4 hover:underline">MANAGE VISIBILITY <ExternalLink size={14} /></button>
                </div>
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
            </div>
         </div>

         {/* Content Area */}
         <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
               {activeTab === 'store' && (
                  <motion.div
                     initial={{ opacity: 0, scale: 0.98 }}
                     animate={{ opacity: 1, scale: 1 }}
                     exit={{ opacity: 0, scale: 0.98 }}
                     className="space-y-8"
                  >
                     <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-10">
                        <div className="flex items-center justify-between">
                           <div>
                              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Store Profile</h3>
                              <p className="text-slate-400 font-bold text-sm mt-1 uppercase tracking-widest text-[11px]">Primary platform branding</p>
                           </div>
                           <Button variant="outline" className="h-10 px-6 rounded-xl text-[10px] font-black border-slate-200 uppercase tracking-widest">RESET DEFAULT</Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                           <div className="space-y-2 group">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Universal Site Title</label>
                              <input type="text" defaultValue="TownBolt - Premier E-Commerce" className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-1 focus:ring-[#2874F0]" />
                           </div>
                           <div className="space-y-2 group">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Support Email ID</label>
                              <input type="email" defaultValue="support@townbolt.com" className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-1 focus:ring-[#2874F0]" />
                           </div>
                           <div className="md:col-span-2 space-y-2 group">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Platform Meta Description</label>
                              <textarea className="w-full h-24 p-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-1 focus:ring-[#2874F0] resize-none" defaultValue="Premier shopping destination for high-end electronics and fashion." />
                           </div>
                        </div>

                        <div className="pt-6 border-t border-slate-50 space-y-6">
                           <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Branding Assets</h4>
                           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              {[
                                { label: 'Primary Logo', val: 'Logo_White.svg', icon: Globe },
                                { label: 'Favicon Icon', val: 'FAV_ICON.ico', icon: Smartphone },
                                { label: 'Mail Header', val: 'MAIL_BANNER.png', icon: Mail },
                              ].map((asset, i) => (
                                <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between group cursor-pointer hover:border-[#2874F0] transition-colors">
                                   <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-400 group-hover:text-[#2874F0] transition-colors">
                                         <asset.icon size={16} />
                                      </div>
                                      <div className="min-w-0">
                                         <p className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1">{asset.label}</p>
                                         <p className="text-[11px] font-bold text-slate-900 truncate">{asset.val}</p>
                                      </div>
                                   </div>
                                   <Plus size={14} className="text-slate-300 group-hover:text-[#2874F0] transition-colors" />
                                </div>
                              ))}
                           </div>
                        </div>
                     </div>
                  </motion.div>
               )}

               {activeTab === 'payments' && (
                  <motion.div
                     initial={{ opacity: 0, scale: 0.98 }}
                     animate={{ opacity: 1, scale: 1 }}
                     exit={{ opacity: 0, scale: 0.98 }}
                     className="space-y-8"
                  >
                     <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-10">
                        <div>
                           <h3 className="text-2xl font-black text-slate-900 tracking-tight">Active Payment Gateways</h3>
                           <p className="text-slate-400 font-bold text-sm mt-1 uppercase tracking-widest text-[11px]">Financial transaction routing</p>
                        </div>

                        <div className="space-y-6">
                           {[
                             { name: 'Razorpay (India)', id: 'rzp_main', status: 'Active', iconColor: 'text-[#2874F0]', bg: 'bg-[#2874F0]/5' },
                             { name: 'Stripe Global', id: 'stp_global', status: 'Sandbox', iconColor: 'text-purple-600', bg: 'bg-purple-50' },
                             { name: 'Cash on Delivery', id: 'cod_local', status: 'Disabled', iconColor: 'text-slate-400', bg: 'bg-slate-100' },
                           ].map((gw, i) => (
                             <div key={i} className="p-8 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-between group hover:border-[#2874F0] transition-all cursor-pointer">
                                <div className="flex items-center gap-6">
                                   <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${gw.bg} ${gw.iconColor}`}>
                                      <CreditCard size={28} />
                                   </div>
                                   <div>
                                      <p className="text-lg font-black text-slate-900 group-hover:text-[#2874F0] transition-colors">{gw.name}</p>
                                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">Registry ID: {gw.id}</p>
                                   </div>
                                </div>
                                <div className="flex items-center gap-6">
                                   <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${gw.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-slate-200 text-slate-500'}`}>
                                      {gw.status}
                                   </div>
                                   <ChevronRight size={20} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                                </div>
                             </div>
                           ))}
                        </div>
                     </div>
                  </motion.div>
               )}
            </AnimatePresence>
         </div>
      </div>
    </div>
  )
}
