'use client'

import React, { useState } from 'react'
import { Plus, Search, Edit, Trash2, MoreVertical, Layers, ChevronRight, X, Save, ArrowRight, Table } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useAdminSubcategories, useCreateSubcategory, useUpdateSubcategory, useDeleteSubcategory } from '@/hooks/useAdminSubcategories'
import { useAdminCategories } from '@/hooks/useAdminCategories'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'

export default function AdminSubcategoriesPage() {
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  
  const { data: subcategoriesResponse, isLoading } = useAdminSubcategories()
  const subcategories = subcategoriesResponse?.data ?? []

  const { data: categoriesResponse } = useAdminCategories()
  const categories = categoriesResponse?.data ?? []

  const { mutate: createSub } = useCreateSubcategory()
  const { mutate: updateSub } = useUpdateSubcategory()
  const { mutate: deleteSub } = useDeleteSubcategory()

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    categoryId: '',
    description: '',
    status: 'active'
  })

  const resetForm = () => {
    setFormData({ name: '', slug: '', categoryId: '', description: '', status: 'active' })
    setIsAdding(false)
    setEditingId(null)
  }

  const handleEdit = (sub: any) => {
    setFormData({
      name: sub.name,
      slug: sub.slug,
      categoryId: sub.categoryId,
      description: sub.description || '',
      status: sub.status
    })
    setEditingId(sub.id)
    setIsAdding(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId) {
      updateSub({ id: editingId, data: formData }, {
        onSuccess: () => {
          toast.success('Sub-category updated!')
          resetForm()
        }
      })
    } else {
      createSub(formData, {
        onSuccess: () => {
          toast.success('Sub-category created!')
          resetForm()
        }
      })
    }
  }

  const getParentName = (id: string) => {
    return categories.find((c: any) => c.id === id)?.name || 'Unknown Root'
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 pb-20 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Left (2/3): Subcategories List */}
      <div className="lg:col-span-2 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
               Sub-Categories
               <span className="text-xs font-black bg-[#2874F0] text-white px-3 py-1 rounded-full uppercase tracking-widest leading-none">REGISTRY</span>
            </h1>
            <p className="text-slate-500 font-bold mt-2">Map and link primary categories to specific product segments.</p>
          </div>
          <div className="flex items-center gap-3">
             <Button onClick={() => setIsAdding(!isAdding)} className="h-12 bg-slate-900 hover:bg-black text-white rounded-2xl px-6 gap-2 font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-900/10 active:scale-95 transition-all">
                {isAdding ? <X size={18} /> : <Plus size={18} />}
                {isAdding ? 'Close Panel' : 'New Sub-Group'}
             </Button>
          </div>
        </div>

        {/* List Header/Filters */}
        <div className="bg-white p-5 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div className="relative flex-1">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="text" 
                placeholder="Find sub-category mapping..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 pl-12 pr-6 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-1 focus:ring-[#2874F0] transition-all"
              />
           </div>
        </div>

        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden overflow-x-auto">
           <table className="w-full text-left min-w-[750px]">
              <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr>
                   <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Sub-Category Name</th>
                   <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Parent Entity</th>
                   <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">SKU Count</th>
                   <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                   <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {subcategories.map((sub: any) => (
                   <tr key={sub.id} className="hover:bg-slate-50/80 transition-all cursor-pointer group">
                      <td className="px-8 py-5">
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-[#2874F0] group-hover:text-white group-hover:border-transparent transition-all shadow-sm">
                               <Layers size={22} />
                            </div>
                            <div>
                               <p className="text-sm font-black text-slate-900 group-hover:text-[#2874F0] transition-colors">{sub.name}</p>
                               <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-widest italic">/{sub.slug}</p>
                            </div>
                         </div>
                      </td>
                      <td className="px-8 py-5 text-center">
                         <span className="text-[10px] font-black text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200 uppercase tracking-widest leading-none">
                            {getParentName(sub.categoryId)}
                         </span>
                      </td>
                      <td className="px-8 py-5 text-center">
                         <span className="text-sm font-black text-slate-900">{sub.productsCount || 0}</span>
                      </td>
                      <td className="px-8 py-5 text-center">
                         <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${sub.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                            {sub.status}
                         </span>
                      </td>
                      <td className="px-8 py-5 text-right overflow-hidden">
                         <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                            <button onClick={(e) => { e.stopPropagation(); handleEdit(sub); }} className="p-2.5 text-slate-400 hover:text-blue-500 hover:bg-white rounded-xl shadow-sm border border-slate-50 transition-all">
                               <Edit size={18} />
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); deleteSub(sub.id); }} className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-white rounded-xl shadow-sm border border-slate-50 transition-all">
                               <Trash2 size={18} />
                            </button>
                            <button className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-white rounded-xl shadow-sm border border-slate-50 transition-all">
                               <MoreVertical size={18} />
                            </button>
                         </div>
                      </td>
                   </tr>
                ))}
              </tbody>
           </table>
        </div>
      </div>

      {/* Right (1/3): Form Overlay/Sidebar */}
      <div className="lg:col-span-1">
         <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-2xl sticky top-24 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex items-center justify-between border-b border-slate-50 pb-6">
               <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                 {editingId ? 'Edit Mapping' : 'Link Sub-Category'}
               </h3>
               {editingId && (
                 <button onClick={resetForm} className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors">
                    <X size={20} />
                 </button>
               )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
               <div className="space-y-1.5 group">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 leading-none group-focus-within:text-[#2874F0] transition-colors">Parent Category Entity</label>
                  <select 
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-1 focus:ring-[#2874F0] transition-all appearance-none cursor-pointer"
                    required
                  >
                     <option value="">SELECT ROOT CATEGORY</option>
                      {categories.map((cat: any) => (
                       <option key={cat.id} value={cat.id}>{cat.name.toUpperCase()}</option>
                     ))}
                  </select>
               </div>

               <div className="space-y-1.5 group">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 leading-none group-focus-within:text-[#2874F0] transition-colors">Segment Name</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Smartwatches"
                    className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-1 focus:ring-[#2874F0] transition-all"
                    required
                  />
               </div>

               <div className="space-y-1.5 group">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 leading-none group-focus-within:text-[#2874F0] transition-colors">Segment URL Slug</label>
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 font-bold">/</span>
                    <input 
                      type="text" 
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="smartwatches"
                      className="w-full h-12 pl-8 pr-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-1 focus:ring-[#2874F0] transition-all"
                    />
                  </div>
               </div>

               <div className="space-y-1.5 group">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 leading-none">Internal Visibility</label>
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none appearance-none cursor-pointer"
                  >
                     <option value="active">ONLINE / VISIBLE</option>
                     <option value="inactive">OFFLINE / HIDDEN</option>
                  </select>
               </div>

               <div className="pt-4">
                  <Button type="submit" className="w-full h-14 bg-slate-900 hover:bg-black text-white rounded-[1.8rem] font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl shadow-slate-900/10 active:scale-95 transition-all">
                     <Save size={20} />
                     {editingId ? 'COMMIT SEGMENT UPDATE' : 'CREATE SEGMENT LINK'}
                  </Button>
               </div>
            </form>

            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 relative overflow-hidden group">
               <div className="relative z-10">
                  <p className="text-[10px] font-black text-[#2874F0] uppercase tracking-widest mb-1 leading-none italic">Hierarchical Logic</p>
                  <p className="text-[11px] font-bold text-slate-500 leading-relaxed">Sub-categories allow customers to filter products more precisely within mega-menus.</p>
               </div>
               <Table size={80} className="absolute -right-6 -bottom-6 text-slate-900/5 rotate-12 group-hover:rotate-45 transition-transform duration-1000" />
            </div>
         </div>
      </div>
    </div>
  )
}
