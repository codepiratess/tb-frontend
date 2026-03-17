'use client'

import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { ProductForm } from '@/components/admin/ProductForm'
import { useAdminProduct, useUpdateProduct } from '@/hooks/useAdminProducts'
import { toast } from 'react-hot-toast'

export default function EditProductPage() {
  const { id } = useParams() as { id: string }
  const router = useRouter()
  
  const { data: productResponse, isLoading } = useAdminProduct(id)
  const product = productResponse?.data

  const { mutate: updateProduct, isPending } = useUpdateProduct()

  const onSubmit = (data: any) => {
    updateProduct({ id, data }, {
      onSuccess: () => {
        toast.success('Product updated successfully!')
        router.push('/admin/products')
      },
      onError: (err) => {
        toast.error('Failed to update product')
        console.error(err)
      }
    })
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="w-10 h-10 border-4 border-slate-100 border-t-[#2874F0] rounded-full animate-spin" />
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Fetching Product ID #{id.substring(0, 8)}...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-20 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col gap-2">
        <button 
          onClick={() => router.back()} 
          className="text-xs font-black text-slate-400 hover:text-[#2874F0] flex items-center gap-1 w-fit transition-colors uppercase tracking-widest"
        >
          <ChevronLeft size={14} /> Back to Inventory
        </button>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Edit Product</h1>
        <p className="text-slate-500 font-bold">Update details, images, pricing or stock status.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
        <ProductForm initialData={product} onSubmit={onSubmit} isLoading={isPending} isEditing={true} />
      </div>
    </div>
  )
}
