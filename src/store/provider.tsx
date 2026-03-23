'use client'

import React, { ReactNode } from 'react'
import { Provider, useDispatch, useSelector } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from 'react-hot-toast'
import { SessionProvider } from 'next-auth/react'
import { store, persistor, RootState } from './index'
import { getQueryClient } from '../lib/queryClient'
import { useCurrentUser } from '@/hooks/useAuth'
import { setLoading } from './slices/authSlice'
import { useServerCart } from '@/hooks/useCart'
import { useServerWishlist } from '@/hooks/useWishlist'

function CartAndWishlistLoader() {
  const accessToken = useSelector((s: RootState) => s.auth.accessToken)
  
  // These hooks auto-fetch and sync to Redux when user is logged in
  useServerCart()
  useServerWishlist()
  
  return null
}

function AuthInitializer({ children }: { children: ReactNode }) {
  const dispatch = useDispatch()
  const { accessToken, loading } = useSelector((state: RootState) => state.auth)
  
  // Call hook to handle initial fetch
  useCurrentUser()

  // Fail-safe: if no token exists, we definitely aren't loading user data
  React.useEffect(() => {
    if (!accessToken && loading) {
      dispatch(setLoading(false))
    }
  }, [accessToken, loading, dispatch])

  return <>{children}</>
}

export default function AppProvider({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient()
  return (
    <SessionProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <QueryClientProvider client={queryClient}>
            <AuthInitializer>
              <CartAndWishlistLoader />
              {children}
            </AuthInitializer>
            <Toaster 
              position="top-right" 
              toastOptions={{
                className: 'text-sm font-medium',
                duration: 3000,
              }}
            />
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </PersistGate>
      </Provider>
    </SessionProvider>
  )
}
