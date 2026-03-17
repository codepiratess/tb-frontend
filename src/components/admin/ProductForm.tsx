'use client'

import React, { useState, useEffect } from 'react'
import { 
  X, 
  Plus, 
  Trash2, 
  Save, 
  Image as ImageIcon,
  Check,
  Settings,
  Package,
  IndianRupee,
  Tag,
  Info,
  Layers,
  Zap,
  History,
  AlertCircle
} from 'lucide-react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Category, Product } from '@/types'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { generateSlug } from '@/lib/utils'

const productSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  slug: z.string().min(3, 'Slug is required'),
  shortDescription: z.string().max(200, 'Max 200 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.coerce.number().min(1, 'Selling price is required'),
  originalPrice: z.coerce.number().min(1, 'Original price is required'),
  gst: z.string().default('18'),
  stock: z.coerce.number().min(0, 'Stock cannot be negative'),
  sku: z.string().optional(),
  lowStockThreshold: z.coerce.number().default(10),
  categoryId: z.string().min(1, 'Category is required'),
  subCategoryId: z.string().optional(),
  tags: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  isNewArrival: z.boolean().default(false),
  isBestSeller: z.boolean().default(false),
  freeDelivery: z.boolean().default(false),
  specifications: z.array(z.object({
    key: z.string().min(1, 'Key required'),
    value: z.string().min(1, 'Value required')
  })).default([]),
  images: z.array(z.string()).min(1, 'At least one image is required')
})

type ProductFormData = z.infer<typeof productSchema>

interface ProductFormProps {
  initialData?: Product
  categories: Category[]
  onSubmit: (data: any) => void
  isEditing?: boolean
}

export const ProductForm: React.FC<ProductFormProps> = ({ 
  initialData, 
  categories = [], 
  onSubmit,
  isEditing = false
}) => {
  const [tagInput, setTagInput] = useState('')
  const [isSlugEditable, setIsSlugEditable] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors, isSubmitting }
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: initialData ? {
      ...initialData as any,
      specifications: initialData.specifications || [],
      gst: '18',
      lowStockThreshold: 10,
    } : {
      name: '',
      slug: '',
      shortDescription: '',
      description: '',
      price: 0,
      originalPrice: 0,
      gst: '18',
      stock: 0,
      sku: '',
      lowStockThreshold: 10,
      categoryId: '',
      isActive: true,
      isFeatured: false,
      isNewArrival: false,
      isBestSeller: false,
      freeDelivery: false,
      images: [],
      specifications: [],
      tags: []
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'specifications'
  })

  // Watchers
  const watchName = watch('name')
  const watchPrice = watch('price')
  const watchOriginalPrice = watch('originalPrice')
  const watchImages = watch('images') || []
  const currentTags = watch('tags') || []
  const watchShortDesc = watch('shortDescription') || ''
  const watchCategoryId = watch('categoryId')

  // Auto-generate slug
  useEffect(() => {
    if (watchName && !isEditing && !isSlugEditable) {
      setValue('slug', generateSlug(watchName))
    }
  }, [watchName, setValue, isEditing, isSlugEditable])

  // Discount calculation
  const discount = useMemo(() => {
    if (watchOriginalPrice > watchPrice && watchOriginalPrice > 0) {
      return Math.round(((watchOriginalPrice - watchPrice) / watchOriginalPrice) * 100)
    }
    return 0
  }, [watchPrice, watchOriginalPrice])

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault()
      if (!currentTags.includes(tagInput.trim())) {
        setValue('tags', [...currentTags, tagInput.trim()])
      }
      setTagInput('')
    }
  }

  const removeTag = (tag: string) => {
    setValue('tags', currentTags.filter(t => t !== tag))
  }

  const handleImageUpload = () => {
    // Simulated upload
    const mockUrl = `https://picsum.photos/seed/${Math.random()}/800/800`
    if (watchImages.length < 6) {
      setValue('images', [...watchImages, mockUrl])
      toast.success('Image uploaded successfully')
    } else {
      toast.error('Maximum 6 images allowed')
    }
  }

  const generateSKU = () => {
    const random = Math.floor(1000 + Math.random() * 9000)
    setValue('sku', `TB-${watchCategoryId.substring(0, 3).toUpperCase() || 'GEN'}-${random}`)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="pb-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Basic Info */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-xl font-black text-slate-900 border-b border-slate-50 pb-4 flex items-center gap-2">
              <Zap size={20} className="text-[#2874F0]" />
              Basic Information
            </h3>
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Product Name*</label>
                <Input 
                  placeholder="e.g. Sony WH-1000XM5 Noise Cancelling Headphones" 
                  {...register('name')}
                  className="h-12 text-lg font-bold"
                  error={errors.name?.message}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Slug (URL)*</label>
                  <div className="relative">
                    <Input 
                      {...register('slug')}
                      className="h-12 font-mono text-xs bg-slate-50 pr-20"
                      readOnly={!isSlugEditable}
                    />
                    <button 
                      type="button"
                      onClick={() => setIsSlugEditable(!isSlugEditable)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-[#2874F0] hover:underline"
                    >
                      {isSlugEditable ? 'SAVE' : 'EDIT'}
                    </button>
                  </div>
                  <p className="mt-2 text-[10px] text-slate-400 font-bold px-1">
                    Preview: <span className="text-slate-900">townbolt.in/product/{watch('slug')}</span>
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">SKU (Stock Keeping Unit)</label>
                  <div className="relative">
                    <Input 
                      placeholder="TB-HEAD-4829" 
                      {...register('sku')}
                      className="h-12"
                    />
                    <button 
                      type="button" 
                      onClick={generateSKU}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 bg-blue-50 text-[#2874F0] rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <Zap size={14} />
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2 ml-1">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Short Description</label>
                  <span className={`text-[10px] font-black ${watchShortDesc.length > 180 ? 'text-red-500' : 'text-slate-400'}`}>
                    {watchShortDesc.length}/200
                  </span>
                </div>
                <Input 
                  placeholder="Sum up the product in one punchy sentence..." 
                  {...register('shortDescription')}
                  maxLength={200}
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Full Description*</label>
                <textarea 
                  {...register('description')}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm min-h-[200px] font-medium focus:outline-none focus:ring-2 focus:ring-[#2874F0]/10 focus:border-[#2874F0] transition-all"
                  placeholder="Write a detailed description that sells..."
                />
                {errors.description && <p className="mt-1 text-xs font-bold text-red-500 ml-1">{errors.description.message}</p>}
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-xl font-black text-slate-900 border-b border-slate-50 pb-4 flex items-center gap-2">
              <IndianRupee size={20} className="text-[#2874F0]" />
              Pricing & Tax
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Selling Price*</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black">₹</span>
                  <Input type="number" {...register('price')} className="pl-8 h-12" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Original Price (MRP)*</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black">₹</span>
                  <Input type="number" {...register('originalPrice')} className="pl-8 h-12" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Discount %</label>
                <div className="h-12 flex items-center px-4 bg-blue-50 border border-blue-100 rounded-xl">
                  <span className="text-lg font-black text-[#2874F0]">{discount}% OFF</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">GST Rate</label>
                <select 
                  {...register('gst')}
                  className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#2874F0]/10 transition-all appearance-none cursor-pointer"
                >
                  <option value="0">0% (GST Exempt)</option>
                  <option value="5">5% (Essentials)</option>
                  <option value="12">12% (Standard)</option>
                  <option value="18">18% (Services/Elec)</option>
                  <option value="28">28% (Luxury)</option>
                </select>
              </div>
              <div className="md:col-span-2 flex items-end pb-1">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 w-full">
                  <div className={`w-10 h-6 rounded-full transition-colors relative cursor-pointer ${watch('freeDelivery') ? 'bg-green-500' : 'bg-slate-300'}`} onClick={() => setValue('freeDelivery', !watch('freeDelivery'))}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${watch('freeDelivery') ? 'translate-x-5' : 'translate-x-1'}`} />
                  </div>
                  <span className="text-sm font-black text-slate-700">Enable Free Delivery for this product</span>
                </div>
              </div>
            </div>
          </div>

          {/* Inventory */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-xl font-black text-slate-900 border-b border-slate-50 pb-4 flex items-center gap-2">
              <Package size={20} className="text-[#2874F0]" />
              Inventory Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Stock Quantity*</label>
                <Input type="number" {...register('stock')} className="h-12" />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Low Stock Warning At</label>
                <Input type="number" {...register('lowStockThreshold')} className="h-12" />
              </div>
            </div>
          </div>

          {/* Specifications */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-slate-50 pb-4">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Layers size={20} className="text-[#2874F0]" />
                Specifications
              </h3>
              <Button 
                type="button" 
                variant="outline" 
                className="h-9 px-4 text-xs font-black border-slate-200 gap-2 rounded-xl"
                onClick={() => append({ key: '', value: '' })}
              >
                <Plus size={14} /> ADD ROW
              </Button>
            </div>
            
            <div className="space-y-4">
              {fields.map((field, idx) => (
                <div key={field.id} className="flex gap-4 items-start group">
                  <div className="flex-1">
                    <Input placeholder="Key (e.g. Battery)" {...register(`specifications.${idx}.key` as const)} />
                  </div>
                  <div className="flex-1">
                    <Input placeholder="Value (e.g. 5000mAh)" {...register(`specifications.${idx}.value` as const)} />
                  </div>
                  <button 
                    type="button"
                    onClick={() => remove(idx)}
                    className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              {fields.length === 0 && (
                <div className="py-12 text-center border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/50">
                  <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">No specifications added</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (4 cols) */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Images */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-black text-slate-900">Media</h3>
              <span className="text-[10px] font-black text-slate-400 uppercase">{watchImages.length}/6 Images</span>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {watchImages.map((img, idx) => (
                <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-slate-100 group">
                  <Image src={img} alt="Product" fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button type="button" onClick={() => setValue('images', watchImages.filter((_, i) => i !== idx))} className="p-2 bg-white text-red-500 rounded-lg shadow-xl hover:scale-110 transition-transform">
                      <Trash2 size={14} />
                    </button>
                  </div>
                  {idx === 0 && (
                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-[#2874F0] text-white text-[8px] font-black rounded-full uppercase tracking-tighter">Main</div>
                  )}
                </div>
              ))}
              {watchImages.length < 6 && (
                <button 
                  type="button"
                  onClick={handleImageUpload}
                  className="aspect-square rounded-2xl border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-slate-300 hover:border-[#2874F0] hover:bg-blue-50/50 transition-all gap-2"
                >
                  <ImageIcon size={24} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Upload</span>
                </button>
              )}
            </div>
          </div>

          {/* Organisation */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-lg font-black text-slate-900 border-b border-slate-50 pb-4">Organisation</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Category*</label>
                <select 
                  {...register('categoryId')}
                  className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#2874F0]/10 transition-all appearance-none cursor-pointer"
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Tags (Press Enter)</label>
                <Input 
                  placeholder="e.g. limited, seasonal" 
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  className="h-11"
                />
                <div className="flex flex-wrap gap-2 mt-3">
                  {currentTags.map(tag => (
                    <span key={tag} className="flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-black rounded-lg uppercase">
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500"><X size={10} /></button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Visibility */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-5">
            <h3 className="text-lg font-black text-slate-900 border-b border-slate-50 pb-4">Visibility</h3>
            
            {[
              { id: 'isActive', label: 'Active', desc: 'Publicly visible' },
              { id: 'isFeatured', label: 'Featured', desc: 'Home page spotlight' },
              { id: 'isNewArrival', label: 'New Arrival', desc: 'Recent add badge' },
              { id: 'isBestSeller', label: 'Best Seller', desc: 'Popular demand' },
            ].map((opt) => (
              <div key={opt.id} className="flex items-center justify-between group">
                <div>
                  <label className="block text-sm font-black text-slate-800">{opt.label}</label>
                  <p className="text-[10px] text-slate-400 font-bold">{opt.desc}</p>
                </div>
                <button 
                  type="button"
                  onClick={() => setValue(opt.id as any, !watch(opt.id as any))}
                  className={`w-10 h-6 rounded-full transition-colors relative ${watch(opt.id as any) ? 'bg-[#2874F0]' : 'bg-slate-200'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${watch(opt.id as any) ? 'translate-x-5' : 'translate-x-1'}`} />
                </button>
              </div>
            ))}
          </div>

          {/* History / Info */}
          {isEditing && (
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-3xl space-y-3">
              <div className="flex items-center gap-2 text-slate-400">
                <History size={16} />
                <span className="text-[10px] font-black uppercase">Recent Activity</span>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-slate-500">Last updated by <span className="text-slate-900">Admin</span> 2 days ago</p>
                <p className="text-[10px] font-bold text-slate-500">Created on <span className="text-slate-900">Jan 12, 2024</span></p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* STICKY FOOTER */}
      <div className="fixed bottom-0 left-[260px] right-0 bg-white/80 backdrop-blur-xl border-t border-slate-100 p-4 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-400">
             <AlertCircle size={16} />
             <span className="text-[10px] font-black uppercase tracking-wider">Unsaved Changes</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" type="button" className="font-black text-slate-500 text-xs px-6" onClick={() => router.back()}>DISCARD</Button>
            <Button variant="outline" type="button" className="font-black text-slate-700 text-xs px-6 border-slate-200">SAVE DRAFT</Button>
            <Button 
              type="submit" 
              className="bg-[#2874F0] hover:bg-[#1a5dc8] text-white px-8 h-11 rounded-xl font-black text-sm shadow-lg shadow-blue-500/20 gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><Check size={18} /> {isEditing ? 'UPDATE PRODUCT' : 'PUBLISH PRODUCT'}</>
              )}
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}

function useMemo(arg0: () => number, arg1: (number | undefined)[]) {
  return React.useMemo(arg0, arg1)
}
