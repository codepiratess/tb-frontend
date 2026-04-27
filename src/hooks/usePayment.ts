'use client'
import { useMutation, useQueryClient } 
  from '@tanstack/react-query'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import { clearCart } from 
  '@/store/slices/cartSlice'
import toast from 'react-hot-toast'

// Load Razorpay script dynamically
const loadRazorpayScript = (): 
  Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false)
      return
    }
    
    // Already loaded
    if ((window as any).Razorpay) {
      resolve(true)
      return
    }

    const script = document.createElement('script')
    script.src = 
      'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export const useRazorpayPayment = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const queryClient = useQueryClient()

  const initiatePayment = async (
    orderId: string,
    orderNumber: string,
    userInfo?: {
      name?: string
      email?: string
      phone?: string
    }
  ) => {
    // Step 1: Load Razorpay script
    const loaded = await loadRazorpayScript()
    if (!loaded) {
      toast.error(
        'Failed to load payment gateway. ' +
        'Please check your internet connection.'
      )
      return
    }

    // Step 2: Create Razorpay order on backend
    let razorpayData: any
    try {
      const res = await api.post(
        '/payments/create-order',
        { orderId }
      )
      razorpayData = res.data?.data
    } catch (error: any) {
      const msg = error.response?.data
        ?.message || 'Failed to initiate payment'
      toast.error(msg)
      return
    }

    // Step 3: Open Razorpay checkout modal
    const options = {
      key: process.env
        .NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: razorpayData.amount,
      currency: razorpayData.currency || 'INR',
      name: 'TownBolt',
      description: `Order #${orderNumber}`,
      order_id: razorpayData.razorpayOrderId,
      prefill: {
        name: razorpayData.prefill?.name 
          || userInfo?.name || '',
        email: userInfo?.email || '',
        contact: razorpayData.prefill?.contact 
          || userInfo?.phone || '',
      },
      theme: {
        color: '#2874F0',
      },
      modal: {
        ondismiss: () => {
          toast.error(
            'Payment cancelled. ' +
            'Your order is saved. ' +
            'You can pay later.'
          )
        },
      },
      handler: async (response: any) => {
        // This runs when payment is SUCCESS
        toast.loading('Verifying payment...')

        try {
          // Step 4: Verify payment on backend
          const verifyRes = await api.post(
            '/payments/verify',
            {
              razorpayOrderId: 
                response.razorpay_order_id,
              razorpayPaymentId: 
                response.razorpay_payment_id,
              razorpaySignature: 
                response.razorpay_signature,
              orderId: orderId,
            }
          )

          toast.dismiss()
          toast.success(
            '🎉 Payment successful!'
          )

          // Clear cart and redirect
          dispatch(clearCart())
          queryClient.invalidateQueries(
            { queryKey: ['orders'] }
          )
          queryClient.invalidateQueries(
            { queryKey: ['cart'] }
          )

          router.push(
            `/orders/${orderId}?success=true&payment=razorpay` 
          )
        } catch (verifyError: any) {
          toast.dismiss()
          toast.error(
            'Payment verification failed. ' +
            'Contact support with payment ID: ' +
            response.razorpay_payment_id
          )
        }
      },
    }

    const rzp = new (window as any)
      .Razorpay(options)

    rzp.on('payment.failed', (response: any) => {
      toast.error(
        `Payment failed: ${
          response.error.description
        }`
      )
    })

    rzp.open()
  }

  return { initiatePayment, isLoading: false }
}
