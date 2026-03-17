'use client'

import React, { useState } from 'react'
import { 
  Users, 
  Search, 
  Filter, 
  ChevronDown, 
  MoreVertical, 
  Mail, 
  Phone, 
  Calendar, 
  ShoppingBag, 
  IndianRupee, 
  ShieldCheck, 
  Ban, 
  Eye, 
  Download,
  Star,
  UserCheck,
  MapPin,
  Clock,
  ExternalLink,
  ChevronRight,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { motion, AnimatePresence } from 'framer-motion'
import { mockCustomers } from '@/lib/mockData'

export default function AdminUsersPage() {
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUser, setSelectedUser] = useState<any>(null)

  const stats = [
    { label: 'Total Registry', value: '3,847', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Active Today', value: '1,242', icon: UserCheck, color: 'text-green-500', bg: 'bg-green-50' },
    { label: 'Premium Tier', value: '184', icon: Star, color: 'text-purple-500', bg: 'bg-purple-50' },
    { label: 'Restricted', value: '12', icon: Ban, color: 'text-red-500', bg: 'bg-red-50' },
  ]

  return (
    <div className="space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
             Customer Hub
             <span className="text-xs font-black bg-slate-900 text-white px-3 py-1 rounded-full uppercase tracking-widest leading-none">REGISTRY</span>
          </h1>
          <p className="text-slate-500 font-bold mt-2 max-w-2xl">Audit, moderate and manage your global customer base and their interaction history.</p>
        </div>
        <div className="flex items-center gap-3">
           <Button variant="outline" className="h-12 px-6 border-slate-200 font-black text-slate-700 bg-white gap-2 rounded-2xl shadow-sm hover:bg-slate-50">
             <Download size={18} /> Export CSV
           </Button>
           <Button className="h-12 px-8 bg-[#2874F0] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:bg-[#1a5dc8]">
             Add New Member
           </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5 group hover:shadow-xl transition-all">
             <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${stat.bg} ${stat.color} group-hover:rotate-12 transition-transform`}>
                <stat.icon size={26} />
             </div>
             <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">{stat.label}</p>
                <p className="text-2xl font-black text-slate-900 leading-none">{stat.value}</p>
             </div>
          </div>
        ))}
      </div>

      {/* Filter Row */}
      <div className="bg-white p-5 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
            <input 
              type="text" 
              placeholder="Query by name, encrypted email or session ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-14 pl-14 pr-6 bg-slate-50 border border-slate-100 rounded-3xl text-sm font-bold focus:outline-none focus:ring-1 focus:ring-[#2874F0] transition-all"
            />
         </div>
         <div className="flex items-center gap-3 pb-2 md:pb-0 overflow-x-auto no-scrollbar">
            {['All', 'Active', 'Inactive', 'Blocked'].map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t.toLowerCase())}
                className={`px-6 h-11 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${
                  activeTab === t.toLowerCase() 
                  ? 'bg-slate-900 text-white shadow-lg' 
                  : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {t}
              </button>
            ))}
         </div>
      </div>

      {/* Modern Table Layout */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden overflow-x-auto">
         <table className="w-full text-left min-w-[1000px]">
            <thead className="bg-slate-50/50 border-b border-slate-100">
               <tr>
                 <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Profile & Identity</th>
                 <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Contact Channels</th>
                 <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Join Date</th>
                 <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Orders</th>
                 <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Engagement</th>
                 <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Account Security</th>
                 <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Moderation</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
               {mockCustomers.map((user: any) => (
                 <tr 
                  key={user.id} 
                  className="hover:bg-slate-50/80 transition-all cursor-pointer group"
                  onClick={() => setSelectedUser(user)}
                 >
                    <td className="px-8 py-5">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center text-white text-lg font-black shadow-lg shadow-slate-900/10 group-hover:scale-110 transition-transform">
                             {user.name.charAt(0)}
                          </div>
                          <div>
                             <p className="text-sm font-black text-slate-900 group-hover:text-[#2874F0] transition-colors">{user.name}</p>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">#{user.id.substring(0, 8)}</p>
                          </div>
                       </div>
                    </td>
                    <td className="px-8 py-5">
                       <div className="space-y-1">
                          <p className="text-xs font-bold text-slate-600 flex items-center gap-2">
                             <Mail size={12} className="text-slate-300" /> {user.email}
                          </p>
                          <p className="text-xs font-bold text-slate-600 flex items-center gap-2">
                             <Phone size={12} className="text-slate-300" /> {user.phone}
                          </p>
                       </div>
                    </td>
                    <td className="px-8 py-5 text-center">
                       <span className="text-xs font-black text-slate-400 uppercase tracking-tighter">{user.joinedDate}</span>
                    </td>
                    <td className="px-8 py-5 text-center">
                       <span className="text-sm font-black text-slate-900 bg-slate-100 px-3 py-1 rounded-lg">{user.orders}</span>
                    </td>
                    <td className="px-8 py-5 text-center">
                       <span className="text-sm font-black text-[#2874F0]">₹{user.spent.toLocaleString()}</span>
                    </td>
                    <td className="px-8 py-5 text-center">
                       <div className="flex justify-center">
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] ${user.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                             {user.status}
                          </span>
                       </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                       <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                          <button className="p-2.5 text-slate-400 hover:text-[#2874F0] hover:bg-white rounded-xl shadow-sm border border-transparent hover:border-slate-100 transition-all">
                             <Eye size={18} />
                          </button>
                          <button className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-white rounded-xl shadow-sm border border-transparent hover:border-slate-100 transition-all">
                             <Ban size={18} />
                          </button>
                          <button className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-white rounded-xl shadow-sm border border-transparent hover:border-slate-100 transition-all">
                             <MoreVertical size={18} />
                          </button>
                       </div>
                    </td>
                 </tr>
               ))}
            </tbody>
         </table>
      </div>

      {/* User Detail Side Panel (Overlay) */}
      <AnimatePresence>
         {selectedUser && (
           <>
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setSelectedUser(null)}
               className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]"
             />
             <motion.div 
               initial={{ x: '100%' }}
               animate={{ x: 0 }}
               exit={{ x: '100%' }}
               transition={{ type: 'spring', damping: 25, stiffness: 200 }}
               className="fixed right-0 top-0 h-full w-full max-w-xl bg-white shadow-[-20px_0_50px_rgba(0,0,0,0.1)] z-[101] overflow-y-auto"
             >
                <div className="h-48 bg-slate-900 relative">
                   <button 
                    onClick={() => setSelectedUser(null)}
                    className="absolute top-6 left-6 p-2 bg-white/10 backdrop-blur-md rounded-xl text-white hover:bg-white/20 transition-all"
                   >
                      <X size={20} />
                   </button>
                   <div className="absolute -bottom-16 left-10">
                      <div className="w-32 h-32 rounded-[2.5rem] bg-white p-1.5 shadow-2xl">
                         <div className="w-full h-full rounded-[2.2rem] bg-[#2874F0] flex items-center justify-center text-4xl font-black text-white shadow-inner">
                            {selectedUser.name.charAt(0)}
                         </div>
                      </div>
                   </div>
                   <div className="absolute bottom-6 right-8 flex gap-2">
                       <button className="px-5 py-2.5 bg-white text-slate-900 font-black text-[10px] rounded-xl uppercase tracking-widest shadow-xl">Edit Profile</button>
                       <button className="p-2.5 bg-red-500 text-white rounded-xl shadow-xl hover:bg-red-600 transition-all"><Ban size={18} /></button>
                   </div>
                </div>

                <div className="px-10 pt-20 pb-12 space-y-10">
                   <div>
                      <h2 className="text-3xl font-black text-slate-900 tracking-tight">{selectedUser.name}</h2>
                      <div className="flex items-center gap-4 mt-2">
                         <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                            <ShieldCheck size={14} className="text-green-500" />
                            Identity Verified
                         </span>
                         <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                            <Star size={14} className="text-[#2874F0]" />
                            8.4 Trust Score
                         </span>
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-6">
                      <div className="p-6 bg-slate-50/80 rounded-3xl border border-slate-100 space-y-3">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Total Lifetime Spend</p>
                         <p className="text-2xl font-black text-slate-900 flex items-center gap-1">
                            <IndianRupee size={22} className="text-green-600" />
                            {selectedUser.spent.toLocaleString()}
                         </p>
                         <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 w-3/4" />
                         </div>
                      </div>
                      <div className="p-6 bg-slate-50/80 rounded-3xl border border-slate-100 space-y-3">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Order Frequency</p>
                         <p className="text-2xl font-black text-[#2874F0]">{selectedUser.orders} <span className="text-xs text-slate-400">Purchases</span></p>
                         <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-[#2874F0] w-1/2" />
                         </div>
                      </div>
                   </div>

                   <div className="space-y-4">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2">Engagement Metadata</h4>
                      <div className="space-y-3">
                         {[
                           { label: 'E-mail Delivery', val: selectedUser.email, icon: Mail },
                           { label: 'Contact Number', val: selectedUser.phone, icon: Phone },
                           { label: 'Last Active Location', val: 'New Delhi, India', icon: MapPin },
                           { label: 'Platform Joined', val: selectedUser.joinedDate, icon: Calendar },
                           { label: 'Recent Activity', val: '4 hours ago • Added to Cart', icon: Clock },
                         ].map((item, i) => (
                           <div key={i} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-[#2874F0] transition-colors group">
                              <div className="flex items-center gap-3">
                                 <div className="w-9 h-9 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-[#2874F0] transition-colors">
                                    <item.icon size={16} />
                                 </div>
                                 <div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{item.label}</p>
                                    <p className="text-xs font-bold text-slate-800">{item.val}</p>
                                 </div>
                              </div>
                              <ChevronRight size={14} className="text-slate-300" />
                           </div>
                         ))}
                      </div>
                   </div>
                   
                   <div className="pt-4">
                      <Button className="w-full h-14 bg-slate-900 text-white rounded-[1.8rem] font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl flex items-center justify-center gap-3">
                         OPEN DATA REGISTRY <ExternalLink size={16} />
                      </Button>
                   </div>
                </div>
             </motion.div>
           </>
         )}
      </AnimatePresence>
    </div>
  )
}
