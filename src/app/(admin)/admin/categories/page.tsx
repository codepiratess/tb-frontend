'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Search, Edit, Trash2, MoreVertical, LayoutGrid, Save, X, ArrowUp, ArrowDown } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '@/hooks/useCategories'
import { toast } from 'react-hot-toast'

export default function AdminCategoriesPage() {
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  
  const { data: categories, isLoading } = useCategories()
  const createCategory = useCreateCategory()
  const updateCategory = useUpdateCategory()
  const deleteCategory = useDeleteCategory()

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    isActive: true,
    sortOrder: 0,
    image: ''
  })

  const generateSlug = (name: string) => 
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')

  useEffect(() => {
    if (formData.name && !editingId) {
      setFormData(prev => ({ ...prev, slug: generateSlug(formData.name) }))
    }
  }, [formData.name, editingId])

  const resetForm = () => {
    setFormData({ name: '', slug: '', description: '', isActive: true, sortOrder: 0, image: '' })
    setIsAdding(false)
    setEditingId(null)
  }

  const handleEdit = (category: any) => {
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      isActive: category.isActive,
      sortOrder: category.sortOrder || 0,
      image: category.image || ''
    })
    setEditingId(category.id)
    setIsAdding(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingId) {
        await updateCategory.mutateAsync({ id: editingId, dto: formData })
      } else {
        await createCategory.mutateAsync(formData)
      }
      resetForm()
    } catch (error) {
      // Handled in mutation
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      await deleteCategory.mutateAsync(id)
    }
  }

  const filteredCategories = categories?.filter((c: any) => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || []

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
      <div className="lg:col-span-2 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Categories</h1>
            <p className="text-slate-500 font-bold mt-1">Manage your store's product organization.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 pl-10 pr-4 bg-white border border-slate-200 rounded-xl text-xs font-bold w-48 transition-all focus:w-64"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden overflow-x-auto">
          <table className="w-full text-left min-w-[600px]">
             <thead className="bg-slate-50/50 border-b">
               <tr>
                 <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Order</th>
                 <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</th>
                 <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Products</th>
                 <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                 <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-50">
                {isLoading ? (
                  <tr><td colSpan={5} className="p-10 text-center font-bold text-slate-400">Loading categories...</td></tr>
                ) : filteredCategories.length === 0 ? (
                  <tr><td colSpan={5} className="p-10 text-center font-bold text-slate-400">No categories found.</td></tr>
                ) : filteredCategories.map((category: any) => (
                  <tr key={category.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4">
                       <span className="text-xs font-black text-slate-400">{category.sortOrder}</span>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                             <LayoutGrid size={18} />
                          </div>
                          <div>
                             <p className="text-sm font-black text-slate-900">{category.name}</p>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">/{category.slug}</p>
                          </div>
                       </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                       <span className="text-xs font-black text-slate-600 bg-slate-100 px-2 py-1 rounded-lg">
                          {category.productCount || 0} Products
                       </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                       <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${category.isActive ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                          {category.isActive ? 'ACTIVE' : 'INACTIVE'}
                       </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <div className="flex items-center justify-end gap-1">
                          <button onClick={() => handleEdit(category)} className="p-2 text-slate-400 hover:text-blue-500">
                             <Edit size={16} />
                          </button>
                          <button onClick={() => handleDelete(category.id)} className="p-2 text-slate-400 hover:text-red-500">
                             <Trash2 size={16} />
                          </button>
                       </div>
                    </td>
                  </tr>
                ))}
             </tbody>
          </table>
        </div>
      </div>

      <div className="lg:col-span-1">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl sticky top-24 space-y-6">
           <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                {editingId ? 'Edit Category' : 'New Category'}
              </h3>
              {editingId && (
                <button onClick={resetForm} className="text-xs font-black text-slate-400 hover:text-red-500">
                   CANCEL
                </button>
              )}
           </div>

           <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Name</label>
                 <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Electronics"
                  className="w-full h-11 px-4 bg-slate-50 border rounded-xl text-sm font-bold focus:outline-none"
                  required
                 />
              </div>

              <div className="space-y-1.5">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Slug</label>
                 <input 
                  type="text" 
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full h-11 px-4 bg-slate-50 border rounded-xl text-sm font-bold focus:outline-none"
                 />
              </div>

              <div className="space-y-1.5">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</label>
                 <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full h-24 p-4 bg-slate-50 border rounded-xl text-sm font-bold focus:outline-none resize-none"
                 />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Order</label>
                  <input 
                    type="number" 
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                    className="w-full h-11 px-4 bg-slate-50 border rounded-xl text-sm font-bold focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</label>
                   <select 
                    value={formData.isActive ? 'active' : 'inactive'}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'active' })}
                    className="w-full h-11 px-4 bg-slate-50 border rounded-xl text-sm font-bold focus:outline-none"
                   >
                     <option value="active">Active</option>
                     <option value="inactive">Inactive</option>
                   </select>
                </div>
              </div>

              <div className="pt-4">
                 <Button 
                    type="submit" 
                    isLoading={createCategory.isPending || updateCategory.isPending}
                    className="w-full h-12 bg-slate-900 text-white rounded-xl font-black tracking-widest shadow-xl"
                  >
                    <Save size={18} className="mr-2" />
                    {editingId ? 'UPDATE' : 'CREATE'}
                 </Button>
              </div>
           </form>
        </div>
      </div>
    </div>
  )
}
