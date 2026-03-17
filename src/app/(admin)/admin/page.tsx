'use client'

import React, { useMemo } from 'react'
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
  ChevronRight,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Calendar,
  Settings,
  Layers
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
import { 
  mockDashboardStats, 
  mockRevenueData, 
  mockCategoryData, 
  mockTopProducts, 
  mockRecentOrders, 
  mockLowStockProducts 
} from '@/lib/mockData'

export default function AdminDashboard() {
  const { data: statsData, isLoading: statsLoading } = useDashboardStats()
  const { data: revenueDataRaw, isLoading: revenueLoading } = useRevenueData('7d')
  const { data: categoryDataRaw, isLoading: categoryLoading } = useSalesByCategory()
  const { data: topProductsRaw, isLoading: topProductsLoading } = useTopProducts(5)
  const { data: ordersData, isLoading: ordersLoading } = useAdminOrders({ limit: 5 })
  const { data: lowStockProductsRaw, isLoading: lowStockLoading } = useAdminProducts({ stock: 'low', limit: 5 })

  // Use mock data as fallback
  const stats = statsData ?? mockDashboardStats
  const revenueData = revenueDataRaw ?? mockRevenueData
  const categoryData = categoryDataRaw ?? mockCategoryData
  const topProducts = topProductsRaw ?? mockTopProducts
  const recentOrders = ordersData?.data ?? mockRecentOrders
  const lowStockProducts = lowStockProductsRaw?.data ?? mockLowStockProducts

  const greeting = useMemo(() => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning 👋'
    if (hour < 17) return 'Good afternoon 👋'
    return 'Good evening 👋'
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">{greeting}</h1>
          <p className="text-slate-500 font-bold mt-1">Admin Dashboard • Status: <span className="text-green-500">Live</span></p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-black text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
            <Calendar size={18} />
            <span>Last 7 Days</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-[#2874F0] rounded-xl text-sm font-black text-white hover:bg-[#1a5dc8] transition-all shadow-lg shadow-blue-500/20">
            <Download size={18} />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <motion.div variants={itemVariants}>
          <StatsCard 
            title="Total Revenue"
            value={`₹${stats.totalRevenue.toLocaleString('en-IN')}`}
            icon={IndianRupee}
            iconColor="#2874F0"
            iconBg="#EBF2FF"
            trend={stats.revenueGrowth}
            subText="vs last month"
            isLoading={statsLoading}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatsCard 
            title="Total Orders"
            value={stats.totalOrders.toString()}
            icon={ShoppingBag}
            iconColor="#10B981"
            iconBg="#ECFDF5"
            trend={stats.ordersGrowth}
            subText={`${stats.ordersToday} orders today`}
            isLoading={statsLoading}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatsCard 
            title="Total Products"
            value={stats.totalProducts.toString()}
            icon={Package}
            iconColor="#7C3AED"
            iconBg="#F5F3FF"
            trend={stats.productsGrowth}
            subText={`${stats.lowStockProducts} low stock`}
            isLoading={statsLoading}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatsCard 
            title="Total Customers"
            value={stats.totalCustomers.toString()}
            icon={Users}
            iconColor="#F59E0B"
            iconBg="#FFFBEB"
            trend={stats.customersGrowth}
            subText={`${stats.customersToday} new today`}
            isLoading={statsLoading}
          />
        </motion.div>
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart data={revenueData} isLoading={revenueLoading} />
        </div>
        <div>
          <SalesByCategoryChart data={categoryData} isLoading={categoryLoading} />
        </div>
      </div>

      {/* Widgets Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-50 flex items-center justify-between">
            <h3 className="font-black text-slate-900">Recent Orders</h3>
            <Link href="/admin/orders" className="text-xs font-black text-[#2874F0] hover:underline flex items-center gap-1">
              VIEW ALL <ArrowRight size={12} />
            </Link>
          </div>
          <RecentOrdersWidget orders={recentOrders} isLoading={ordersLoading} />
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-50 flex items-center justify-between">
            <h3 className="font-black text-slate-900">Top Products</h3>
            <Link href="/admin/products" className="text-xs font-black text-[#2874F0] hover:underline flex items-center gap-1">
              MANAGE <ArrowRight size={12} />
            </Link>
          </div>
          <TopProductsWidget products={topProducts as any} isLoading={topProductsLoading} />
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-black text-slate-900">Low Stock Alert</h3>
              <AlertTriangle size={16} className="text-orange-500" />
            </div>
            <Link href="/admin/products?filter=low-stock" className="text-xs font-black text-orange-500 hover:underline flex items-center gap-1">
              RESTOCK NOW <ArrowRight size={12} />
            </Link>
          </div>
          <LowStockWidget products={lowStockProducts} isLoading={lowStockLoading} />
        </div>
      </div>

      {/* Quick Actions Row */}
      <div className="space-y-4">
        <h3 className="text-xl font-black text-slate-900 tracking-tight">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: 'Add Product', icon: Plus, link: '/admin/products/new' },
            { label: 'New Category', icon: Tag, link: '/admin/categories' },
            { label: 'View Orders', icon: ShoppingBag, link: '/admin/orders' },
            { label: 'Manage Users', icon: Users, link: '/admin/users' },
            { label: 'Analytics', icon: BarChart3, link: '/admin/analytics' },
            { label: 'Settings', icon: Settings, link: '/admin/settings' },
          ].map((action, i) => (
            <Link 
              key={i}
              href={action.link}
              className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:border-[#2874F0] hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col items-center text-center gap-3"
            >
              <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-[#2874F0] transition-colors">
                <action.icon size={28} />
              </div>
              <span className="text-sm font-black text-slate-600 group-hover:text-slate-900 transition-colors">
                {action.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
