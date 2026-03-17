'use client'

import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Lock, EyeOff, Eye, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useResetPassword } from '@/hooks/useAuth'

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const resetMutation = useResetPassword()

  const getStrength = (pass: string) => {
    let score = 0
    if (pass.length >= 8) score++
    if (/[A-Z]/.test(pass)) score++
    if (/[0-9]/.test(pass)) score++
    if (/[^A-Za-z0-9]/.test(pass)) score++
    return score
  }

  const strength = getStrength(password)
  const strengthLabels = ['Weak', 'Fair', 'Strong', 'Very Strong']
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-green-500', 'bg-blue-500']

  const handleReset = () => {
    if (password !== confirmPassword) return
    resetMutation.mutate({ token, newPassword: password })
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-6 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white p-10 rounded-3xl shadow-xl shadow-slate-200 border border-slate-100"
      >
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Lock size={36} className="text-[#2874F0]" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-slate-900">Set New Password</h2>
            <p className="text-slate-500 font-medium px-4">
              Please enter a strong new password for your account
            </p>
          </div>

          <div className="text-left space-y-4 pt-4">
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-slate-400 ml-1">New Password</label>
              <div className="relative">
                <Input 
                  type={showPassword ? 'text' : 'password'} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-12 pr-12 h-14 border-slate-200 focus:border-[#2874F0] bg-slate-50/50"
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              
              {/* Strength Indicator */}
              {password && (
                <div className="space-y-2 px-1 pt-1">
                  <div className="h-1.5 w-full bg-slate-100 rounded-full flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className={`h-full flex-1 rounded-full ${strength >= i ? strengthColors[strength - 1] : 'bg-slate-200'}`} />
                    ))}
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                    <span className="text-slate-400">Security:</span>
                    <span className={`${strength === 0 ? 'text-red-500' : strength === 1 ? 'text-orange-500' : strength === 2 ? 'text-green-500' : 'text-blue-500'}`}>
                      {strengthLabels[strength - 1] || 'Too Weak'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-slate-400 ml-1">Confirm New Password</label>
              <Input 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="h-14 border-slate-200 focus:border-[#2874F0] bg-slate-50/50"
              />
              {confirmPassword && password !== confirmPassword && (
                <p className="text-red-500 text-xs font-bold ml-1">Passwords do not match</p>
              )}
            </div>
          </div>

          <Button 
            onClick={handleReset}
            disabled={!password || password !== confirmPassword || strength < 2}
            isLoading={resetMutation.isPending}
            className="w-full h-14 bg-[#2874F0] hover:bg-[#1a5dc8] text-white font-black text-lg rounded-xl shadow-lg shadow-blue-100"
          >
            Reset Password
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
