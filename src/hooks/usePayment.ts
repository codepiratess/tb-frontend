import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import api from '@/lib/api';
import { API_ENDPOINTS } from '@/constants';
import { RootState } from '@/store';
import { handleApiError } from '@/lib/errorHandler';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export function useRazorpayPayment() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useSelector((state: RootState) => state.auth);
  
  const verifyMutation = useVerifyPayment();

  const loadScript = (src: string) => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const initiatePayment = async (orderId: string, amountRaw: number, orderNumber: string) => {
    try {
      // 1. Create Razorpay Order
      const { data: rzpData } = await api.post(API_ENDPOINTS.PAYMENTS.CREATE_ORDER, { orderId });
      
      const { razorpayOrderId, amount, currency, keyId } = rzpData;

      // 2. Load Razorpay Script
      const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
      if (!res) {
        toast.error('Razorpay SDK failed to load. Check your connection.');
        return;
      }

      // 3. Open Checkout
      const options = {
        key: keyId,
        amount: amount,
        currency: currency,
        name: 'TownBolt',
        description: `Order #${orderNumber}`,
        order_id: razorpayOrderId,
        prefill: {
          name: user?.firstName || '',
          email: user?.email || '',
          contact: '', // Phone from profile if available
        },
        theme: { color: '#2874F0' },
        handler: async (response: any) => {
          try {
            await verifyMutation.mutateAsync({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: orderId,
            });
            toast.success('Payment successful! 🎉');
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            router.push(`/orders/${orderId}`);
          } catch (err) {
            toast.error('Payment verification failed');
          }
        },
        modal: {
          ondismiss: () => {
            toast.error('Payment cancelled');
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error: any) {
      toast.error(handleApiError(error));
    }
  };

  return { initiatePayment, isLoading: verifyMutation.isPending };
}

export function useVerifyPayment() {
  return useMutation({
    mutationFn: async (dto: any) => {
      const { data } = await api.post(API_ENDPOINTS.PAYMENTS.VERIFY, dto);
      return data;
    },
  });
}
