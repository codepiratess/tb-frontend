'use client'

import React, { useState } from 'react'
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Bell, 
  Shield, 
  LogOut, 
  Camera, 
  Edit, 
  CheckCircle,
  Calendar,
  MapPin,
  Clock,
  Key,
  Database,
  Smartphone,
  ChevronRight,
  Globe
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'

export default function AdminProfilePage() {
  const { user } = useSelector((state: RootState) => state.auth)
  const [activeTab, setActiveTab] = useState('info')
  
  if (!user) return null

  const tabs = [
    { id: 'info', label: 'Personal Information', icon: User },
    { id: 'security', label: 'Security & Access', icon: Shield },
    { id: 'activity', label: 'Login History', icon: Clock },
    { id: 'preferences', label: 'Preferences', icon: Bell },
  ]

  return (
    <div className="max-w-6xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-2 duration-700">
      {/* Profile Header Card */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden relative group">
         <div className="h-48 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 border-b border-white/10 relative overflow-hidden">
             {/* Abstract Decorations */}
             <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-1000" />
             <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/2" />
             
             {/* Edit Cover */}
             <button className="absolute bottom-4 right-6 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-[10px] font-black uppercase text-white tracking-widest hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0">
               CHANGE COVER
             </button>
         </div>
         
         <div className="px-10 pb-10 relative">
            <div className="flex flex-col md:flex-row md:items-end gap-8 -mt-16 relative z-10">
               <div className="relative group/avatar">
                  <div className="w-32 h-32 rounded-[2rem] bg-white p-1.5 shadow-2xl overflow-hidden">
                     <div className="w-full h-full rounded-[1.7rem] bg-slate-900 flex items-center justify-center text-4xl font-black text-white ring-4 ring-slate-50">
                        {user.firstName.charAt(0)}
                     </div>
                  </div>
                  <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#2874F0] text-white rounded-xl shadow-lg shadow-blue-500/30 flex items-center justify-center hover:scale-110 active:scale-95 transition-all group-hover/avatar:rotate-12">
                     <Camera size={18} />
                  </button>
               </div>
               
               <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                     <h1 className="text-3xl font-black text-slate-900 tracking-tight">{user.firstName} {user.lastName}</h1>
                     <span className="px-3 py-1 bg-blue-50 text-[#2874F0] text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-blue-100">
                        PLATINUM {user.role}
                     </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-6">
                     <div className="flex items-center gap-2 text-sm font-bold text-slate-400">
                        <Mail size={16} className="text-[#2874F0]" />
                        {user.email}
                     </div>
                     <div className="flex items-center gap-2 text-sm font-bold text-slate-400">
                        <MapPin size={16} className="text-orange-500" />
                        Pune, India
                     </div>
                     <div className="flex items-center gap-2 text-sm font-bold text-slate-400">
                        <CheckCircle size={16} className="text-green-500" />
                        Account Verified
                     </div>
                  </div>
               </div>
               
               <div className="flex items-center gap-3">
                  <Button className="h-12 bg-slate-900 text-white font-black uppercase text-[10px] tracking-widest px-8 rounded-2xl shadow-xl shadow-slate-900/10 hover:bg-black transition-all">
                     UPDATE PROFILE
                  </Button>
               </div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 mt-10">
         {/* Sidebar Navigation */}
         <div className="lg:col-span-1 space-y-4">
            <div className="bg-white p-2 rounded-3xl border border-slate-100 shadow-sm space-y-1">
               {tabs.map((tab) => (
                  <button
                     key={tab.id}
                     onClick={() => setActiveTab(tab.id)}
                     className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        activeTab === tab.id 
                        ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/10' 
                        : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'
                     }`}
                  >
                     <tab.icon size={18} />
                     {tab.label}
                     {activeTab === tab.id && <ChevronRight size={14} className="ml-auto opacity-50" />}
                  </button>
               ))}
            </div>
            
            <button className="w-full flex items-center gap-3 px-7 py-5 bg-red-50 text-red-600 rounded-3xl text-[10px] font-black uppercase tracking-widest hover:bg-red-100 transition-all border border-red-100">
               <LogOut size={18} />
               TERMINATE SESSION
            </button>
         </div>

         {/* Content Area */}
         <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
               {activeTab === 'info' && (
                  <motion.div
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: -20 }}
                     className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-10 h-full"
                  >
                     <div>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Personal Information</h3>
                        <p className="text-slate-400 font-bold text-sm mt-1 uppercase tracking-widest text-[11px]">Identity & Contact Management</p>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-1.5 group">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 leading-none group-focus-within:text-[#2874F0] transition-colors">First Name</label>
                           <input type="text" defaultValue={user.firstName} className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#2874F0]/10 focus:border-[#2874F0] transition-all" />
                        </div>
                        <div className="space-y-1.5 group">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 leading-none group-focus-within:text-[#2874F0] transition-colors">Last Name</label>
                           <input type="text" defaultValue={user.lastName} className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#2874F0]/10 focus:border-[#2874F0] transition-all" />
                        </div>
                        <div className="space-y-1.5 group">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 leading-none group-focus-within:text-[#2874F0] transition-colors">Email ID</label>
                           <input type="email" readOnly value={user.email} className="w-full h-12 px-5 bg-slate-100 border border-slate-100 rounded-2xl text-sm font-bold text-slate-400 cursor-not-allowed outline-none" />
                        </div>
                        <div className="space-y-1.5 group">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 leading-none group-focus-within:text-[#2874F0] transition-colors">Primary Phone</label>
                           <input type="tel" placeholder="+91 98765 43210" className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#2874F0]/10 focus:border-[#2874F0] transition-all" />
                        </div>
                        <div className="md:col-span-2 space-y-1.5 group">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 leading-none group-focus-within:text-[#2874F0] transition-colors">Bio & Professional Summary</label>
                           <textarea placeholder="Tell us about your role in TownBolt..." className="w-full h-32 p-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#2874F0]/10 focus:border-[#2874F0] transition-all resize-none" />
                        </div>
                     </div>
                  </motion.div>
               )}

               {activeTab === 'security' && (
                  <motion.div
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: -20 }}
                     className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8"
                  >
                     <div>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Security & Credentials</h3>
                        <p className="text-slate-400 font-bold text-sm mt-1 uppercase tracking-widest text-[11px]">Account Access Integrity</p>
                     </div>

                     <div className="space-y-6">
                        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-between group hover:border-[#2874F0] transition-all">
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-[#2874F0] shadow-sm">
                                 <Key size={20} />
                              </div>
                              <div>
                                 <p className="text-sm font-black text-slate-900 leading-none mb-1">Passkey Protection</p>
                                 <p className="text-xs font-bold text-slate-400">Last changed <span className="text-slate-900">42 days ago</span> • Highly Secure</p>
                              </div>
                           </div>
                           <Button variant="outline" className="h-10 px-6 rounded-xl text-[10px] font-black border-slate-200 uppercase tracking-widest hover:bg-white">Update Password</Button>
                        </div>

                        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-between group hover:border-green-500 transition-all">
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-green-500 shadow-sm">
                                 <Smartphone size={20} />
                              </div>
                              <div>
                                 <p className="text-sm font-black text-slate-900 leading-none mb-1">Two-Factor Auth (2FA)</p>
                                 <p className="text-xs font-bold text-slate-400">Enabled via <span className="text-slate-900">Authenticator App</span> • +91 ***210</p>
                              </div>
                           </div>
                           <Button variant="outline" className="h-10 px-6 rounded-xl text-[10px] font-black border-green-200 text-green-600 bg-white uppercase tracking-widest cursor-default">MANAGED</Button>
                        </div>

                        <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100 flex items-center justify-between group">
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-[#2874F0] shadow-sm">
                                 <Globe size={20} />
                              </div>
                              <div>
                                 <p className="text-sm font-black text-[#2874F0] leading-none mb-1 uppercase tracking-tight">Active API Registry</p>
                                 <p className="text-xs font-bold text-slate-500">Integrate TownBolt with external administrative toolsets.</p>
                              </div>
                           </div>
                           <Button className="h-10 bg-[#2874F0] text-white px-6 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20">NEW KEY</Button>
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
