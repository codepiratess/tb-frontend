'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'
import { RootState } from '@/store'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const { user, loading, accessToken } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Auth protection
  useEffect(() => {
    if (mounted && !loading) {
      if (!user || user.role !== 'admin') {
        router.replace('/auth/login?callbackUrl=/admin')
      }
    }
  }, [user, loading, router, mounted])

  // Show loading while initializing
  if (!mounted || (loading && accessToken)) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 gap-4">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-[#2874F0] rounded-full animate-spin shadow-xl shadow-blue-500/10" />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] animate-pulse">Authenticating Master Access...</p>
      </div>
    )
  }

  // Prevent flash of content if not authorized
  if (!user || user.role !== 'admin') {
    return null
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* Sidebar - Fixed width managed internally */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen w-full overflow-hidden">
        {/* Top Header */}
        <AdminHeader />

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 md:p-8 lg:p-10 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              layout
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="w-full h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
