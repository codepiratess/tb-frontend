import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter, useSearchParams } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-hot-toast'
import api, { publicApi } from '@/lib/api'
import { API_ENDPOINTS } from '@/constants'
import { setUser, setToken, logout, setLoading } from '@/store/slices/authSlice'
import { RootState } from '@/store'
import { handleApiError } from '@/lib/errorHandler'
import { setAuthCookies, clearAuthCookies } from '@/lib/auth-cookies'

export function useLogin() {
  const dispatch = useDispatch()
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl')

  return useMutation({
    mutationFn: async (dto: any) => {
      const { data } = await publicApi.post(API_ENDPOINTS.AUTH.LOGIN, dto)
      return data // Make sure this matches backend: { data: { user, accessToken } }
    },
    onSuccess: (response) => {
      const { user, accessToken } = response.data
      setAuthCookies(accessToken, user.role)
      dispatch(setUser(user))
      dispatch(setToken(accessToken))
      toast.success(`Welcome back, ${user.firstName}! 👋`)
      
      if (user.role === 'admin') {
        router.push('/admin')
      } else {
        router.push(callbackUrl || '/')
      }
    },
    onError: (error: any) => {
      toast.error(handleApiError(error))
    },
  })
}

export function useRegister() {
  const dispatch = useDispatch()
  const router = useRouter()

  return useMutation({
    mutationFn: async (dto: any) => {
      const { data } = await publicApi.post(API_ENDPOINTS.AUTH.REGISTER, dto)
      return data.data || data
    },
    onSuccess: (data) => {
      // If backend returns user and token, auto-login
      if (data?.user && data?.accessToken) {
        const { user, accessToken } = data
        setAuthCookies(accessToken, user.role)
        dispatch(setUser(user))
        dispatch(setToken(accessToken))
        toast.success(`Welcome to TownBolt, ${user.firstName}! 🚀`)
        router.push('/')
      } else {
        toast.success('Account created! Please login.')
        router.push('/auth/login')
      }
    },
    onError: (error: any) => {
      toast.error(handleApiError(error))
    },
  })
}

export function useLogout() {
  const dispatch = useDispatch()
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      try {
        await api.post(API_ENDPOINTS.AUTH.LOGOUT)
      } catch (e) {
        // Ignore logout error if user is already logged out on server
      }
    },
    onSettled: () => {
      clearAuthCookies()
      dispatch(logout())
      queryClient.clear()
      router.push('/')
    },
  })
}

export function useCurrentUser() {
  const dispatch = useDispatch()
  const accessToken = useSelector((state: RootState) => state.auth.accessToken)

  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      try {
        const { data } = await api.get(API_ENDPOINTS.AUTH.ME)
        const user = data.data || data
        dispatch(setUser(user))
        dispatch(setLoading(false))
        return user
      } catch (error) {
        dispatch(setLoading(false))
        throw error
      }
    },
    enabled: !!accessToken,
    staleTime: 5 * 60 * 1000,
  })
}

export function useSendOTP() {
  return useMutation({
    mutationFn: async (phone: string) => {
      const { data } = await publicApi.post(API_ENDPOINTS.AUTH.SEND_OTP, { phone })
      return data
    },
    onSuccess: () => {
      toast.success('OTP sent successfully!')
    },
    onError: (error: any) => {
      toast.error(handleApiError(error))
    },
  })
}

export function useVerifyOTP() {
  return useMutation({
    mutationFn: async ({ phone, otp }: { phone: string; otp: string }) => {
      const { data } = await publicApi.post(API_ENDPOINTS.AUTH.VERIFY_OTP, { phone, otp })
      return data
    },
    onSuccess: () => {
      toast.success('Phone verified!')
    },
    onError: (error: any) => {
      toast.error(handleApiError(error))
    },
  })
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: async (email: string) => {
      const { data } = await publicApi.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email })
      return data
    },
    onSuccess: () => {
      toast.success('Password reset link sent to your email!')
    },
    onError: (error: any) => {
      toast.error(handleApiError(error))
    },
  })
}

export function useResetPassword() {
  const router = useRouter()

  return useMutation({
    mutationFn: async ({ token, newPassword }: any) => {
      const { data } = await publicApi.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, { token, newPassword })
      return data
    },
    onSuccess: () => {
      toast.success('Password reset successful! Please login.')
      router.push('/auth/login')
    },
    onError: (error: any) => {
      toast.error(handleApiError(error))
    },
  })
}
