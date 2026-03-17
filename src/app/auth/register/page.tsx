'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
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
  User,
  Phone,
  CheckCircle2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useRegister } from '@/hooks/useAuth'
import { handleGoogleLogin } from '@/lib/google-auth'

const registerSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters").max(50),
  lastName: z.string().optional(),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit phone number"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must include one uppercase letter")
    .regex(/[0-9]/, "Must include one number")
    .regex(/[^A-Za-z0-9]/, "Must include one special character"),
  confirmPassword: z.string(),
  terms: z.boolean().refine(val => val === true, "You must agree to the terms"),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

type RegisterFormValues = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const registerMutation = useRegister()

  const { 
    register, 
    handleSubmit, 
    trigger,
    watch,
    formState: { errors } 
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      terms: false
    }
  })

  const password = watch('password', '')

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

  const nextStep = async () => {
    const isValid = await trigger(['firstName', 'lastName', 'email', 'phone'])
    if (isValid) setStep(2)
  }

  const onSubmit = (data: RegisterFormValues) => {
    const { confirmPassword, terms, ...registerData } = data
    registerMutation.mutate(registerData)
  }

  return (
    <div className="flex w-full min-h-screen bg-white">
      {/* Left Decorative Panel (Same as login) */}
      <div className="hidden lg:flex flex-col flex-[0.8] bg-gradient-to-br from-[#2874F0] to-[#1a5dc8] text-white p-16 justify-between relative overflow-hidden">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], x: [0, 20, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-[-10%] left-[-10%] w-[40%] aspect-square rounded-full bg-white/10 blur-3xl" 
        />
        
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-10 translate-x-[-8px]">
             <div className="bg-white p-2 rounded-xl shadow-lg rotate-[-5deg]">
               <Zap size={32} className="text-[#2874F0] fill-[#2874F0]" />
             </div>
             <span className="text-4xl font-black tracking-tight italic">TownBolt</span>
          </Link>
          
          <h1 className="text-4xl font-bold mb-4 leading-tight">
            Create an account <br /> and start shopping
          </h1>
          <p className="text-blue-100 text-lg opacity-80 mb-12">
            Join thousands of happy customers shopping on TownBolt today.
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

        <div className="relative z-10 mt-auto flex justify-center">
          <svg width="300" height="150" viewBox="0 0 300 150" fill="none" xmlns="http://www.w3.org/2000/svg">
             <motion.path d="M50 80h40v40H50z" fill="white" fillOpacity="0.2" />
             <motion.circle cx="120" cy="100" r="30" fill="white" fillOpacity="0.15" />
             <motion.rect x="180" y="60" width="50" height="70" rx="4" fill="white" fillOpacity="0.2" />
             <motion.path 
                animate={{ opacity: [0.2, 0.8, 0.2] }}
                transition={{ duration: 2, repeat: Infinity }}
                d="M260 40l3 7h7l-5 4 2 7-7-4-7 4 2-7-5-4h7z" fill="white" 
             />
          </svg>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 lg:px-20 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-3xl font-black text-slate-900 mb-2">Create your account</h2>
            <p className="text-slate-500 font-medium">
              Already have an account? <Link href="/auth/login" className="text-[#2874F0] font-bold hover:underline">Login</Link>
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-10">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-black uppercase text-[#2874F0]">Step {step} of 2</span>
              <span className="text-xs font-bold text-slate-400">{step === 1 ? 'Personal Info' : 'Security'}</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <motion.div 
                animate={{ width: step === 1 ? '50%' : '100%' }}
                className="h-full bg-[#2874F0]"
              />
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-5"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-black uppercase tracking-wider text-slate-400 ml-1">First Name*</label>
                      <Input 
                        {...register('firstName')}
                        placeholder="John"
                        className="h-14 border-slate-200 focus:border-[#2874F0] bg-slate-50/50"
                      />
                      {errors.firstName && <p className="text-red-500 text-xs font-bold ml-1">{errors.firstName.message}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-black uppercase tracking-wider text-slate-400 ml-1">Last Name</label>
                      <Input 
                        {...register('lastName')}
                        placeholder="Doe"
                        className="h-14 border-slate-200 focus:border-[#2874F0] bg-slate-50/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-400 ml-1">Email*</label>
                    <div className="relative">
                      <Input 
                        {...register('email')}
                        type="email" 
                        placeholder="john@example.com"
                        className="pl-12 h-14 border-slate-200 focus:border-[#2874F0] bg-slate-50/50"
                      />
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    </div>
                    {errors.email && <p className="text-red-500 text-xs font-bold ml-1">{errors.email.message}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-400 ml-1">Phone Number*</label>
                    <div className="relative">
                      <div className="absolute left-0 top-0 h-full flex items-center px-4 border-r border-slate-200 text-slate-500 font-bold bg-slate-100/50 rounded-l-xl">
                        🇮🇳 +91
                      </div>
                      <Input 
                        {...register('phone')}
                        type="tel" 
                        placeholder="00000 00000"
                        className="pl-[84px] h-14 border-slate-200 focus:border-[#2874F0] bg-slate-50/50"
                      />
                    </div>
                    {errors.phone && <p className="text-red-500 text-xs font-bold ml-1">{errors.phone.message}</p>}
                  </div>

                  <Button 
                    type="button" 
                    onClick={nextStep}
                    className="w-full h-14 bg-[#2874F0] hover:bg-[#1a5dc8] text-white font-black text-lg shadow-xl shadow-blue-100 rounded-xl mt-4 flex items-center justify-center gap-2"
                  >
                    Continue <ChevronRight size={20} />
                  </Button>
                </motion.div>
              ) : (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-400 ml-1">Password*</label>
                    <div className="relative">
                      <Input 
                        {...register('password')}
                        type={showPassword ? 'text' : 'password'} 
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
                      <div className="space-y-2 px-1">
                        <div className="flex justify-between items-center text-xs font-bold mb-1">
                          <span className="text-slate-400">Security Strength:</span>
                          <span className={`${strength === 0 ? 'text-red-500' : strength === 1 ? 'text-orange-500' : strength === 2 ? 'text-green-500' : 'text-blue-500'}`}>
                            {strengthLabels[strength - 1] || 'Too Weak'}
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full flex gap-1">
                          {[1, 2, 3, 4].map((i) => (
                            <div key={i} className={`h-full flex-1 rounded-full ${strength >= i ? strengthColors[strength - 1] : 'bg-slate-200'}`} />
                          ))}
                        </div>
                        <div className="grid grid-cols-2 gap-y-1.5 mt-2">
                           {[
                             { label: '8+ Characters', met: password.length >= 8 },
                             { label: 'Uppercase', met: /[A-Z]/.test(password) },
                             { label: 'Number', met: /[0-9]/.test(password) },
                             { label: 'Special Char', met: /[^A-Za-z0-9]/.test(password) },
                           ].map((req, i) => (
                             <div key={i} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-tight">
                               <CheckCircle2 size={12} className={req.met ? 'text-green-500' : 'text-slate-200'} />
                               <span className={req.met ? 'text-slate-600' : 'text-slate-300'}>{req.label}</span>
                             </div>
                           ))}
                        </div>
                      </div>
                    )}
                    {errors.password && <p className="text-red-500 text-xs font-bold mt-1">{errors.password.message}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-400 ml-1">Confirm Password*</label>
                    <div className="relative">
                      <Input 
                        {...register('confirmPassword')}
                        type="password" 
                        placeholder="••••••••"
                        className="pl-12 h-14 border-slate-200 focus:border-[#2874F0] bg-slate-50/50"
                      />
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    </div>
                    {errors.confirmPassword && <p className="text-red-500 text-xs font-bold mt-1 ml-1">{errors.confirmPassword.message}</p>}
                  </div>

                  <div className="flex items-start gap-3 py-2">
                    <input 
                      type="checkbox" 
                      id="terms" 
                      {...register('terms')}
                      className="mt-1 w-5 h-5 border-2 border-slate-200 rounded-md text-[#2874F0] focus:ring-[#2874F0]" 
                    />
                    <label htmlFor="terms" className="text-sm font-medium text-slate-500 leading-snug">
                      I agree to TownBolt&apos;s <Link href="#" className="font-bold text-slate-700 hover:text-[#2874F0]">Terms of Use</Link> and <Link href="#" className="font-bold text-slate-700 hover:text-[#2874F0]">Privacy Policy</Link>
                    </label>
                  </div>
                  {errors.terms && <p className="text-red-500 text-xs font-bold ml-1">{errors.terms.message}</p>}

                  <div className="flex gap-4 mt-6">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => setStep(1)}
                      className="flex-1 h-14 bg-white text-slate-600 font-black text-lg border-2 border-slate-200 rounded-xl flex items-center justify-center gap-2"
                    >
                      <ChevronLeft size={20} /> Back
                    </Button>
                    <Button 
                      type="submit" 
                      isLoading={registerMutation.isPending}
                      className="flex-[2] h-14 bg-[#2874F0] hover:bg-[#1a5dc8] text-white font-black text-lg shadow-xl shadow-blue-100 rounded-xl"
                    >
                      Create Account
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>

          <div className="relative flex items-center justify-center my-10">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
            <span className="relative z-10 bg-white px-4 text-xs font-black text-slate-300 uppercase tracking-widest">OR</span>
          </div>

          <Button 
            type="button" 
            variant="outline"
            onClick={handleGoogleLogin}
            className="w-full h-14 bg-white text-slate-700 font-black border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-xl flex items-center justify-center gap-3"
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </Button>
        </div>
      </div>
    </div>
  )
}
