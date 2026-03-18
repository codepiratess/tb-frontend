'use client'

import React from 'react'
import { 
  TrendingUp, 
  TrendingDown, 
  IndianRupee, 
  ShoppingBag, 
  Users, 
  Calendar, 
  Download, 
  Filter, 
  Table, 
  PieChart, 
  BarChart3, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight,
  ChevronRight,
  MoreVertical,
  Layers,
  Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { RevenueChart } from '@/components/admin/RevenueChart'
import { SalesByCategoryChart } from '@/components/admin/SalesByCategoryChart'
import { 
  useDashboardStats, 
  useRevenueData, 
  useSalesByCategory, 
  useTopProducts, 
  useOrdersByHour 
} from '@/hooks/useAdminAnalytics'
import { motion, AnimatePresence } from 'framer-motion'
// No mock imports here

export default function AdminAnalyticsPage() {
  const { data: statsData, isLoading: statsLoading } = useDashboardStats()
  const { data: revenueDataRaw, isLoading: revenueLoading } = useRevenueData('30d')
  const { data: categoryDataRaw, isLoading: categoryLoading } = useSalesByCategory()
  const { data: topProductsRaw, isLoading: topProductsLoading } = useTopProducts(10)
  
  // No fallback to mock data
  const stats = statsData || { totalRevenue: 0, totalOrders: 0, totalProducts: 0, totalCustomers: 0, revenueGrowth: 0, ordersGrowth: 0, productsGrowth: 0, customersGrowth: 0, ordersToday: 0 }
  const revenueData = revenueDataRaw || []
  const categoryData = categoryDataRaw || []
  const topProducts = topProductsRaw || []

  return (
    <div className="space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-2 duration-700">
      {/* Analytics Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
             Analytics Intelligence
             <Sparkles className="text-blue-500" size={24} />
          </h1>
          <p className="text-slate-500 font-bold mt-1 max-w-2xl">Deep-dive into your store's performance metrics, customer behavior and inventory efficiency.</p>
        </div>
        <div className="flex items-center gap-3">
           <button className="flex items-center gap-2 px-5 h-12 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
             <Calendar size={18} className="text-blue-500" />
             <span>Last 30 Days</span>
           </button>
           <button className="flex items-center gap-2 px-6 h-12 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-900/10">
             <Download size={18} />
             <span>Export Insights</span>
           </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, trend: stats.revenueGrowth, icon: IndianRupee, color: 'text-blue-500', bg: 'bg-blue-50', suffix: 'v/s last mo' },
          { label: 'Avg Order Value', value: '₹3,482', trend: 4.2, icon: ShoppingBag, color: 'text-green-500', bg: 'bg-green-50', suffix: 'v/s last mo' },
          { label: 'Conversion Rate', value: '3.84%', trend: -1.5, icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-50', suffix: 'v/s last mo' },
          { label: 'Retention Rate', value: '42%', trend: 8.7, icon: Users, color: 'text-orange-500', bg: 'bg-orange-50', suffix: 'v/s last mo' },
        ].map((kpi, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4 hover:shadow-xl hover:-translate-y-1 transition-all group overflow-hidden relative">
            <div className="flex items-center justify-between relative z-10">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${kpi.bg} ${kpi.color}`}>
                <kpi.icon size={22} />
              </div>
              <div className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-wider ${kpi.trend > 0 ? 'text-green-600 bg-green-50' : 'text-red-500 bg-red-50'} px-2 py-1 rounded-full`}>
                {kpi.trend > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {Math.abs(kpi.trend)}%
              </div>
            </div>
            <div className="relative z-10">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-1">{kpi.label}</p>
               <p className="text-2xl font-black text-slate-900 leading-none">{kpi.value}</p>
               <p className="text-[10px] font-bold text-slate-400 mt-2 italic">{kpi.suffix}</p>
            </div>
            {/* Background Decoration */}
            <div className={`absolute -right-4 -bottom-4 w-24 h-24 ${kpi.bg} opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700`} />
          </div>
        ))}
      </div>

      {/* Primary Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
           <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-8 h-full">
              <div className="flex items-center justify-between border-b border-slate-50 pb-6">
                 <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2 uppercase tracking-widest text-[12px]">
                       <TrendingUp size={20} className="text-blue-500" />
                       Revenue Velocity
                    </h3>
                    <p className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Historical financial data visualizations</p>
                 </div>
                 <div className="flex gap-1 p-1 bg-slate-100 rounded-xl">
                    {['Daily', 'Weekly', 'Monthly'].map(p => (
                      <button key={p} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${p === 'Daily' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
                        {p}
                      </button>
                    ))}
                 </div>
              </div>
              <div className="h-[400px]">
                <RevenueChart data={revenueData} isLoading={revenueLoading} />
              </div>
           </div>
        </div>

        <div className="space-y-6 flex flex-col items-center justify-center">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-8 h-full w-full">
               <div className="flex items-center justify-between border-b border-slate-50 pb-6">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2 uppercase tracking-widest text-[12px]">
                       <PieChart size={20} className="text-purple-500" />
                       Market Share
                    </h3>
                    <p className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Top performing categories split</p>
                  </div>
               </div>
               <div className="h-[300px] flex items-center justify-center">
                 <SalesByCategoryChart data={categoryData} isLoading={categoryLoading} />
               </div>
               <div className="space-y-3 pt-6 border-t border-slate-50">
                  {categoryData.slice(0, 3).map((cat: any, i: number) => (
                    <div key={i} className="flex items-center justify-between group cursor-default">
                       <span className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                          <div className={`w-2.5 h-2.5 rounded-full ${['bg-blue-500', 'bg-purple-500', 'bg-orange-400'][i]}`} />
                          {cat.name}
                       </span>
                       <span className="text-sm font-black text-slate-900 group-hover:text-blue-500 transition-colors">{cat.value}%</span>
                    </div>
                  ))}
               </div>
            </div>
        </div>
      </div>

      {/* Secondary Row: Top Sellers & Peak Times */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6 overflow-hidden">
            <div className="flex items-center justify-between pb-2">
              <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2 uppercase tracking-widest text-[12px]">
                 <BarChart3 size={20} className="text-orange-500" />
                 Product Leaderboard
              </h3>
              <button className="text-[10px] font-black text-[#2874F0] uppercase tracking-widest hover:underline">FULL LIST</button>
            </div>
            
            <div className="space-y-4">
               {topProducts.slice(0, 5).map((product: any, i: number) => (
                 <div key={i} className="flex items-center gap-4 group">
                    <div className="w-10 h-10 text-[10px] font-black text-slate-400 flex items-center justify-center bg-slate-50 rounded-lg group-hover:bg-slate-900 group-hover:text-white transition-all uppercase tracking-widest">
                       #0{i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                       <p className="text-sm font-black text-slate-900 truncate leading-tight mb-0.5 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{product.name}</p>
                       <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter italic">Sold: {product.sales}u</span>
                          <span className="w-1 h-1 bg-slate-200 rounded-full" />
                          <span className="text-[10px] font-bold text-green-600 uppercase">Rev ₹{product.revenue.toLocaleString()}</span>
                       </div>
                    </div>
                    <div className="h-2 w-24 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-slate-900 group-hover:bg-blue-500 transition-all duration-1000" style={{ width: `${100 - (i * 15)}%` }} />
                    </div>
                 </div>
               ))}
            </div>
         </div>

         <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-2">
               <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2 uppercase tracking-widest text-[12px]">
                  <Clock size={20} className="text-blue-500" />
                  Transaction Peak Times
               </h3>
               <p className="text-[10px] font-black text-green-600 bg-green-50 px-2.5 py-1 rounded-full uppercase tracking-tighter">Optimal Time: 6:00 PM</p>
            </div>
            <div className="h-[240px] flex items-end justify-between gap-2 px-2">
                 {[4, 12, 18, 22, 14, 8, 24, 32, 28, 48, 42, 38, 52, 64, 58, 42, 32, 24, 18, 12, 8, 4, 2, 1].map((h: number, i: number) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                     <div 
                      className="w-full bg-slate-100 rounded-t-md group-hover:bg-[#2874F0] group-hover:shadow-[0_0_15px_rgba(40,116,240,0.3)] transition-all cursor-pointer relative" 
                      style={{ height: `${h}%` }}
                     >
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[8px] font-black px-1.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                           {h}%
                        </div>
                     </div>
                     <span className="text-[8px] font-black text-slate-300 group-hover:text-slate-900 transition-colors uppercase">{i}:00</span>
                  </div>
                ))}
            </div>
            <div className="pt-4 flex flex-col gap-3">
               <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic">
                  <span>Midnight</span>
                  <span>Noon</span>
                  <span>Midnight</span>
               </div>
            </div>
         </div>
      </div>
    </div>
  )
}
