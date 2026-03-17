'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/navigation' // Wait, I should use next/link for client components
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, CheckCircle, ChevronLeft, ArrowRight, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useForgotPassword } from '@/hooks/useAuth'
import NextLink from 'next/link'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [timer, setTimer] = useState(60)
  const forgotPasswordMutation = useForgotPassword()

  useEffect(() => {
    let interval: any
    if (step === 2 && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [step, timer])

  const handleSendLink = () => {
    if (!email) return
    forgotPasswordMutation.mutate(email, {
      onSuccess: () => {
        setStep(2)
        setTimer(60)
      }
    })
  }

  const handleResend = () => {
    setTimer(60)
    forgotPasswordMutation.mutate(email)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-6 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white p-10 rounded-3xl shadow-xl shadow-slate-200 border border-slate-100"
      >
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center space-y-6"
            >
              <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Mail size={36} className="text-[#2874F0]" />
              </div>
              
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-slate-900">Forgot Password?</h2>
                <p className="text-slate-500 font-medium px-4">
                  Enter your registered email and we&apos;ll send you a reset link
                </p>
              </div>

              <div className="text-left space-y-1.5 pt-4">
                <label className="text-xs font-black uppercase tracking-wider text-slate-400 ml-1">Email Address</label>
                <Input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="h-14 border-slate-200 focus:border-[#2874F0] bg-slate-50/50"
                />
              </div>

              <Button 
                onClick={handleSendLink}
                isLoading={forgotPasswordMutation.isPending}
                className="w-full h-14 bg-[#2874F0] hover:bg-[#1a5dc8] text-white font-black text-lg rounded-xl flex items-center justify-center gap-2"
              >
                Send Reset Link <ArrowRight size={20} />
              </Button>

              <NextLink href="/auth/login" className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-[#2874F0] transition-colors">
                <ChevronLeft size={16} /> Back to Login
              </NextLink>
            </motion.div>
          ) : (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center space-y-6"
            >
              <div className="w-20 h-20 bg-green-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={36} className="text-green-500" />
              </div>
              
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-slate-900">Check your email!</h2>
                <p className="text-slate-500 font-medium">
                  We sent a password reset link to <span className="text-slate-900 font-bold">{email}</span>. Check your spam folder too.
                </p>
              </div>

              <div className="pt-6 space-y-4">
                <NextLink href="/auth/login" className="block w-full">
                  <Button variant="outline" className="w-full h-14 border-2 border-slate-200 text-slate-700 font-black text-lg rounded-xl">
                    Back to Login
                  </Button>
                </NextLink>

                <div className="text-center">
                   {timer > 0 ? (
                     <p className="text-sm font-bold text-slate-400">Resend email in <span className="text-[#2874F0]">{timer}s</span></p>
                   ) : (
                     <button 
                       onClick={handleResend}
                       className="text-sm font-black text-[#2874F0] hover:underline flex items-center gap-2 mx-auto"
                     >
                       <RotateCcw size={14} /> Resend Email
                     </button>
                   )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
