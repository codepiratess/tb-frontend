'use client'

import { useState } from 'react'
import { 
  Image as ImageIcon,
  Plus, 
  Pencil, 
  Trash2, 
  Eye,
  EyeOff,
  Upload,
  X,
  GripVertical,
  ExternalLink,
  Check,
  ChevronRight,
  Package
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  useBanners,
  useCreateBanner,
  useUpdateBanner,
  useDeleteBanner,
} from '@/hooks/useBanners'
import toast from 'react-hot-toast'

const BG_COLOR_OPTIONS = [
  { 
    label: 'Blue (Default)',
    value: 'from-[#2874F0] to-[#1a5dc8]',
    preview: 'bg-gradient-to-r from-blue-500 to-blue-700'
  },
  { 
    label: 'Orange (Fashion)',
    value: 'from-[#FF6B35] to-[#FF4500]',
    preview: 'bg-gradient-to-r from-orange-400 to-orange-600'
  },
  { 
    label: 'Purple (Premium)',
    value: 'from-[#7C3AED] to-[#5B21B6]',
    preview: 'bg-gradient-to-r from-purple-500 to-purple-800'
  },
  { 
    label: 'Green (Fresh)',
    value: 'from-[#059669] to-[#065F46]',
    preview: 'bg-gradient-to-r from-green-500 to-green-800'
  },
  { 
    label: 'Red (Sale)',
    value: 'from-[#DC2626] to-[#991B1B]',
    preview: 'bg-gradient-to-r from-red-500 to-red-800'
  },
  {
    label: 'Teal (Modern)',
    value: 'from-[#0891B2] to-[#164E63]',
    preview: 'bg-gradient-to-r from-cyan-500 to-cyan-900'
  },
]

const EMPTY_FORM = {
  title: '',
  subtitle: '',
  description: '',
  buttonText: 'Shop Now',
  buttonLink: '/products',
  bgColor: 'from-[#2874F0] to-[#1a5dc8]',
  isActive: true,
  sortOrder: 0,
}

export default function AdminBannersPage() {
  const { data: banners, isLoading } = useBanners()
  const createBanner = useCreateBanner()
  const updateBanner = useUpdateBanner()
  const deleteBanner = useDeleteBanner()
  
  const [showPanel, setShowPanel] = useState(false)
  const [editingBanner, setEditingBanner] = useState<any>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [uploadingId, setUploadingId] = useState<string | null>(null)
  const [showDeleteId, setShowDeleteId] = useState<string | null>(null)

  const openAdd = () => {
    setEditingBanner(null)
    setForm(EMPTY_FORM)
    setShowPanel(true)
  }

  const openEdit = (banner: any) => {
    setEditingBanner(banner)
    setForm({
      title: banner.title || '',
      subtitle: banner.subtitle || '',
      description: banner.description || '',
      buttonText: banner.buttonText || 'Shop Now',
      buttonLink: banner.buttonLink || '/products',
      bgColor: banner.bgColor || EMPTY_FORM.bgColor,
      isActive: banner.isActive ?? true,
      sortOrder: banner.sortOrder || 0,
    })
    setShowPanel(true)
  }

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      toast.error('Title is required')
      return
    }
    try {
      if (editingBanner) {
        await updateBanner.mutateAsync({
          id: editingBanner.id,
          dto: form,
        })
      } else {
        await createBanner.mutateAsync(form)
      }
      setShowPanel(false)
      setForm(EMPTY_FORM)
      setEditingBanner(null)
    } catch (e) {
      toast.error('Failed to save banner')
    }
  }

  const handleImageUpload = async (bannerId: string, file: File) => {
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB')
      return
    }
    setUploadingId(bannerId)
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const { default: api } = await import('@/lib/api')
      const uploadRes = await api.post('/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      const imageUrl = uploadRes.data?.data?.url

      if (!imageUrl) {
        throw new Error('Upload failed')
      }

      await updateBanner.mutateAsync({
        id: bannerId,
        dto: { image: imageUrl },
      })
      toast.success('Image uploaded!')
    } catch (e) {
      toast.error('Image upload failed')
    } finally {
      setUploadingId(null)
    }
  }

  const handleRemoveImage = async (banner: any) => {
    await updateBanner.mutateAsync({
      id: banner.id,
      dto: { image: null },
    })
  }

  const handleToggleStatus = async (banner: any) => {
    await updateBanner.mutateAsync({
      id: banner.id,
      dto: { isActive: !banner.isActive },
    })
  }

  const handleDelete = async (id: string) => {
    await deleteBanner.mutateAsync(id)
    setShowDeleteId(null)
  }

  const allBanners = banners || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hero Banners</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage homepage slider banners. Upload images or use color gradients as background.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-[#2874F0] text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#1a5dc8] transition-colors shadow-md shadow-blue-500/20"
        >
          <Plus size={18} />
          Add Banner
        </button>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
        <ImageIcon size={20} className="text-[#2874F0] shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-semibold text-blue-900">How banners work</p>
          <p className="text-blue-700 mt-0.5">
            Active banners appear in the homepage slider in sort order. 
            If no image is uploaded, the selected gradient color is used as background. 
            Recommended image size: 1400×400px.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => (
            <div key={i} className="h-32 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : allBanners.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
          <ImageIcon size={48} className="mx-auto text-gray-200 mb-4" />
          <p className="font-semibold text-gray-500">No banners yet</p>
          <p className="text-sm text-gray-400 mt-1 mb-4">Add your first banner to display on homepage</p>
          <button
            onClick={openAdd}
            className="bg-[#2874F0] text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#1a5dc8] transition-colors"
          >
            Add First Banner
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {allBanners.map((banner: any) => (
            <motion.div
              key={banner.id}
              layout
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
            >
              <div className="flex items-stretch flex-col md:flex-row">
                <div className={`w-full md:w-64 shrink-0 relative h-32 md:h-auto bg-gradient-to-r ${banner.bgColor || 'from-[#2874F0] to-[#1a5dc8]'}`}>
                  {banner.image ? (
                    <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-white p-4">
                        <p className="font-bold text-sm line-clamp-2">{banner.title}</p>
                        {banner.subtitle && <p className="text-xs text-white/70 mt-1 line-clamp-1">{banner.subtitle}</p>}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex-1 p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-gray-900">{banner.title}</h3>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${banner.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                            {banner.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        {banner.subtitle && <p className="text-sm text-gray-500 mt-1">{banner.subtitle}</p>}
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                          <span>Sort: #{banner.sortOrder}</span>
                          {banner.buttonLink && <span className="flex items-center gap-1"><ExternalLink size={10} />{banner.buttonLink}</span>}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-4 flex-wrap">
                    <label className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold cursor-pointer hover:bg-blue-100 transition-colors">
                      {uploadingId === banner.id ? <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /> : <Upload size={13} />}
                      {banner.image ? 'Change Image' : 'Upload Image'}
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) handleImageUpload(banner.id, file); }} />
                    </label>

                    {banner.image && (
                      <button onClick={() => handleRemoveImage(banner)} className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg text-xs font-semibold hover:bg-gray-100 transition-colors">
                        <X size={13} /> Remove Image
                      </button>
                    )}

                    <button
                      onClick={() => handleToggleStatus(banner)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${banner.isActive ? 'bg-orange-50 text-orange-700 hover:bg-orange-100' : 'bg-green-50 text-green-700 hover:bg-green-100'}`}
                    >
                      {banner.isActive ? <><EyeOff size={13} /> Hide</> : <><Eye size={13} /> Show</>}
                    </button>

                    <button onClick={() => openEdit(banner)} className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-100 transition-colors">
                      <Pencil size={13} /> Edit
                    </button>

                    {showDeleteId === banner.id ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-red-600 font-medium">Delete?</span>
                        <button onClick={() => handleDelete(banner.id)} className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-semibold hover:bg-red-600">Yes</button>
                        <button onClick={() => setShowDeleteId(null)} className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs font-semibold">No</button>
                      </div>
                    ) : (
                      <button onClick={() => setShowDeleteId(banner.id)} className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-100 transition-colors">
                        <Trash2 size={13} /> Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showPanel && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowPanel(false)} className="fixed inset-0 bg-black/40 z-[100]" />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-[101] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-gray-900">{editingBanner ? 'Edit Banner' : 'Add New Banner'}</h2>
                  <button onClick={() => setShowPanel(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><X size={20} /></button>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Title *</label>
                    <input type="text" value={form.title} onChange={(e) => setForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Electronics Sale" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2874F0]/20 focus:border-[#2874F0]" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Subtitle</label>
                    <input type="text" value={form.subtitle} onChange={(e) => setForm(p => ({ ...p, subtitle: e.target.value }))} placeholder="e.g. Up to 70% off" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2874F0]/20 focus:border-[#2874F0]" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                    <textarea 
                      value={form.description} 
                      onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))} 
                      placeholder="e.g. Shop Mobiles, Laptops & More" 
                      rows={3}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2874F0]/20 focus:border-[#2874F0] resize-none" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Button Text</label>
                      <input type="text" value={form.buttonText} onChange={(e) => setForm(p => ({ ...p, buttonText: e.target.value }))} placeholder="Shop Now" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2874F0]/20" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Button Link</label>
                      <input type="text" value={form.buttonLink} onChange={(e) => setForm(p => ({ ...p, buttonLink: e.target.value }))} placeholder="/products" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2874F0]/20" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Background Color <span className="text-xs font-normal text-gray-400 ml-2">(used when no image)</span></label>
                    <div className="grid grid-cols-3 gap-2">
                      {BG_COLOR_OPTIONS.map(opt => (
                        <button key={opt.value} type="button" onClick={() => setForm(p => ({ ...p, bgColor: opt.value }))} className={`relative h-12 rounded-xl overflow-hidden border-2 transition-all ${opt.preview} ${form.bgColor === opt.value ? 'border-gray-900 scale-105' : 'border-transparent'}`}>
                          {form.bgColor === opt.value && <div className="absolute inset-0 flex items-center justify-center"><Check size={16} className="text-white drop-shadow" /></div>}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Sort Order</label>
                    <input type="number" value={form.sortOrder} onChange={(e) => setForm(p => ({ ...p, sortOrder: Number(e.target.value) }))} min={0} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2874F0]/20" />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Active</p>
                      <p className="text-xs text-gray-400">Show on homepage slider</p>
                    </div>
                    <button type="button" onClick={() => setForm(p => ({ ...p, isActive: !p.isActive }))} className={`relative w-12 h-6 rounded-full transition-colors ${form.isActive ? 'bg-[#2874F0]' : 'bg-gray-300'}`}>
                      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${form.isActive ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>
                </div>

                <div className="mt-8 flex gap-3">
                  <button onClick={() => setShowPanel(false)} className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors">Cancel</button>
                  <button onClick={handleSubmit} disabled={createBanner.isPending || updateBanner.isPending} className="flex-1 py-3 bg-[#2874F0] text-white rounded-xl font-semibold text-sm hover:bg-[#1a5dc8] transition-colors disabled:opacity-50">
                    {createBanner.isPending || updateBanner.isPending ? 'Saving...' : editingBanner ? 'Save Changes' : 'Create Banner'}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
