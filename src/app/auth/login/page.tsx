'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Mail, 
  Lock, 
  EyeOff, 
  Eye, 
  ShieldCheck, 
  Zap, 
  Truck, 
  RotateCcw, 
  Phone,
  ArrowRight
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useLogin, useSendOTP } from '@/hooks/useAuth'
import { handleGoogleLogin } from '@/lib/google-auth'

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

const phoneSchema = z.object({
  phone: z.string().regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit phone number"),
})

type EmailFormValues = z.infer<typeof emailSchema>
type PhoneFormValues = z.infer<typeof phoneSchema>

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<'email' | 'phone'>('email')
  const [showPassword, setShowPassword] = useState(false)
  const [isOtpSent, setIsOtpSent] = useState(false)
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [timer, setTimer] = useState(45)

  const loginMutation = useLogin()
  const sendOtpMutation = useSendOTP()

  const { 
    register: registerEmail, 
    handleSubmit: handleSubmitEmail, 
    formState: { errors: emailErrors } 
  } = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema)
  })

  const { 
    register: registerPhone, 
    handleSubmit: handleSubmitPhone, 
    formState: { errors: phoneErrors },
    getValues: getPhoneValues
  } = useForm<PhoneFormValues>({
    resolver: zodResolver(phoneSchema)
  })

  useEffect(() => {
    let interval: any
    if (isOtpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isOtpSent, timer])

  const onEmailSubmit = (data: EmailFormValues) => {
    loginMutation.mutate(data)
  }

  const onPhoneSubmit = (data: PhoneFormValues) => {
    sendOtpMutation.mutate(data.phone, {
      onSuccess: () => {
        setIsOtpSent(true)
        setTimer(45)
      }
    })
  }

  const handleOtpChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return
    const newOtp = [...otp]
    newOtp[index] = value.substring(value.length - 1)
    setOtp(newOtp)

    // Move to next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      nextInput?.focus()
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`)
      prevInput?.focus()
    }
  }

  const onOtpSubmit = () => {
    const otpString = otp.join('')
    if (otpString.length === 6) {
      loginMutation.mutate({ 
        phone: getPhoneValues('phone'), 
        otp: otpString 
      })
    }
  }

  return (
    <div className="flex w-full min-h-screen bg-white">
      {/* Left Decorative Panel */}
      <div className="hidden lg:flex flex-col flex-[0.8] bg-gradient-to-br from-[#2874F0] to-[#1a5dc8] text-white p-16 justify-between relative overflow-hidden">
        {/* Floating circles */}
        <motion.div 
          animate={{ scale: [1, 1.1, 1], x: [0, 20, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-[-10%] left-[-10%] w-[40%] aspect-square rounded-full bg-white/10 blur-3xl" 
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], y: [0, -30, 0] }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute bottom-[-20%] right-[-10%] w-[50%] aspect-square rounded-full bg-white/10 blur-3xl" 
        />

        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-10 translate-x-[-8px]">
             <div className="bg-white p-2 rounded-xl shadow-lg rotate-[-5deg]">
               <Zap size={32} className="text-[#2874F0] fill-[#2874F0]" />
             </div>
             <span className="text-4xl font-black tracking-tight italic">TownBolt</span>
          </Link>
          
          <h1 className="text-4xl font-bold mb-4 leading-tight">
            India&apos;s favourite <br /> neighbourhood store
          </h1>
          <p className="text-blue-100 text-lg opacity-80 mb-12">
            Login to access your orders, wishlist and recommendations.
          </p>

          <div className="space-y-8">
            <div className="flex items-center gap-5">
              <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm">
                <Truck className="text-white" size={24} />
              </div>
              <span className="text-lg font-medium">Free delivery above ₹499</span>
            </div>
            <div className="flex items-center gap-5">
              <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm">
                <ShieldCheck className="text-white" size={24} />
              </div>
              <span className="text-lg font-medium">100% Secure payments</span>
            </div>
            <div className="flex items-center gap-5">
              <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm">
                <RotateCcw className="text-white" size={24} />
              </div>
              <span className="text-lg font-medium">Easy 30-day returns</span>
            </div>
          </div>
        </div>

        {/* Decorative SVG Shapes */}
        <div className="relative z-10 mt-auto flex justify-center">
          <svg width="300" height="150" viewBox="0 0 300 150" fill="none" xmlns="http://www.w3.org/2000/svg">
             {/* Shopping Box */}
             <motion.path 
               initial={{ y: 20, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               transition={{ delay: 0.5 }}
               d="M50 80h40v40H50z" fill="white" fillOpacity="0.2" 
             />
             <motion.path 
               initial={{ y: 20, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               transition={{ delay: 0.6 }}
               d="M60 70h20v10H60z" fill="white" fillOpacity="0.3" 
             />
             {/* Bags */}
             <motion.circle 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.7 }}
                cx="120" cy="100" r="30" fill="white" fillOpacity="0.15" 
             />
             <motion.rect 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8 }}
                x="180" y="60" width="50" height="70" rx="4" fill="white" fillOpacity="0.2" 
             />
             {/* Stars */}
             <motion.path 
                animate={{ opacity: [0.2, 0.8, 0.2] }}
                transition={{ duration: 2, repeat: Infinity }}
                d="M260 40l3 7h7l-5 4 2 7-7-4-7 4 2-7-5-4h7z" fill="white" 
             />
             <motion.path 
                animate={{ opacity: [0.8, 0.2, 0.8] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                d="M30 30l2 5h5l-4 3 1 5-4-3-4 3 1-5-4-3h5z" fill="white" 
             />
          </svg>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 lg:px-20 py-12">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-black text-slate-900 mb-2">Welcome back</h2>
            <p className="text-slate-500 font-medium">
              New to TownBolt? <Link href="/auth/register" className="text-[#2874F0] font-bold hover:underline">Create account</Link>
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="relative flex border-b border-slate-100 mb-8">
            <button 
              onClick={() => { setActiveTab('email'); setIsOtpSent(false); }}
              className={`flex-1 py-4 text-sm font-bold transition-colors ${activeTab === 'email' ? 'text-[#2874F0]' : 'text-slate-400'}`}
            >
              Email
            </button>
            <button 
              onClick={() => setActiveTab('phone')}
              className={`flex-1 py-4 text-sm font-bold transition-colors ${activeTab === 'phone' ? 'text-[#2874F0]' : 'text-slate-400'}`}
            >
              Phone Number
            </button>
            <motion.div 
               animate={{ x: activeTab === 'email' ? 0 : '100%' }}
               className="absolute bottom-0 left-0 w-1/2 h-1 bg-[#2874F0] rounded-t-full"
            />
          </div>

          <div className="min-h-[300px]">
            <AnimatePresence mode="wait">
              {activeTab === 'email' ? (
                <motion.form 
                  key="email-form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onSubmit={handleSubmitEmail(onEmailSubmit)} 
                  className="space-y-5"
                >
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-400 ml-1">Email Address</label>
                    <div className="relative">
                      <Input 
                        {...registerEmail('email')}
                        type="email" 
                        placeholder="example@mail.com"
                        className="pl-12 h-14 border-slate-200 focus:border-[#2874F0] focus:ring-4 focus:ring-blue-50 ring-inset bg-slate-50/50"
                      />
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    </div>
                    {emailErrors.email && <p className="text-red-500 text-xs font-bold mt-1 ml-1">{emailErrors.email.message}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-black uppercase tracking-wider text-slate-400 ml-1">Password</label>
                      <Link href="/auth/forgot-password" title="Go to forgot password" className="text-xs font-bold text-[#2874F0] hover:underline">Forgot Password?</Link>
                    </div>
                    <div className="relative">
                      <Input 
                        {...registerEmail('password')}
                        type={showPassword ? 'text' : 'password'} 
                        placeholder="••••••••"
                        className="pl-12 pr-12 h-14 border-slate-200 focus:border-[#2874F0] focus:ring-4 focus:ring-blue-50 ring-inset bg-slate-50/50"
                      />
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {emailErrors.password && <p className="text-red-500 text-xs font-bold mt-1 ml-1">{emailErrors.password.message}</p>}
                  </div>

                  <Button 
                    type="submit" 
                    isLoading={loginMutation.isPending}
                    className="w-full h-14 bg-[#2874F0] hover:bg-[#1a5dc8] text-white font-black text-lg shadow-xl shadow-blue-100 rounded-xl transition-all active:scale-[0.98] mt-4"
                  >
                    Login
                  </Button>
                </motion.form>
              ) : (
                <motion.div
                  key="phone-form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  <form onSubmit={handleSubmitPhone(onPhoneSubmit)} className="space-y-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-black uppercase tracking-wider text-slate-400 ml-1">Phone Number</label>
                      <div className="relative">
                        <div className="absolute left-0 top-0 h-full flex items-center pl-4 pr-3 border-r border-slate-200 text-slate-500 font-bold bg-slate-100/50 rounded-l-xl">
                          🇮🇳 +91
                        </div>
                        <Input 
                          {...registerPhone('phone')}
                          type="tel" 
                          disabled={isOtpSent}
                          placeholder="00000 00000"
                          className="pl-[84px] h-14 border-slate-200 focus:border-[#2874F0] focus:ring-4 focus:ring-blue-50 ring-inset bg-slate-50/50"
                        />
                      </div>
                      {phoneErrors.phone && <p className="text-red-500 text-xs font-bold mt-1 ml-1">{phoneErrors.phone.message}</p>}
                    </div>

                    {!isOtpSent && (
                      <Button 
                        type="submit" 
                        isLoading={sendOtpMutation.isPending}
                        className="w-full h-14 bg-[#2874F0] hover:bg-[#1a5dc8] text-white font-black text-lg shadow-xl shadow-blue-100 rounded-xl transition-all active:scale-[0.98]"
                      >
                        Send OTP
                      </Button>
                    )}
                  </form>

                  {isOtpSent && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6 pt-2"
                    >
                      <div className="text-center">
                        <p className="text-sm font-medium text-slate-500">
                          We&apos;ve sent an OTP to <span className="text-slate-900 font-bold">+91 {getPhoneValues('phone')}</span>
                          <button onClick={() => setIsOtpSent(false)} className="ml-2 text-[#2874F0] text-xs font-bold hover:underline">Change</button>
                        </p>
                      </div>

                      <div className="flex justify-between gap-2">
                        {otp.map((digit, idx) => (
                          <input
                            key={idx}
                            id={`otp-${idx}`}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpChange(idx, e.target.value)}
                            onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                            className="w-12 h-14 text-center text-xl font-black border-2 border-slate-200 rounded-xl focus:border-[#2874F0] focus:ring-4 focus:ring-blue-50 outline-none transition-all"
                          />
                        ))}
                      </div>

                      <div className="flex flex-col gap-4">
                        <Button 
                          onClick={onOtpSubmit}
                          disabled={otp.join('').length < 6}
                          isLoading={loginMutation.isPending}
                          className="w-full h-14 bg-[#2874F0] hover:bg-[#1a5dc8] text-white font-black text-lg shadow-xl shadow-blue-100 rounded-xl"
                        >
                          Verify & Login
                        </Button>

                        <div className="text-center">
                          {timer > 0 ? (
                            <p className="text-sm font-bold text-slate-400">Resend OTP in <span className="text-[#2874F0]">{timer}s</span></p>
                          ) : (
                            <button 
                              onClick={() => onPhoneSubmit({ phone: getPhoneValues('phone') })}
                              disabled={sendOtpMutation.isPending}
                              className="text-sm font-black text-[#2874F0] hover:underline"
                            >
                              Resend OTP
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="relative flex items-center justify-center my-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <span className="relative z-10 bg-white px-4 text-xs font-black text-slate-300 uppercase tracking-[0.2em]">
              OR
            </span>
          </div>

          <Button 
            type="button" 
            variant="outline"
            onClick={handleGoogleLogin}
            className="w-full h-14 bg-white text-slate-700 font-black border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-xl flex items-center justify-center gap-3 transition-all"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </Button>

          <p className="mt-12 text-sm text-center text-slate-400 font-medium leading-relaxed">
            By continuing, you agree to TownBolt&apos;s <Link href="#" className="font-bold text-slate-600 hover:text-[#2874F0] hover:underline transition-colors">Terms of Use</Link> and <Link href="#" className="font-bold text-slate-600 hover:text-[#2874F0] hover:underline transition-colors">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  )
}
