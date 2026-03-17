'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { 
  Pencil, 
  Trash2, 
  Copy, 
  ExternalLink, 
  Star, 
  MoreVertical,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  Plus,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Product } from '@/types'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

interface ProductsTableProps {
  products: Product[] | undefined
  isLoading: boolean
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onToggleStatus: (id: string) => void
  onToggleFeatured: (id: string) => void
}

export const ProductsTable: React.FC<ProductsTableProps> = ({
  products,
  isLoading,
  onEdit,
  onDelete,
  onToggleStatus,
  onToggleFeatured
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [stockFilter, setStockFilter] = useState('all')
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  
  // Inline stock edit state
  const [editingStockId, setEditingStockId] = useState<string | null>(null)
  const [tempStockValue, setTempStockValue] = useState<string>('')

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked && products) {
      setSelectedIds(products.map(p => p.id))
    } else {
      setSelectedIds([])
    }
  }

  const handleSelectOne = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    )
  }

  const getStockStatus = (stock: number) => {
    if (stock > 50) return { label: 'In Stock', color: 'success' }
    if (stock >= 10) return { label: 'Low Stock', color: 'warning' }
    if (stock > 0) return { label: `Very Low (${stock} left)`, color: 'warning' }
    return { label: 'Out of Stock', color: 'danger' }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price)
  }

  const handleStockUpdate = (id: string) => {
    // In a real app, call mutation here
    setEditingStockId(null)
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-lg" />
        ))}
      </div>
    )
  }

  const filteredProducts = products?.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.id.includes(searchQuery)
    const matchesCategory = categoryFilter === 'all' || p.category.slug === categoryFilter
    const matchesStatus = statusFilter === 'all' || (statusFilter === 'active' ? p.isActive : !p.isActive)
    
    let matchesStock = true
    if (stockFilter === 'in-stock') matchesStock = p.stock > 10
    if (stockFilter === 'low') matchesStock = p.stock > 0 && p.stock <= 10
    if (stockFilter === 'out') matchesStock = p.stock === 0

    return matchesSearch && matchesCategory && matchesStatus && matchesStock
  })

  return (
    <div className="space-y-4">
      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 flex flex-wrap items-center justify-between gap-4">
        <div className="flex-1 min-w-[300px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by product name or SKU..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2874F0]/20 focus:border-[#2874F0] transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <select 
            className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2874F0]/20"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            {/* Map actual categories here */}
          </select>
          <select 
            className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2874F0]/20"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <select 
            className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2874F0]/20"
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
          >
            <option value="all">All Stock</option>
            <option value="in-stock">In Stock</option>
            <option value="low">Low Stock</option>
            <option value="out">Out of Stock</option>
          </select>
        </div>
      </div>

      <div className="relative overflow-hidden bg-white rounded-xl border border-gray-100">
        {/* Bulk Actions */}
        <AnimatePresence>
          {selectedIds.length > 0 && (
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              className="absolute top-0 left-0 right-0 z-20 bg-[#2874F0] text-white px-6 py-3 flex items-center justify-between shadow-lg"
            >
              <span className="font-semibold">{selectedIds.length} products selected</span>
              <div className="flex items-center gap-3">
                <button className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm font-medium">
                  Export CSV
                </button>
                <button className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm font-medium">
                  Toggle Active
                </button>
                <button className="px-3 py-1.5 bg-red-500 hover:bg-red-600 rounded-lg transition-colors text-sm font-medium flex items-center gap-2">
                  <Trash2 size={16} /> Delete Selected
                </button>
                <button onClick={() => setSelectedIds([])} className="p-1 hover:bg-white/10 rounded-full">
                  <X size={18} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-4">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-gray-300 text-[#2874F0] focus:ring-[#2874F0]" 
                    onChange={handleSelectAll}
                    checked={selectedIds.length === (filteredProducts?.length || 0) && (filteredProducts?.length || 0) > 0}
                  />
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Product</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Featured</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts?.map((product) => {
                const stockStatus = getStockStatus(product.stock)
                return (
                  <tr 
                    key={product.id} 
                    className={`group hover:bg-blue-50/20 transition-colors ${selectedIds.includes(product.id) ? 'bg-blue-50/40' : ''}`}
                  >
                    <td className="px-6 py-4">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-gray-300 text-[#2874F0] focus:ring-[#2874F0]" 
                        checked={selectedIds.includes(product.id)}
                        onChange={() => handleSelectOne(product.id)}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-100 bg-gray-50">
                          <Image 
                            src={product.images[0]} 
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900 line-clamp-1">{product.name}</p>
                          <p className="text-[10px] uppercase font-mono text-gray-400 mt-0.5">SKU: {product.id.slice(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="secondary" className="bg-gray-100 text-gray-600 border-none font-medium">
                        {product.category.name}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-bold text-gray-900">{formatPrice(product.price)}</p>
                        <p className="text-xs text-gray-400 line-through">{formatPrice(product.originalPrice)}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {editingStockId === product.id ? (
                        <div className="flex items-center gap-2">
                           <input 
                            autoFocus
                            type="number" 
                            className="w-20 px-2 py-1 bg-white border border-blue-500 rounded text-sm outline-none"
                            value={tempStockValue}
                            onChange={(e) => setTempStockValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleStockUpdate(product.id)
                              if (e.key === 'Escape') setEditingStockId(null)
                            }}
                          />
                        </div>
                      ) : (
                        <div 
                          className="cursor-pointer hover:bg-gray-100/50 p-1 rounded inline-block transition-colors"
                          onClick={() => {
                            setEditingStockId(product.id)
                            setTempStockValue(product.stock.toString())
                          }}
                        >
                          <p className={`text-sm font-bold text-${stockStatus.color === 'success' ? 'green-600' : stockStatus.color === 'warning' ? 'orange-500' : 'red-600'}`}>
                            {product.stock}
                          </p>
                          <p className="text-[11px] text-gray-400">{stockStatus.label}</p>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => onToggleStatus(product.id)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${product.isActive ? 'bg-[#2874F0]' : 'bg-gray-200'}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${product.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => onToggleFeatured(product.id)}
                        className={`p-2 rounded-full transition-all ${product.isFeatured ? 'text-yellow-400 bg-yellow-50' : 'text-gray-300 hover:bg-gray-50 hover:text-gray-400'}`}
                      >
                        <Star size={20} fill={product.isFeatured ? 'currentColor' : 'none'} />
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="relative inline-block text-left">
                        <button 
                          onClick={() => setOpenMenuId(openMenuId === product.id ? null : product.id)}
                          className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
                        >
                          <MoreVertical size={18} />
                        </button>
                        
                        {openMenuId === product.id && (
                          <>
                            <div className="fixed inset-0 z-30" onClick={() => setOpenMenuId(null)}></div>
                            <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-40">
                              <button 
                                onClick={() => { onEdit(product.id); setOpenMenuId(null); }}
                                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              >
                                <Pencil size={16} /> Edit Product
                              </button>
                              <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                <Copy size={16} /> Duplicate Product
                              </button>
                              <Link 
                                href={`/products/${product.slug}`}
                                target="_blank"
                                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              >
                                <ExternalLink size={16} /> View on Shop
                              </Link>
                              <button 
                                onClick={() => { onDelete(product.id); setOpenMenuId(null); }}
                                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                              >
                                <Trash2 size={16} /> Delete Product
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

const X = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
)
