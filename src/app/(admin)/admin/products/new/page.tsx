'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { ProductForm } from '@/components/admin/ProductForm'
import { useCreateProduct } from '@/hooks/useAdminProducts'
import { toast } from 'react-hot-toast'

export default function NewProductPage() {
  const router = useRouter()
  const { mutate: createProduct, isPending } = useCreateProduct()

  const onSubmit = (data: any) => {
    createProduct(data, {
      onSuccess: () => {
        toast.success('Product created successfully!')
        router.push('/admin/products')
      },
      onError: (err) => {
        toast.error('Failed to create product')
        console.error(err)
      }
    })
  }

  return (
    <div className="space-y-6 pb-20 max-w-5xl mx-auto">
      <div className="flex flex-col gap-2">
        <button 
          onClick={() => router.back()} 
          className="text-xs font-black text-slate-400 hover:text-[#2874F0] flex items-center gap-1 w-fit transition-colors uppercase tracking-widest"
        >
          <ChevronLeft size={14} /> Back to Inventory
        </button>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Add New Product</h1>
        <p className="text-slate-500 font-bold">Create a new entry in your store catalogue with details, pricing and stock.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
        <ProductForm onSubmit={onSubmit} isLoading={isPending} />
      </div>
    </div>
  )
}
