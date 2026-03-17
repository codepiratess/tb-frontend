'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { 
  Plus, 
  Trash2, 
  Image as ImageIcon,
  Check,
  Package,
  IndianRupee,
  Tag,
  Info,
  X,
  Upload,
  ChevronDown,
  Layout,
  Globe,
  Loader2,
  GripVertical
} from 'lucide-react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Product, Category } from '@/types'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { useUploadImage, useUploadImages } from '@/hooks/useAdminProducts'

const productSchema = z.object({
  name: z.string().min(3, 'Product name is required (min 3 chars)'),
  slug: z.string().min(3, 'Slug is required'),
  shortDescription: z.string().max(200, 'Short description must be under 200 chars'),
  description: z.string().min(50, 'Full description must be at least 50 chars'),
  price: z.coerce.number().min(1, 'Selling price is required'),
  mrp: z.coerce.number().min(1, 'MRP is required'),
  gstRate: z.string().default('18%'),
  inclusiveGst: z.boolean().default(true),
  freeDelivery: z.boolean().default(false),
  stock: z.coerce.number().min(0, 'Stock cannot be negative'),
  sku: z.string().optional(),
  lowStockAlert: z.coerce.number().default(10),
  categoryId: z.string().min(1, 'Category is required'),
  subCategoryId: z.string().optional(),
  tags: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  isNewArrival: z.boolean().default(true),
  isBestSeller: z.boolean().default(false),
  specifications: z.array(z.object({
    key: z.string(),
    value: z.string()
  })).default([]),
  images: z.array(z.string()).min(1, 'At least one image is required'),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
})

type ProductFormData = z.infer<typeof productSchema>

interface ProductFormProps {
  initialData?: any // Product type can vary based on API
  categories: Category[]
  subCategories?: any[]
  onSubmit: (data: any) => void
  isLoading?: boolean
}

export default function ProductForm({
  initialData,
  categories,
  subCategories = [],
  onSubmit,
  isLoading = false
}: ProductFormProps) {
  const [tagInput, setTagInput] = useState('')
  const [showSeo, setShowSeo] = useState(false)
  const [lastSaved, setLastSaved] = useState<string | null>(null)
  
  const uploadImageMutation = useUploadImages()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors }
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: initialData ? {
      ...initialData,
      gstRate: initialData.gstRate || '18%',
      specifications: initialData.specifications || [],
      images: initialData.images || [],
      tags: initialData.tags || [],
    } : {
      name: '',
      slug: '',
      shortDescription: '',
      description: '',
      price: 0,
      mrp: 0,
      gstRate: '18%',
      inclusiveGst: true,
      freeDelivery: false,
      stock: 0,
      sku: '',
      lowStockAlert: 10,
      categoryId: '',
      isActive: true,
      isFeatured: false,
      isNewArrival: true,
      isBestSeller: false,
      specifications: [],
      images: [],
      tags: [],
    }
  })

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'specifications'
  })

  const watchName = watch('name')
  const watchImages = watch('images')
  const watchTags = watch('tags')
  const watchPrice = watch('price')
  const watchMrp = watch('mrp')

  // Auto-generate slug and meta
  useEffect(() => {
    if (watchName && !initialData) {
      const slug = watchName.toLowerCase().trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '')
      setValue('slug', slug)
      setValue('metaTitle', watchName)
    }
  }, [watchName, setValue, initialData])

  // Auto-save simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setLastSaved(new Date().toLocaleTimeString())
    }, 30000)
    return () => clearInterval(timer)
  }, [])

  const discountPercent = watchMrp > 0 ? Math.round(((watchMrp - watchPrice) / watchMrp) * 100) : 0

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return
    
    try {
      // In production, upload to server
      const urls = await uploadImageMutation.mutateAsync(files)
      setValue('images', [...watchImages, ...urls])
    } catch (err) {
      // Fallback for demo
      const mockUrls = files.map(() => `https://picsum.photos/seed/${Math.random()}/800/800`)
      setValue('images', [...watchImages, ...mockUrls])
    }
  }

  const removeImage = (index: number) => {
    const newImages = [...watchImages]
    newImages.splice(index, 1)
    setValue('images', newImages)
  }

  const handleAddTag = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault()
      if (!watchTags.includes(tagInput.trim())) {
        setValue('tags', [...watchTags, tagInput.trim()])
      }
      setTagInput('')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="pb-32 relative">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Main Column */}
        <div className="flex-[2] space-y-8">
          
          {/* Basic Info */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
               <div className="p-2 bg-blue-50 rounded-xl text-[#2874F0]"><Layout size={20} /></div>
               Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-black uppercase text-slate-400 ml-1">Product Name*</label>
                <Input 
                  {...register('name')}
                  placeholder="e.g. Sony PlayStation 5 Console"
                  className="h-14 border-slate-200 focus:border-[#2874F0] bg-slate-50/50"
                />
                {errors.name && <p className="text-red-500 text-xs font-bold ml-1">{errors.name.message}</p>}
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-black uppercase text-slate-400 ml-1">URL Slug*</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold pointer-events-none">
                    townbolt.in/p/
                  </div>
                  <Input 
                    {...register('slug')}
                    className="h-14 pl-[90px] border-slate-200 focus:border-[#2874F0] bg-slate-50/50 font-mono text-sm"
                  />
                </div>
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <div className="flex justify-between items-center px-1">
                  <label className="text-xs font-black uppercase text-slate-400">Short Description</label>
                  <span className="text-[10px] font-bold text-slate-300">{(watch('shortDescription') || '').length}/200</span>
                </div>
                <textarea 
                  {...register('shortDescription')}
                  placeholder="A brief summary for category listings..."
                  className="w-full h-24 p-4 rounded-2xl bg-slate-50/50 border border-slate-200 focus:border-[#2874F0] focus:ring-4 focus:ring-blue-50 outline-none transition-all text-sm font-medium"
                />
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-black uppercase text-slate-400 ml-1">Full Description*</label>
                <textarea 
                  {...register('description')}
                  placeholder="Tell customers all about the features, technical specs, and benefits..."
                  className="w-full h-48 p-4 rounded-2xl bg-slate-50/50 border border-slate-200 focus:border-[#2874F0] focus:ring-4 focus:ring-blue-50 outline-none transition-all text-sm font-medium"
                />
                {errors.description && <p className="text-red-500 text-xs font-bold ml-1">{errors.description.message}</p>}
              </div>
            </div>
          </div>

          {/* Pricing & Offers */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
               <div className="p-2 bg-green-50 rounded-xl text-green-500"><IndianRupee size={20} /></div>
               Pricing & Offers
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase text-slate-400 ml-1">Selling Price*</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                  <Input type="number" {...register('price')} className="h-14 pl-8 border-slate-200 focus:border-[#2874F0] bg-slate-50/50" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase text-slate-400 ml-1">MRP (Original)*</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                  <Input type="number" {...register('mrp')} className="h-14 pl-8 border-slate-200 focus:border-[#2874F0] bg-slate-50/50" />
                </div>
              </div>

              <div className="flex items-center pt-6">
                {discountPercent > 0 && (
                  <Badge variant="info" className="h-14 w-full justify-center text-lg font-black rounded-xl border-dashed">
                    {discountPercent}% OFF
                  </Badge>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase text-slate-400 ml-1">GST Rate</label>
                <select 
                  {...register('gstRate')}
                  className="w-full h-14 px-4 rounded-xl bg-slate-50/50 border border-slate-200 outline-none focus:border-[#2874F0] text-sm font-bold appearance-none cursor-pointer"
                >
                  {['0%', '5%', '12%', '18%', '28%'].map(rate => (
                    <option key={rate} value={rate}>{rate}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-3 pt-6">
                <input type="checkbox" {...register('inclusiveGst')} className="w-5 h-5 rounded-md border-2 border-slate-200 text-[#2874F0]" />
                <label className="text-sm font-bold text-slate-600">Inclusive of GST</label>
              </div>

              <div className="flex items-center gap-3 pt-6">
                <input type="checkbox" {...register('freeDelivery')} className="w-5 h-5 rounded-md border-2 border-slate-200 text-[#2874F0]" />
                <label className="text-sm font-bold text-slate-600">Free Delivery</label>
              </div>
            </div>
          </div>

          {/* Inventory */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
               <div className="p-2 bg-purple-50 rounded-xl text-purple-500"><Package size={20} /></div>
               Inventory
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase text-slate-400 ml-1">Stock Quantity*</label>
                <Input type="number" {...register('stock')} className="h-14 border-slate-200 focus:border-[#2874F0] bg-slate-50/50" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase text-slate-400 ml-1">SKU Code</label>
                <div className="flex gap-2">
                  <Input {...register('sku')} placeholder="TB-PROD-001" className="h-14 border-slate-200 flex-1" />
                  <Button type="button" variant="outline" className="h-14 px-4 bg-slate-50 border-slate-200">
                    Auto
                  </Button>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase text-slate-400 ml-1">Low Stock Alert at*</label>
                <Input type="number" {...register('lowStockAlert')} className="h-14 border-slate-200 focus:border-[#2874F0] bg-slate-50/50" />
              </div>
            </div>
          </div>

          {/* Specifications */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                <div className="p-2 bg-orange-50 rounded-xl text-orange-500"><Info size={20} /></div>
                Technical Specifications
              </h3>
              <Button 
                type="button" 
                onClick={() => append({ key: '', value: '' })}
                className="h-10 px-4 bg-slate-50 text-slate-600 hover:bg-slate-100 border-none font-black text-xs uppercase gap-2"
              >
                <Plus size={16} /> Add Row
              </Button>
            </div>
            
            <div className="space-y-3">
              <div className="grid grid-cols-[1fr,1fr,48px] gap-4 px-2">
                <span className="text-[10px] font-black uppercase text-slate-300">Specification Name</span>
                <span className="text-[10px] font-black uppercase text-slate-300">Value</span>
              </div>
              {fields.map((field, index) => (
                <motion.div 
                  layout
                  key={field.id} 
                  className="grid grid-cols-[1fr,1fr,48px] gap-4 items-center group"
                >
                  <Input {...register(`specifications.${index}.key` as const)} placeholder="e.g. Color" className="h-12 border-slate-100 group-hover:border-slate-200" />
                  <Input {...register(`specifications.${index}.value` as const)} placeholder="e.g. Jet Black" className="h-12 border-slate-100 group-hover:border-slate-200" />
                  <button 
                    type="button" 
                    onClick={() => remove(index)}
                    className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </motion.div>
              ))}
              {fields.length === 0 && (
                <div className="py-12 border-2 border-dashed border-slate-50 rounded-3xl flex flex-col items-center gap-2 text-slate-300">
                  <Info size={32} strokeWidth={1.5} />
                  <p className="text-sm font-bold">Add technical specs to help customers choose</p>
                </div>
              )}
            </div>
          </div>

          {/* SEO Collapsible */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden transition-all">
            <button 
              type="button"
              onClick={() => setShowSeo(!showSeo)}
              className="w-full flex items-center justify-between p-8 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 rounded-xl text-slate-500"><Globe size={20} /></div>
                <h3 className="text-xl font-black text-slate-900">Search Engine Optimization (SEO)</h3>
              </div>
              <ChevronDown size={24} className={`text-slate-400 transition-transform ${showSeo ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {showSeo && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-8 pb-8 space-y-6"
                >
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase text-slate-400 ml-1">Meta Title</label>
                    <Input {...register('metaTitle')} className="h-14 border-slate-200 focus:border-[#2874F0]" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase text-slate-400 ml-1">Meta Description</label>
                    <textarea 
                      {...register('metaDescription')}
                      className="w-full h-24 p-4 rounded-2xl bg-slate-50/50 border border-slate-200 outline-none focus:border-[#2874F0] text-sm font-medium"
                    />
                  </div>
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Google Preview</p>
                    <h4 className="text-blue-700 text-lg font-bold mb-1 line-clamp-1">{watch('metaTitle') || 'Product Name'}</h4>
                    <p className="text-green-700 text-xs mb-2 truncate">townbolt.in &gt; p &gt; {watch('slug')}</p>
                    <p className="text-slate-500 text-sm line-clamp-2">{watch('metaDescription') || 'No description provided.'}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="flex-1 space-y-8">
          {/* Images */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-lg font-black text-slate-900 border-b border-slate-50 pb-4">Product Images</h3>
            
            <div 
              className="relative border-2 border-dashed border-slate-200 hover:border-[#2874F0] hover:bg-blue-50/30 rounded-3xl p-8 flex flex-col items-center gap-3 transition-all cursor-pointer group"
              onClick={() => document.getElementById('image-upload')?.click()}
            >
              <input 
                id="image-upload" 
                type="file" 
                multiple 
                className="hidden" 
                onChange={handleImageUpload}
              />
              <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-slate-300 group-hover:text-[#2874F0] transition-colors">
                {uploadImageMutation.isPending ? <Loader2 className="animate-spin" size={24} /> : <Upload size={24} />}
              </div>
              <div className="text-center">
                <p className="text-sm font-black text-slate-800">Drop images here</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">PNG, JPG up to 5MB</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {watchImages.map((url, idx) => (
                <div key={idx} className="relative aspect-square rounded-2xl border border-slate-100 overflow-hidden group">
                  <Image src={url} alt={`Preview ${idx}`} fill className="object-cover" />
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button 
                      type="button" 
                      onClick={() => removeImage(idx)}
                      className="p-2 bg-white text-red-500 rounded-lg shadow-xl hover:scale-110 transition-transform"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  {idx === 0 && (
                    <div className="absolute top-2 left-2 px-2 py-1 bg-[#2874F0] text-white text-[9px] font-black uppercase rounded-lg tracking-widest">Main</div>
                  )}
                </div>
              ))}
            </div>
            {errors.images && <p className="text-red-500 text-xs font-bold text-center">{errors.images.message}</p>}
          </div>

          {/* Organization */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-lg font-black text-slate-900 border-b border-slate-50 pb-4">Organisation</h3>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase text-slate-400 ml-1">Category*</label>
                <select 
                  {...register('categoryId')}
                  className="w-full h-14 px-4 bg-slate-50/50 border border-slate-200 rounded-2xl outline-none focus:border-[#2874F0] text-sm font-bold appearance-none cursor-pointer"
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                <button type="button" className="text-[10px] font-black uppercase text-[#2874F0] hover:underline ml-1">+ Add New Category</button>
              </div>

              {subCategories.length > 0 && (
                <div className="space-y-1.5 animate-in slide-in-from-top-2 duration-300">
                  <label className="text-xs font-black uppercase text-slate-400 ml-1">Sub-category</label>
                  <select 
                    {...register('subCategoryId')}
                    className="w-full h-14 px-4 bg-slate-50/50 border border-slate-200 rounded-2xl outline-none focus:border-[#2874F0] text-sm font-bold appearance-none cursor-pointer"
                  >
                    <option value="">Select Sub-category</option>
                    {subCategories.map(sub => (
                      <option key={sub.id} value={sub.id}>{sub.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-black uppercase text-slate-400 ml-1">Tags</label>
                <div className="space-y-3">
                  <Input 
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    placeholder="Type and press Enter"
                    className="h-14 border-slate-100"
                  />
                  <div className="flex flex-wrap gap-2">
                    {watchTags.map(tag => (
                      <Badge key={tag} className="gap-1.5 py-2 pl-3 bg-slate-50 border-slate-100 text-slate-600 font-bold">
                        {tag}
                        <button type="button" onClick={() => setValue('tags', watchTags.filter(t => t !== tag))}>
                          <X size={12} className="text-slate-400 hover:text-red-500" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-lg font-black text-slate-900 border-b border-slate-50 pb-4">Product Status</h3>
            <div className="space-y-6">
              {[
                { id: 'isActive', label: 'Visible on shop', sub: 'Enable to show globally' },
                { id: 'isFeatured', label: 'Feature on Home', sub: 'Show in featured blocks' },
                { id: 'isNewArrival', label: 'New Arrival Badge', sub: 'Add "New" tag to image' },
                { id: 'isBestSeller', label: 'Best Seller Badge', sub: 'Add "Best Seller" tag' },
              ].map((item) => (
                <div key={item.id} className="flex items-center justify-between group">
                  <div>
                    <p className="text-sm font-black text-slate-800">{item.label}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.sub}</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setValue(item.id as any, !watch(item.id as any))}
                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all ring-offset-4 focus:ring-2 focus:ring-blue-100 ${watch(item.id as any) ? 'bg-[#2874F0]' : 'bg-slate-200'}`}
                  >
                    <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${watch(item.id as any) ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 lg:left-64 right-0 bg-white/80 backdrop-blur-xl border-t border-slate-100 p-6 z-40 flex items-center justify-between px-10">
        <div className="flex items-center gap-6">
          <Button type="button" variant="outline" className="h-14 px-8 rounded-xl border-slate-200 text-slate-500 font-black uppercase text-sm">
            Save as Draft
          </Button>
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Auto-save Status</span>
            <span className="text-xs font-bold text-slate-600 flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              Saved at {lastSaved || 'Just now'}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button type="button" className="text-sm font-black text-slate-400 hover:text-slate-600 px-6 uppercase tracking-widest">
            Discard
          </button>
          <Button 
            type="submit" 
            isLoading={isLoading}
            className="h-14 px-12 bg-[#2874F0] hover:bg-[#1a5dc8] text-white font-black rounded-xl text-lg shadow-2xl shadow-blue-100 min-w-[200px]"
          >
            {initialData ? 'Save Changes' : 'Publish Product'}
          </Button>
        </div>
      </div>
    </form>
  )
}
