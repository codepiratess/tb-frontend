'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle, Trash2, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'info'
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'info'
}: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100]"
          />
          
          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-[101]">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-8 pointer-events-auto border border-slate-100 mx-4"
            >
              <div className="flex flex-col items-center text-center">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${variant === 'danger' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-[#2874F0]'}`}>
                  {variant === 'danger' ? <Trash2 size={32} /> : <AlertCircle size={32} />}
                </div>

                <h3 className="text-xl font-black text-slate-900 mb-2">{title}</h3>
                <p className="text-slate-500 font-medium mb-8 leading-relaxed">
                  {message}
                </p>

                <div className="flex flex-col w-full gap-3">
                  <Button 
                    onClick={onConfirm}
                    className={`w-full h-14 font-black rounded-xl text-lg ${variant === 'danger' ? 'bg-red-500 hover:bg-red-600 shadow-red-100' : 'bg-[#2874F0] hover:bg-[#1a5dc8] shadow-blue-100'} text-white shadow-xl transition-all active:scale-[0.98]`}
                  >
                    {confirmLabel}
                  </Button>
                  <Button 
                    variant="ghost" 
                    onClick={onClose}
                    className="w-full h-14 text-slate-400 hover:text-slate-600 font-bold hover:bg-slate-50 rounded-xl"
                  >
                    {cancelLabel}
                  </Button>
                </div>
              </div>

              <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-2 text-slate-300 hover:text-slate-500 rounded-full hover:bg-slate-50 transition-all"
              >
                <X size={20} />
              </button>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
