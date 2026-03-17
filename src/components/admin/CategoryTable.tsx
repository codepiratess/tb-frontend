'use client'

import React from 'react'
import Image from 'next/image'
import { Pencil, Trash2, MoreVertical } from 'lucide-react'
import { Category } from '@/types'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'

interface CategoryTableProps {
  categories: Category[] | undefined
  isLoading: boolean
  onEdit: (category: Category) => void
  onDelete: (id: string) => void
  onToggleStatus: (id: string) => void
}

export const CategoryTable: React.FC<CategoryTableProps> = ({
  categories,
  isLoading,
  onEdit,
  onDelete,
  onToggleStatus
}) => {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Image</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Category Name</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Slug</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Products Count</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {categories?.map((category) => (
              <tr key={category.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-gray-100 bg-gray-50">
                    <Image 
                      src={category.image} 
                      alt={category.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-bold text-gray-900">{category.name}</p>
                </td>
                <td className="px-6 py-4">
                  <span className="font-mono text-xs text-gray-400">{category.slug}</span>
                </td>
                <td className="px-6 py-4">
                  <Badge variant="info" className="bg-blue-50 text-[#2874F0] border-none font-semibold">
                    {category.productCount} Products
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <button 
                    onClick={() => onToggleStatus(category.id)}
                    className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors bg-[#2874F0]"
                  >
                    <span className="inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform translate-x-4.5" />
                  </button>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => onEdit(category)}
                      className="p-2 text-gray-400 hover:text-[#2874F0] hover:bg-blue-50 rounded-lg transition-all"
                    >
                      <Pencil size={18} />
                    </button>
                    <button 
                      onClick={() => onDelete(category.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
