'use client'

import React, { useState } from 'react'
import { Plus, Search, Edit, Trash2, MoreVertical, LayoutGrid, List, ChevronRight, Image as ImageIcon, Save, X, ExternalLink, ArrowUp, ArrowDown } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useAdminCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '@/hooks/useAdminCategories'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { mockCategories } from '@/lib/mockData'

export default function AdminCategoriesPage() {
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  
  const { data: categoriesResponse, isLoading } = useAdminCategories()
  const categories = categoriesResponse?.data ?? mockCategories

  const { mutate: createCategory } = useCreateCategory()
  const { mutate: updateCategory } = useUpdateCategory()
  const { mutate: deleteCategory } = useDeleteCategory()

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    status: 'active',
    sortOrder: 0
  })

  const resetForm = () => {
    setFormData({ name: '', slug: '', description: '', status: 'active', sortOrder: 0 })
    setIsAdding(false)
    setEditingId(null)
  }

  const handleEdit = (category: any) => {
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      status: category.status,
      sortOrder: category.sortOrder || 0
    })
    setEditingId(category.id)
    setIsAdding(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId) {
      updateCategory({ id: editingId, data: formData }, {
        onSuccess: () => {
          toast.success('Category updated!')
          resetForm()
        }
      })
    } else {
      createCategory(formData, {
        onSuccess: () => {
          toast.success('Category created!')
          resetForm()
        }
      })
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Left (2/3): Categories List */}
      <div className="lg:col-span-2 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Main Categories</h1>
            <p className="text-slate-500 font-bold mt-1">Organize your store's root navigation structure.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Find category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 pl-10 pr-4 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#2874F0]/20 w-48 transition-all focus:w-64"
              />
            </div>
            <Button onClick={() => setIsAdding(!isAdding)} className="h-10 bg-[#2874F0] text-white rounded-xl px-4 gap-2 font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-500/10">
              {isAdding ? <X size={16} /> : <Plus size={16} />}
              {isAdding ? 'Close' : 'Add New'}
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden overflow-x-auto">
          <table className="w-full text-left min-w-[700px]">
             <thead className="bg-slate-50/50 border-b border-slate-100">
               <tr>
                 <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Order</th>
                 <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Category Detail</th>
                 <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">In Stock</th>
                 <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                 <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-50">
                {categories.map((category: any) => (
                  <tr key={category.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-slate-400 w-4">{category.sortOrder}</span>
                          <div className="flex flex-col gap-0.5">
                             <button className="text-slate-300 hover:text-[#2874F0] transition-colors"><ArrowUp size={12} /></button>
                             <button className="text-slate-300 hover:text-red-500 transition-colors"><ArrowDown size={12} /></button>
                          </div>
                       </div>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-[#2874F0] group-hover:text-white transition-all">
                             <LayoutGrid size={22} />
                          </div>
                          <div>
                             <p className="text-sm font-black text-slate-900 group-hover:text-[#2874F0] transition-all">{category.name}</p>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">/{category.slug}</p>
                          </div>
                       </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                       <span className="text-xs font-black text-slate-600 bg-slate-100 px-2 py-1 rounded-lg">{category.productsCount} SKUs</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                       <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${category.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                          {category.status}
                       </span>
                    </td>
                    <td className="px-6 py-4 text-right overflow-hidden">
                       <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-4 transition-all duration-300">
                          <button onClick={() => handleEdit(category)} className="p-2 text-slate-400 hover:text-blue-500 hover:bg-white rounded-xl shadow-sm border border-slate-50">
                             <Edit size={16} />
                          </button>
                          <button onClick={() => deleteCategory(category.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-white rounded-xl shadow-sm border border-slate-50">
                             <Trash2 size={16} />
                          </button>
                          <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-white rounded-xl shadow-sm border border-slate-50">
                             <MoreVertical size={16} />
                          </button>
                       </div>
                    </td>
                  </tr>
                ))}
             </tbody>
          </table>
        </div>
      </div>

      {/* Right (1/3): Form (Sticky) */}
      <div className="lg:col-span-1">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 sticky top-24 space-y-6">
           <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                {editingId ? 'Edit Category' : 'New Category'}
              </h3>
              {editingId && (
                <button onClick={resetForm} className="text-xs font-black text-slate-400 hover:text-red-500 flex items-center gap-1 transition-colors uppercase">
                   <X size={14} /> Cancel
                </button>
              )}
           </div>

           <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 leading-none">Category Name</label>
                 <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Mens Fashion"
                  className="w-full h-11 px-4 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-1 focus:ring-[#2874F0] transition-all"
                  required
                 />
              </div>

              <div className="space-y-1.5">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 leading-none">URL Slug</label>
                 <div className="relative">
                   <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 text-xs font-bold">/</span>
                   <input 
                    type="text" 
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="mens-fashion"
                    className="w-full h-11 pl-7 pr-4 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-1 focus:ring-[#2874F0] transition-all"
                   />
                 </div>
              </div>

              <div className="space-y-1.5">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 leading-none">Description</label>
                 <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief overview of this category..."
                  className="w-full h-24 p-4 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-1 focus:ring-[#2874F0] transition-all resize-none"
                 />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 leading-none">Sort Order</label>
                  <input 
                    type="number" 
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) })}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 leading-none">Visibility</label>
                   <select 
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:outline-none appearance-none cursor-pointer"
                   >
                     <option value="active">ACTIVE</option>
                     <option value="inactive">DISABLED</option>
                   </select>
                </div>
              </div>

              <div className="pt-4">
                 <Button type="submit" className="w-full h-12 bg-slate-900 hover:bg-black text-white rounded-xl font-black tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10 active:scale-95 transition-all">
                    <Save size={18} />
                    {editingId ? 'UPDATE CATEGORY' : 'CREATE CATEGORY'}
                 </Button>
              </div>
           </form>

           <div className="pt-2">
              <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 flex gap-3 group overflow-hidden relative">
                 <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0 text-[#2874F0]">
                    <Plus size={18} />
                 </div>
                 <div className="relative z-10 pr-2">
                    <p className="text-[10px] font-black text-[#2874F0] uppercase tracking-widest mb-0.5 leading-none">Add Icons?</p>
                    <p className="text-[11px] font-bold text-slate-500 leading-tight">Categories with custom SVG icons appear in the main web mega-menu.</p>
                 </div>
                 {/* Decorative */}
                 <LayoutGrid size={80} className="absolute -right-6 -bottom-6 text-blue-500/5 rotate-12 group-hover:rotate-45 transition-transform duration-700" />
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}
