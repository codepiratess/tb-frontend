'use client'

import React, { useMemo, useState } from 'react'
import { 
  IndianRupee, 
  ShoppingBag, 
  Package, 
  Users, 
  Plus, 
  Tag, 
  BarChart3, 
  Download,
  AlertTriangle,
  ArrowRight,
  Calendar,
  Settings,
  Activity,
  CheckCircle2,
  XCircle,
  RefreshCw
} from 'lucide-react'
import { StatsCard } from '@/components/admin/StatsCard'
import { RevenueChart } from '@/components/admin/RevenueChart'
import { SalesByCategoryChart } from '@/components/admin/SalesByCategoryChart'
import { RecentOrdersWidget } from '@/components/admin/RecentOrdersWidget'
import { TopProductsWidget } from '@/components/admin/TopProductsWidget'
import { LowStockWidget } from '@/components/admin/LowStockWidget'
import { useDashboardStats, useRevenueData, useSalesByCategory, useTopProducts } from '@/hooks/useAdminAnalytics'
import { useAdminOrders } from '@/hooks/useAdminOrders'
import { useAdminProducts } from '@/hooks/useAdminProducts'
import { motion } from 'framer-motion'
import Link from 'next/link'
import api, { publicApi } from '@/lib/api'
// Removed mock imports

export default function AdminDashboard() {
  const { data: statsData, isLoading: statsLoading } = useDashboardStats()
  const { data: revenueDataRaw, isLoading: revenueLoading } = useRevenueData('7d')
  const { data: categoryDataRaw, isLoading: categoryLoading } = useSalesByCategory()
  const { data: topProductsRaw, isLoading: topProductsLoading } = useTopProducts(5)
  const { data: ordersData, isLoading: ordersLoading } = useAdminOrders({ limit: 5 })
  const { data: lowStockProductsRaw, isLoading: lowStockLoading } = useAdminProducts({ stock: 'low', limit: 5 })

  // API Health Check State
  const [healthStatus, setHealthStatus] = useState<Record<string, 'loading' | 'ok' | 'fail'>>({})

  const checkHealth = async (key: string, fn: () => Promise<any>) => {
    setHealthStatus(prev => ({ ...prev, [key]: 'loading' }))
    try {
      await fn()
      setHealthStatus(prev => ({ ...prev, [key]: 'ok' }))
    } catch (e) {
      setHealthStatus(prev => ({ ...prev, [key]: 'fail' }))
    }
  }

  const runAllChecks = () => {
    checkHealth('Products', () => api.get('/products?includeInactive=true'))
    checkHealth('Categories', () => publicApi.get('/categories'))
    checkHealth('Featured', () => publicApi.get('/products/featured'))
    checkHealth('New Arrivals', () => publicApi.get('/products/new-arrivals'))
  }

  // No fallback to mock data
  const stats = statsData || { totalRevenue: 0, totalOrders: 0, totalProducts: 0, totalCustomers: 0, revenueGrowth: 0, ordersGrowth: 0, productsGrowth: 0, customersGrowth: 0, ordersToday: 0, lowStockProducts: 0 }
  const revenueData = revenueDataRaw || []
  const categoryData = categoryDataRaw || []
  const topProducts = topProductsRaw || []
  const recentOrders = ordersData?.data || []
  const lowStockProducts = lowStockProductsRaw?.data || []

  const greeting = useMemo(() => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning 👋'
    if (hour < 17) return 'Good afternoon 👋'
    return 'Good evening 👋'
  }, [])

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">{greeting}</h1>
          <p className="text-slate-500 font-bold mt-1">
            Store Performance • 
            <span className="ml-2 inline-flex items-center gap-1.5 px-2 py-0.5 bg-green-50 text-green-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-100">
              <Activity size={10} /> Live Data
            </span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
             <Calendar size={14} /> 7 Days
          </button>
          <button onClick={runAllChecks} className="flex items-center gap-2 px-4 py-2 bg-[#2874F0] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 active:scale-95 transition-all">
             <RefreshCw size={14} /> Test API Connections
          </button>
        </div>
      </div>

      {/* API Health Check Panel */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-slate-900 rounded-3xl text-white shadow-2xl">
         {['Products', 'Categories', 'Featured', 'New Arrivals'].map((key) => (
           <div key={key} className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/5">
             <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{key}</span>
             {healthStatus[key] === 'loading' ? (
                <RefreshCw size={14} className="animate-spin text-blue-400" />
             ) : healthStatus[key] === 'ok' ? (
                <CheckCircle2 size={16} className="text-green-400" />
             ) : healthStatus[key] === 'fail' ? (
                <XCircle size={16} className="text-red-400" />
             ) : (
                <div className="w-4 h-4 rounded-full border border-white/20" />
             )}
           </div>
         ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard 
            title="Total Revenue"
            value={stats.totalRevenue}
            prefix="₹"
            icon={IndianRupee}
            iconBg="#EBF2FF"
            iconColor="#2874F0"
            trend={stats.revenueGrowth}
            trendLabel="vs last 30d"
            isLoading={statsLoading}
          />
          <StatsCard 
            title="Total Orders"
            value={stats.totalOrders}
            icon={ShoppingBag}
            iconBg="#F0FDF4"
            iconColor="#16A34A"
            trend={stats.ordersGrowth}
            trendLabel={`${stats.ordersToday} today`}
            isLoading={statsLoading}
          />
          <StatsCard 
            title="Products"
            value={stats.totalProducts}
            icon={Package}
            iconBg="#F5F3FF"
            iconColor="#7C3AED"
            trend={stats.productsGrowth}
            trendLabel={`${stats.lowStockProducts} low stock`}
            isLoading={statsLoading}
          />
          <StatsCard 
            title="Customers"
            value={stats.totalCustomers}
            icon={Users}
            iconBg="#FFFBEB"
            iconColor="#D97706"
            trend={stats.customersGrowth}
            trendLabel="Growth rate"
            isLoading={statsLoading}
          />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
           <RevenueChart data={revenueData} isLoading={revenueLoading} />
        </div>
        <div>
           <SalesByCategoryChart data={categoryData} isLoading={categoryLoading} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-50 flex items-center justify-between">
            <h3 className="font-black text-slate-900">Recent Orders</h3>
            <Link href="/admin/orders" className="text-xs font-black text-[#2874F0] flex items-center gap-1">
              ALL <ArrowRight size={12} />
            </Link>
          </div>
          <RecentOrdersWidget orders={recentOrders} isLoading={ordersLoading} />
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-50 flex items-center justify-between">
            <h3 className="font-black text-slate-900">Top Products</h3>
            <Link href="/admin/products" className="text-xs font-black text-[#2874F0] flex items-center gap-1">
              LIST <ArrowRight size={12} />
            </Link>
          </div>
          <TopProductsWidget products={topProducts as any} isLoading={topProductsLoading} />
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-50 flex items-center justify-between">
            <h3 className="font-black text-slate-900 flex items-center gap-2">
              Low Stock Alert <AlertTriangle size={14} className="text-orange-500" />
            </h3>
            <Link href="/admin/products?stock=low" className="text-xs font-black text-orange-500 flex items-center gap-1">
              REPLENISH <ArrowRight size={12} />
            </Link>
          </div>
          <LowStockWidget products={lowStockProducts} isLoading={lowStockLoading} />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-8">
          {[
            { label: 'Add Product', icon: Plus, link: '/admin/products/new', color: 'bg-blue-50 text-blue-600' },
            { label: 'Category', icon: Tag, link: '/admin/categories', color: 'bg-purple-50 text-purple-600' },
            { label: 'Orders', icon: ShoppingBag, link: '/admin/orders', color: 'bg-green-50 text-green-600' },
            { label: 'Users', icon: Users, link: '/admin/users', color: 'bg-orange-50 text-orange-600' },
            { label: 'Sales', icon: BarChart3, link: '/admin/analytics', color: 'bg-pink-50 text-pink-600' },
            { label: 'Setup', icon: Settings, link: '/admin/settings', color: 'bg-slate-50 text-slate-600' },
          ].map((action, i) => (
            <Link key={i} href={action.link} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col items-center gap-4 group">
               <div className={`w-12 h-12 ${action.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <action.icon size={22} />
               </div>
               <span className="text-xs font-black uppercase text-slate-700">{action.label}</span>
            </Link>
          ))}
      </div>
    </div>
  )
}
