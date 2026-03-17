'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Edit2, ShieldCheck, MapPin, Search, Loader2 } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import toast from 'react-hot-toast'

import { RootState } from '@/store'
import { clearCart } from '@/store/slices/cartSlice'
import { formatPrice } from '@/lib/utils'
import { useCurrentUser } from '@/hooks/useAuth'
import { useCreateOrder } from '@/hooks/useOrders'
import { useRazorpayPayment } from '@/hooks/usePayment'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { PaymentMethod } from '@/types/enums'

const addressSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Invalid phone number"),
  pincode: z.string().regex(/^\d{6}$/, "Invalid pincode"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  addressLine1: z.string().min(5, "Address Line 1 is required"),
  addressLine2: z.string().optional(),
  type: z.enum(['home', 'work', 'other'])
})

type AddressFormValues = z.infer<typeof addressSchema>

export default function CheckoutPage() {
  const router = useRouter()
  const dispatch = useDispatch()
  const { data: user } = useCurrentUser()
  const { items } = useSelector((state: RootState) => state.cart)
  
  const [activeStep, setActiveStep] = useState(1)
  const [address, setAddress] = useState<AddressFormValues | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.COD)
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null)
  const [orderNumber, setOrderNumber] = useState<string | null>(null)

  const createOrderMutation = useCreateOrder()
  const { initiatePayment, isLoading: isPaying } = useRazorpayPayment()

  const { register, handleSubmit, formState: { errors } } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: { type: 'home' }
  })

  // Prevent accessing checkout if cart is empty
  React.useEffect(() => {
    if (items.length === 0 && activeStep < 4) {
      toast.error('Your cart is empty')
      router.push('/cart')
    }
  }, [items, router, activeStep])

  // Move directly to step 2 if logged in
  React.useEffect(() => {
    if (user && activeStep === 1) {
      setActiveStep(2)
    }
  }, [user, activeStep])

  const totalOriginalPrice = items.reduce((acc, item) => acc + (item.product.originalPrice * item.quantity), 0)
  const totalPrice = items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0)
  const deliveryCharges = totalPrice > 499 ? 0 : 40
  const finalTotal = totalPrice + deliveryCharges

  const onAddressSubmit = (data: AddressFormValues) => {
    setAddress(data)
    setActiveStep(3)
  }

  const handleCreateOrder = async (method: PaymentMethod) => {
    const orderItems = items.map(item => ({
      productId: item.product.id,
      quantity: item.quantity
    }));

    try {
      const order = await createOrderMutation.mutateAsync({
        items: orderItems,
        addressId: 'LOCAL_FORM_SUBMISSION', // In a real app, user selects from saved addresses or we save this first
        paymentMethod: method,
        addressSnapshot: address, // Custom handling for new address
      });

      setCreatedOrderId(order.id);
      setOrderNumber(order.orderNumber);

      if (method === PaymentMethod.COD) {
        dispatch(clearCart());
        setActiveStep(5); // Success step
      } else {
        setActiveStep(4); // Payment step
      }
    } catch (err: any) {
      // Error handled by mutation hook
    }
  }

  const handlePay = async () => {
    if (!createdOrderId || !orderNumber) return;
    await initiatePayment(createdOrderId, finalTotal, orderNumber);
  }

  if (activeStep === 5) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-sm shadow-md text-center max-w-sm w-full">
          <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center text-white mx-auto mb-4">
            <Check size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h2>
          <p className="text-gray-500 mb-6 font-medium">Order Number: #{orderNumber}</p>
          <Button onClick={() => router.push('/orders')} className="w-full bg-primary font-bold">VIEW ORDERS</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 flex flex-col lg:flex-row gap-6">
        
        {/* Main Checkout Flow */}
        <div className="flex-1 flex flex-col gap-4">
          
          {/* STEP 1: LOGIN */}
          <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
            <div className={`p-4 flex items-center justify-between ${activeStep === 1 ? 'bg-primary text-white' : 'bg-white text-gray-900 border-b border-gray-100'}`}>
              <div className="flex items-center gap-4">
                <span className={`w-6 h-6 rounded-sm text-xs font-bold flex items-center justify-center ${activeStep === 1 ? 'bg-white text-primary' : 'bg-gray-100 text-primary'}`}>
                  1
                </span>
                <span className="font-bold uppercase tracking-wider">Login / Sign Up</span>
              </div>
              {activeStep > 1 && user && (
                <div className="text-sm font-semibold flex flex-col text-right">
                   <span>{user.firstName} {user.lastName}</span>
                   <span className="text-gray-500 text-xs">{user.email || user.phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* STEP 2: DELIVERY ADDRESS */}
          <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
            <div className={`p-4 flex items-center justify-between ${activeStep === 2 ? 'bg-primary text-white' : 'bg-white text-gray-900 border-b border-gray-100'}`}>
              <div className="flex items-center gap-4">
                <span className={`w-6 h-6 rounded-sm text-xs font-bold flex items-center justify-center ${activeStep === 2 ? 'bg-white text-primary' : 'bg-gray-100 text-primary'}`}>
                  2
                </span>
                <span className="font-bold uppercase tracking-wider">Delivery Address</span>
              </div>
              {activeStep > 2 && address && (
                 <button className="text-primary text-sm font-bold hover:underline" onClick={() => setActiveStep(2)}>
                   CHANGE
                 </button>
              )}
            </div>
            
            <AnimatePresence>
              {activeStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-6 bg-blue-50/30"
                >
                  <form onSubmit={handleSubmit(onAddressSubmit)} className="bg-white p-6 border border-gray-200 rounded-sm">
                    <div className="flex items-center gap-2 text-primary font-bold mb-6">
                      <MapPin size={20} />
                      <h3 className="uppercase tracking-wide">Enter delivery details</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <Input placeholder="Full Name" {...register('fullName')} className="bg-white" />
                        {errors.fullName && <p className="text-error text-xs mt-1">{errors.fullName.message}</p>}
                      </div>
                      <div>
                        <Input placeholder="10-digit mobile number" {...register('phone')} className="bg-white" />
                        {errors.phone && <p className="text-error text-xs mt-1">{errors.phone.message}</p>}
                      </div>
                      <div>
                        <Input placeholder="Pincode" {...register('pincode')} className="bg-white" />
                        {errors.pincode && <p className="text-error text-xs mt-1">{errors.pincode.message}</p>}
                      </div>
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <Input placeholder="City" {...register('city')} className="bg-white" />
                          {errors.city && <p className="text-error text-xs mt-1">{errors.city.message}</p>}
                        </div>
                        <div className="flex-1">
                          <Input placeholder="State" {...register('state')} className="bg-white" />
                          {errors.state && <p className="text-error text-xs mt-1">{errors.state.message}</p>}
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <textarea 
                          placeholder="Address (House No, Building, Street, Area)" 
                          {...register('addressLine1')}
                          className="w-full border border-gray-300 rounded-sm p-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary min-h-[80px]"
                        />
                        {errors.addressLine1 && <p className="text-error text-xs mt-1">{errors.addressLine1.message}</p>}
                      </div>
                      <div className="md:col-span-2">
                        <Input placeholder="Landmark (Optional)" {...register('addressLine2')} className="bg-white" />
                      </div>
                    </div>

                    <div className="mb-6">
                      <p className="text-xs text-gray-500 mb-2 font-bold uppercase tracking-tight">Address Type</p>
                      <div className="flex gap-6">
                        {['home', 'work', 'other'].map(type => (
                          <label key={type} className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" value={type} {...register('type')} className="text-primary focus:ring-primary" />
                            <span className="text-sm font-medium capitalize">{type}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <Button type="submit" className="w-full md:w-auto h-12 px-8 bg-accent hover:bg-orange-600 text-white font-bold rounded-sm">
                      DELIVER HERE
                    </Button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {activeStep > 2 && address && (
              <div className="p-4 px-6 md:px-12 bg-white">
                <p className="font-bold text-gray-900 mb-1">
                  {address.fullName} <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded uppercase ml-2">{address.type}</span>
                </p>
                <p className="text-gray-600 text-sm">
                  {address.addressLine1}, {address.city}, {address.state} - {address.pincode}
                </p>
                <p className="text-gray-900 text-sm font-semibold mt-1">{address.phone}</p>
              </div>
            )}
          </div>

          {/* STEP 3: ORDER SUMMARY */}
          <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
             <div className={`p-4 flex items-center justify-between ${activeStep === 3 ? 'bg-primary text-white' : 'bg-white text-gray-900 border-b border-gray-100'}`}>
              <div className="flex items-center gap-4">
                <span className={`w-6 h-6 rounded-sm text-xs font-bold flex items-center justify-center ${activeStep === 3 ? 'bg-white text-primary' : 'bg-gray-100 text-primary'}`}>
                  3
                </span>
                <span className="font-bold uppercase tracking-wider">Order Summary</span>
              </div>
            </div>

            <AnimatePresence>
              {activeStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-white"
                >
                  <div className="p-4 md:p-6 divide-y divide-gray-100">
                    {items.map((item) => (
                      <div key={item.product.id} className="py-4 flex gap-4">
                        <div className="w-20 h-20 relative bg-gray-50 border border-gray-100 shrink-0">
                          <Image src={item.product.images[0]} alt={item.product.name} fill className="object-contain p-1" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-bold text-gray-900 line-clamp-1">{item.product.name}</h4>
                          <div className="text-xs text-gray-500 mt-1 mb-2">Seller: TownBolt | Qty: {item.quantity}</div>
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-gray-900">{formatPrice(item.product.price * item.quantity)}</span>
                            {item.product.discount > 0 && (
                              <span className="text-sm text-gray-500 line-through">{formatPrice(item.product.originalPrice * item.quantity)}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 bg-gray-50 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-xs text-gray-500 max-w-sm">
                      Order confirmation email will be sent to <span className="font-bold">{user?.email || 'your email'}</span>. 
                      By continuing, you agree to TownBolt's Terms of Use.
                    </div>
                    <div className="flex gap-4 w-full md:w-auto">
                      <Button 
                        onClick={() => handleCreateOrder(PaymentMethod.COD)}
                        disabled={createOrderMutation.isPending}
                        className="flex-1 bg-white border border-gray-200 text-gray-900 hover:bg-gray-50 font-bold px-8 h-12"
                      >
                        {createOrderMutation.isPending ? <Loader2 className="animate-spin" /> : 'COD'}
                      </Button>
                      <Button 
                        onClick={() => handleCreateOrder(PaymentMethod.RAZORPAY)}
                        disabled={createOrderMutation.isPending}
                        className="flex-1 bg-accent hover:bg-orange-600 text-white font-bold px-8 h-12"
                      >
                         {createOrderMutation.isPending ? <Loader2 className="animate-spin" /> : 'PAY NOW'}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* STEP 4: PAYMENT OPTIONS (FOR NON-COD) */}
          <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
            <div className={`p-4 flex items-center justify-between ${activeStep === 4 ? 'bg-primary text-white' : 'bg-gray-50 text-gray-400'}`}>
              <div className="flex items-center gap-4">
                <span className={`w-6 h-6 rounded-sm text-xs font-bold flex items-center justify-center ${activeStep === 4 ? 'bg-white text-primary' : 'bg-gray-200'}`}>
                  4
                </span>
                <span className="font-bold uppercase tracking-wider">Payment Details</span>
              </div>
            </div>

            <AnimatePresence>
              {activeStep === 4 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-8 text-center"
                >
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Order Created!</h3>
                    <p className="text-gray-500">Order ID: #{orderNumber}</p>
                    <p className="text-2xl font-black text-primary mt-4">{formatPrice(finalTotal)}</p>
                  </div>
                  
                  <Button 
                    onClick={handlePay} 
                    disabled={isPaying}
                    className="w-full max-w-xs h-14 bg-[#2874F0] hover:bg-blue-700 text-white font-black text-lg shadow-lg"
                  >
                    {isPaying ? <Loader2 className="animate-spin mr-2" /> : null}
                    PAY SECURELY WITH RAZORPAY
                  </Button>
                  
                  <div className="mt-6 flex items-center justify-center gap-4 opacity-50 grayscale">
                    <Image src="/images/visa.png" alt="Visa" width={40} height={40} className="object-contain" />
                    <Image src="/images/mastercard.png" alt="Mastercard" width={40} height={40} className="object-contain" />
                    <Image src="/images/upi.png" alt="UPI" width={40} height={40} className="object-contain" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

        {/* Right Sidebar: Summary */}
        <div className="lg:w-[380px] shrink-0">
          <div className="bg-white rounded-sm shadow-sm border border-gray-100 sticky top-24">
            <div className="p-4 border-b border-gray-100">
              <h2 className="text-gray-500 font-bold uppercase tracking-wider text-sm">Price Details</h2>
            </div>
            <div className="p-4 flex flex-col gap-4 text-sm font-medium">
              <div className="flex justify-between text-gray-800">
                <span>Price ({items.reduce((acc, i) => acc + i.quantity, 0)} items)</span>
                <span>{formatPrice(totalOriginalPrice)}</span>
              </div>
              <div className="flex justify-between text-gray-800">
                <span>Discount</span>
                <span className="text-success">- {formatPrice(totalOriginalPrice - totalPrice)}</span>
              </div>
              <div className="flex justify-between text-gray-800">
                <span>Delivery Charges</span>
                <span className={deliveryCharges === 0 ? "text-success" : "text-gray-800"}>
                  {deliveryCharges === 0 ? 'FREE' : formatPrice(deliveryCharges)}
                </span>
              </div>
              <div className="border-t border-dashed border-gray-200 pt-4 mt-2 flex justify-between items-center text-lg font-bold text-gray-900">
                <span>Total Amount</span>
                <span>{formatPrice(finalTotal)}</span>
              </div>
            </div>
            <div className="p-4 bg-success/5 border-t border-gray-100">
              <p className="text-success font-bold text-sm">
                You will save {formatPrice(totalOriginalPrice - totalPrice)} on this order
              </p>
            </div>
            <div className="p-4 flex items-start gap-3 text-[10px] text-gray-400 leading-relaxed uppercase tracking-widest font-bold grayscale opacity-70">
               <ShieldCheck size={28} className="shrink-0" />
               <p>Safe and Secure Payments. Easy returns. 100% Authentic products.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
