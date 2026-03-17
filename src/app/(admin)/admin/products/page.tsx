'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Plus, Download, Search, Filter, ChevronDown, MoreVertical, Edit, Copy, ExternalLink, Trash2, Star } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { ProductsTable } from '@/components/admin/ProductsTable'
import { useAdminProducts, useDeleteProduct, useToggleProductStatus, useToggleFeatured } from '@/hooks/useAdminProducts'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { mockProducts } from '@/lib/mockData'

type TabType = 'all' | 'active' | 'inactive' | 'low-stock' | 'out-of-stock'

export default function AdminProductsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabType>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const { data: productsData, isLoading } = useAdminProducts({
    status: activeTab === 'active' ? 'active' : activeTab === 'inactive' ? 'inactive' : undefined,
    stock: activeTab === 'low-stock' ? 'low' : activeTab === 'out-of-stock' ? 'out' : undefined,
    search: searchQuery || undefined
  })

  // Fallback to mock data
  const products = productsData?.data ?? mockProducts
  const totalCount = productsData?.total ?? mockProducts.length

  const { mutate: deleteProduct } = useDeleteProduct()
  const { mutate: toggleStatus } = useToggleProductStatus()
  const { mutate: toggleFeatured } = useToggleFeatured()

  const tabs: { id: TabType; label: string; count?: number }[] = [
    { id: 'all', label: 'All', count: totalCount },
    { id: 'active', label: 'Active', count: products.filter(p => p.status === 'active').length },
    { id: 'inactive', label: 'Inactive', count: products.filter(p => p.status === 'inactive').length },
    { id: 'low-stock', label: 'Low Stock', count: products.filter(p => p.stock > 0 && p.stock < 10).length },
    { id: 'out-of-stock', label: 'Out of Stock', count: products.filter(p => p.stock === 0).length },
  ]

  const handleDelete = () => {
    if (deleteId) {
      deleteProduct(deleteId)
      setDeleteId(null)
    }
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            Products
            <span className="text-sm font-black bg-blue-50 text-[#2874F0] px-2.5 py-1 rounded-full uppercase tracking-wider">
              {totalCount} Total
            </span>
          </h1>
          <p className="text-slate-500 font-bold mt-1">Manage, edit and monitor your product catalogue</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-11 px-5 border-slate-200 font-black text-slate-700 bg-white gap-2 rounded-xl hover:bg-slate-50 shadow-sm transition-all">
            <Download size={18} /> Export CSV
          </Button>
          <Link href="/admin/products/new">
            <Button className="h-11 px-6 bg-[#2874F0] hover:bg-[#1a5dc8] gap-2 rounded-xl font-black text-white shadow-lg shadow-blue-500/20 transition-all">
              <Plus size={20} /> Add Product
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#2874F0] transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search products by name, SKU or slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#2874F0]/20 focus:border-[#2874F0] transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="relative group">
            <button className="flex items-center gap-2 px-4 h-11 bg-white border border-slate-200 rounded-xl text-sm font-black text-slate-600 hover:border-slate-300 transition-all">
              <Filter size={18} />
              <span>Category: All</span>
              <ChevronDown size={16} />
            </button>
          </div>
          <div className="relative group">
            <button className="flex items-center gap-2 px-4 h-11 bg-white border border-slate-200 rounded-xl text-sm font-black text-slate-600 hover:border-slate-300 transition-all">
              <span>Sort: Newest First</span>
              <ChevronDown size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex items-center gap-1 bg-slate-100/50 p-1 rounded-xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-2.5 text-sm font-black rounded-lg transition-all relative ${
              activeTab === tab.id 
              ? 'bg-white text-[#2874F0] shadow-sm' 
              : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className={`ml-2 px-1.5 py-0.5 rounded-full text-[10px] font-black tracking-widest ${
                activeTab === tab.id ? 'bg-blue-50 text-[#2874F0]' : 'bg-slate-200 text-slate-500'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Products Table Wrapper */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
        <ProductsTable 
          products={products}
          isLoading={isLoading}
          onEdit={(id) => router.push(`/admin/products/${id}/edit`)}
          onDelete={(id) => setDeleteId(id)}
          onToggleStatus={(id) => toggleStatus(id)}
          onToggleFeatured={(id) => toggleFeatured(id)}
        />
      </div>

      {/* Pagination Placeholder */}
      <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
        <p className="text-sm font-bold text-slate-500">Showing 1 to 20 of {totalCount} products</p>
        <div className="flex items-center gap-2">
          <Button variant="outline" disabled className="h-9 px-4 text-xs font-black border-slate-200 rounded-lg opacity-50">Previous</Button>
          <div className="flex gap-1">
            {[1, 2, 3].map(n => (
              <button key={n} className={`w-9 h-9 flex items-center justify-center rounded-lg text-xs font-black transition-all ${n === 1 ? 'bg-[#2874F0] text-white shadow-lg shadow-blue-500/20' : 'text-slate-600 hover:bg-slate-50 border border-slate-100'}`}>
                {n}
              </button>
            ))}
          </div>
          <Button variant="outline" className="h-9 px-4 text-xs font-black border-slate-200 rounded-lg hover:bg-slate-50">Next</Button>
        </div>
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Product"
        description="Are you sure you want to delete this product? This action cannot be undone and will remove the product from your store catalogue."
        confirmText="Delete Product"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  )
}
