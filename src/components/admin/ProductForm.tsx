'use client'

import React, { useState, useEffect, useMemo } from 'react'
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
  AlertCircle,
  Loader2,
  Upload
} from 'lucide-react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Category, Product } from '@/types'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { useCategories } from '@/hooks/useCategories'
import { useCreateProduct, useUpdateProduct } from '@/hooks/useProducts'
import { useRouter } from 'next/navigation'

const productSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  slug: z.string().min(3, 'Slug is required'),
  shortDescription: z.string().max(200, 'Max 200 characters').optional(),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.coerce.number().min(1, 'Selling price is required'),
  originalPrice: z.coerce.number().min(1, 'Original price is required'),
  stock: z.coerce.number().min(0, 'Stock cannot be negative'),
  sku: z.string().optional(),
  lowStockThreshold: z.coerce.number().default(10),
  categoryId: z.string().uuid('Please select a valid category'),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  isNewArrival: z.boolean().default(false),
  freeDelivery: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  specifications: z.array(z.object({
    key: z.string().min(1, 'Key required'),
    value: z.string().min(1, 'Value required')
  })).default([]),
  images: z.array(z.string()).min(1, 'At least one image is required')
})

type ProductFormData = z.infer<typeof productSchema>

interface ProductFormProps {
  initialData?: Product
  isEditing?: boolean
  onSubmit?: (data: any) => void
  isLoading?: boolean
}

export const ProductForm: React.FC<ProductFormProps> = ({ 
  initialData, 
  isEditing = false,
  onSubmit: externalOnSubmit,
  isLoading: externalIsLoading
}) => {
  const router = useRouter()
  const [tagInput, setTagInput] = useState('')
  const [isSlugEditable, setIsSlugEditable] = useState(false)
  const { data: categories, isLoading: categoriesLoading } = useCategories()
  
  const createProduct = useCreateProduct()
  const updateProduct = useUpdateProduct()

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
      ...initialData as any,
      categoryId: initialData.category?.id || '',
      specifications: initialData.specifications || [],
      images: initialData.images || [],
      tags: initialData.tags || [],
    } : {
      name: '',
      slug: '',
      shortDescription: '',
      description: '',
      price: 0,
      originalPrice: 0,
      stock: 0,
      sku: '',
      lowStockThreshold: 10,
      categoryId: '',
      isActive: true,
      isFeatured: false,
      isNewArrival: false,
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

  const generateSlug = (name: string) => 
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')

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
    return 0;
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
    // Falls back to URL input for now as per user request if storage not ready
    const url = prompt('Enter image URL:')
    if (url) {
      setValue('images', [...watchImages, url])
      toast.success('Image added')
    }
  }

  const generateSKU = () => {
    const random = Math.floor(1000 + Math.random() * 9000)
    setValue('sku', `TB-${watchCategoryId?.substring(0, 3).toUpperCase() || 'GEN'}-${random}`)
  }

  const isPending = externalIsLoading ?? (createProduct.isPending || updateProduct.isPending)

  const onFormSubmit = async (data: ProductFormData) => {
    if (externalOnSubmit) {
      externalOnSubmit(data)
      return
    }
    try {
      const dto = {
        ...data,
        price: Number(data.price),
        originalPrice: Number(data.originalPrice),
        stock: Number(data.stock),
        lowStockThreshold: Number(data.lowStockThreshold),
      }

      if (isEditing && initialData) {
        await updateProduct.mutateAsync({ id: initialData.id, dto })
      } else {
        await createProduct.mutateAsync(dto)
      }
    } catch (error) {
      // Handled by mutation
    }
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="pb-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-8 space-y-8">
          
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-xl font-black text-slate-900 border-b border-slate-50 pb-4 flex items-center gap-2">
              <Zap size={20} className="text-[#2874F0]" />
              Basic Information
            </h3>
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Product Name*</label>
                <Input 
                  placeholder="e.g. Sony WH-1000XM5" 
                  {...register('name')}
                  className="h-12 text-lg font-bold"
                />
                {errors.name && <p className="mt-1 text-xs font-bold text-red-500 ml-1">{errors.name.message}</p>}
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
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">SKU</label>
                  <div className="relative">
                    <Input 
                      placeholder="TB-HEAD-4829" 
                      {...register('sku')}
                      className="h-12"
                    />
                    <button 
                      type="button" 
                      onClick={generateSKU}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 bg-blue-50 text-[#2874F0] rounded-lg"
                    >
                      <Zap size={14} />
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Short Description</label>
                <Input 
                  placeholder="Punchy summary..." 
                  {...register('shortDescription')}
                  maxLength={200}
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Full Description*</label>
                <textarea 
                  {...register('description')}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm min-h-[150px] font-medium focus:outline-none focus:border-[#2874F0]"
                  placeholder="Detailed description..."
                />
                {errors.description && <p className="mt-1 text-xs font-bold text-red-500 ml-1">{errors.description.message}</p>}
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-xl font-black text-slate-900 border-b border-slate-50 pb-4 flex items-center gap-2">
              <IndianRupee size={20} className="text-[#2874F0]" />
              Pricing & Inventory
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Price*</label>
                <Input type="number" {...register('price')} className="h-12" />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">MRP*</label>
                <Input type="number" {...register('originalPrice')} className="h-12" />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Discount</label>
                <div className="h-12 flex items-center px-4 bg-blue-50 rounded-xl font-black text-[#2874F0]">
                  {discount}% OFF
                </div>
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Stock*</label>
                <Input type="number" {...register('stock')} className="h-12" />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Low Stock Alert</label>
                <Input type="number" {...register('lowStockThreshold')} className="h-12" />
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-slate-50 pb-4">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Layers size={20} className="text-[#2874F0]" />
                Specifications
              </h3>
              <Button type="button" variant="outline" size="sm" onClick={() => append({ key: '', value: '' })}>
                + ADD
              </Button>
            </div>
            {fields.map((field, idx) => (
              <div key={field.id} className="flex gap-4">
                <Input placeholder="Key" {...register(`specifications.${idx}.key` as const)} />
                <Input placeholder="Value" {...register(`specifications.${idx}.value` as const)} />
                <button type="button" onClick={() => remove(idx)} className="text-slate-300 hover:text-red-500">
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-lg font-black text-slate-900">Images*</h3>
            <div className="grid grid-cols-2 gap-3">
              {watchImages.map((img, idx) => (
                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border">
                  <Image src={img} alt="Product" fill className="object-cover" />
                  <button type="button" onClick={() => setValue('images', watchImages.filter((_, i) => i !== idx))}
                    className="absolute top-1 right-1 p-1 bg-white/80 rounded-full text-red-500">
                    <X size={12} />
                  </button>
                </div>
              ))}
              <button type="button" onClick={handleImageUpload}
                className="aspect-square rounded-xl border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-slate-300 hover:border-[#2874F0]">
                <ImageIcon size={20} />
                <span className="text-[10px] font-black uppercase">Upload URL</span>
              </button>
            </div>
            {errors.images && <p className="text-red-500 text-xs font-bold">{errors.images.message}</p>}
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-lg font-black text-slate-900">Organisation</h3>
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase mb-2">Category*</label>
              <select 
                {...register('categoryId')}
                className="w-full h-11 bg-slate-50 border rounded-xl px-4 text-sm font-bold"
              >
                <option value="">Select Category</option>
                {categories?.map((cat: any) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              {errors.categoryId && <p className="text-red-500 text-xs font-bold mt-1">{errors.categoryId.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase mb-2">Tags</label>
              <Input placeholder="Press Enter" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={handleAddTag} className="h-11" />
              <div className="flex flex-wrap gap-2 mt-2">
                {currentTags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-slate-100 text-[10px] font-black rounded uppercase flex items-center gap-1">
                    {tag} <button type="button" onClick={() => removeTag(tag)}><X size={10} /></button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-lg font-black text-slate-900">Status</h3>
            {[
              { id: 'isActive', label: 'Active' },
              { id: 'isFeatured', label: 'Featured' },
              { id: 'isNewArrival', label: 'New Arrival' },
              { id: 'freeDelivery', label: 'Free Delivery' },
            ].map((opt) => (
              <div key={opt.id} className="flex items-center justify-between">
                <span className="text-sm font-bold">{opt.label}</span>
                <input type="checkbox" {...register(opt.id as any)} className="w-5 h-5 rounded border-slate-300" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-[260px] right-0 bg-white border-t p-4 z-40 flex justify-end gap-3 px-10">
        <Button variant="ghost" type="button" onClick={() => router.back()}>Discard</Button>
        <Button 
          type="submit" 
          isLoading={isPending}
          className="bg-[#2874F0] text-white px-10 h-12"
        >
          {isEditing ? 'UPDATE PRODUCT' : 'PUBLISH PRODUCT'}
        </Button>
      </div>
    </form>
  )
}
