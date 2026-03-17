'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  ChevronRight, Tag, Truck, ShieldCheck, MapPin, 
  Minus, Plus, ShoppingCart, Zap, Heart, Share2, 
  RotateCcw, Shield
} from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { ProductImageGallery } from '../../../../components/product/ProductImageGallery'
import { ProductCarousel } from '../../../../components/product/ProductCarousel'
import { RatingStars } from '../../../../components/ui/RatingStars'
import { Button } from '../../../../components/ui/Button'
import { formatPrice, calculateDiscount } from '../../../../lib/utils'
import { CATEGORY_LIST } from '../../../../constants'
import { addToCart } from '../../../../store/slices/cartSlice'
import { addToWishlist, removeFromWishlist } from '../../../../store/slices/wishlistSlice'
import { selectIsInWishlist } from '../../../../store/selectors/wishlistSelectors'
import { mockProducts } from '../../../../lib/mockData'

export default function ProductDetailClient({ slug }: { slug: string }) {
  const router = useRouter()
  const dispatch = useDispatch()
  
  // Mock fetch
  const product = mockProducts.find(p => p.slug === slug)
  const similarProducts = mockProducts.filter(p => p.category === product?.category && p.id !== product?.id).slice(0, 8)
  
  const [quantity, setQuantity] = useState(1)
  const [pincode, setPincode] = useState('')
  const [deliveryStatus, setDeliveryStatus] = useState<null | { ok: boolean, msg: string }>(null)
  
  const isInWishlist = useSelector(product ? selectIsInWishlist(product.id) : () => false)

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <Link href="/products" className="text-primary hover:underline">
          Browse all products
        </Link>
      </div>
    )
  }

  const categoryName = product.category.name || CATEGORY_LIST.find(c => c.slug === product.category.slug)?.name

  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity }))
    toast.success('Added to cart!', { icon: <ShoppingCart className="w-5 h-5 text-primary" /> })
  }

  const handleBuyNow = () => {
    handleAddToCart()
    router.push('/checkout')
  }

  const handleWishlistToggle = () => {
    if (isInWishlist) {
      dispatch(removeFromWishlist(product.id))
    } else {
      dispatch(addToWishlist(product))
      toast.success('Added to wishlist!', { icon: <Heart className="w-5 h-5 text-accent fill-accent" /> })
    }
  }

  const checkDelivery = () => {
    if (pincode.length !== 6) {
      setDeliveryStatus({ ok: false, msg: 'Invalid Pincode' })
      return
    }
    setDeliveryStatus({ ok: true, msg: 'Delivery by tomorrow, 10 PM' })
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-gray-50 min-h-screen pb-12"
    >
      <div className="container mx-auto px-4 py-4 md:py-6">
        
        {/* Top Section */}
        <div className="bg-white rounded-sm shadow-sm border border-gray-100 lg:flex items-stretch overflow-hidden">
          
          {/* Left: Images */}
          <div className="w-full lg:w-[40%] xl:w-[45%] p-4 lg:p-6 lg:border-r border-gray-100 flex flex-col">
            <div className="flex-1 top-24">
              <ProductImageGallery images={product.images} productName={product.name} />
              
              {/* Action Buttons (Desktop placement, but full width layout logic) */}
              <div className="mt-8 flex gap-4 hidden lg:flex">
                <Button 
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 h-14 bg-accent hover:bg-orange-600 text-white font-bold text-lg rounded-sm gap-2"
                >
                  <ShoppingCart size={20} /> ADD TO CART
                </Button>
                <Button 
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                  className="flex-1 h-14 bg-primary hover:bg-primary-dark text-white font-bold text-lg rounded-sm gap-2"
                >
                  <Zap size={20} /> BUY NOW
                </Button>
              </div>
            </div>
          </div>

          {/* Right: Details */}
          <div className="w-full lg:w-[60%] xl:w-[55%] p-4 lg:p-8 flex flex-col">
            
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-xs text-text-secondary mb-3">
              <Link href="/" className="hover:text-primary">Home</Link>
              <ChevronRight size={12} />
              <Link href={`/category/${product.category}`} className="hover:text-primary">{categoryName}</Link>
              <ChevronRight size={12} />
              <span className="text-text-primary line-clamp-1">{product.name}</span>
            </div>

            {/* Title & Rating */}
            <h1 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1.5 bg-success text-white px-2 py-0.5 rounded-sm text-xs font-bold">
                {product.rating} <Star size={10} className="fill-white" />
              </div>
              <span className="text-sm text-text-secondary font-medium hover:text-primary cursor-pointer transition-colors">
                {product.reviewCount} Ratings & {Math.floor(product.reviewCount / 3)} Reviews
              </span>
            </div>

            {/* Price section */}
            <div className="mb-6 flex flex-col gap-1">
              <span className="text-success font-bold text-sm">Special price</span>
              <div className="flex items-end gap-3 flex-wrap">
                <span className="text-3xl font-bold text-gray-900">{formatPrice(product.price)}</span>
                {product.discount > 0 && (
                  <>
                    <span className="text-base text-gray-500 line-through mb-1">{formatPrice(product.originalPrice)}</span>
                    <span className="text-base text-success font-bold mb-1">{product.discount}% off</span>
                  </>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-1">Inclusive of all taxes</p>
            </div>

             {/* Quantity and Wishlist/Share actions */}
            <div className="flex items-center gap-6 mb-8 border-b border-gray-100 pb-6">
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium text-gray-500">Quantity</span>
                <div className="flex items-center gap-4 text-gray-900">
                  <div className="flex items-center divide-x border border-gray-300 rounded-sm overflow-hidden">
                    <button 
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      disabled={quantity <= 1 || product.stock === 0}
                      className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 transition-colors bg-white font-bold"
                    >
                      <Minus size={16} />
                    </button>
                    <div className="w-12 h-10 flex items-center justify-center font-bold bg-gray-50">
                      {quantity}
                    </div>
                    <button 
                      onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                      disabled={quantity >= product.stock || product.stock === 0}
                      className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 transition-colors bg-white font-bold"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium text-gray-500">&nbsp;</span>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={handleWishlistToggle}
                    className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors"
                    title="Wishlist"
                  >
                    <Heart size={18} className={isInWishlist ? "fill-accent text-accent" : ""} />
                  </button>
                  <button 
                    className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors"
                    title="Share"
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      toast.success("Link copied to clipboard!")
                    }}
                  >
                    <Share2 size={18} />
                  </button>
                </div>
              </div>

              {product.stock > 0 && product.stock <= 10 && (
                <div className="ml-auto text-accent text-sm font-bold flex items-center mt-6">
                  Only {product.stock} left in stock!
                </div>
              )}
              {product.stock === 0 && (
                <div className="ml-auto text-error text-base font-bold flex items-center mt-6 uppercase">
                  Out of Stock
                </div>
              )}
            </div>

            {/* Mobile Action Buttons (sticky at bottom on real mobile device usually, here placed inline for simplicity) */}
            <div className="flex gap-3 mb-8 lg:hidden">
              <Button 
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 h-12 bg-white text-gray-900 border border-gray-300 font-bold rounded-sm gap-2"
              >
                ADD TO CART
              </Button>
              <Button 
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="flex-1 h-12 bg-primary hover:bg-primary-dark text-white font-bold rounded-sm gap-2 shadow-sm"
              >
                BUY NOW
              </Button>
            </div>

            {/* Offers section */}
            <div className="mb-6">
              <span className="text-base font-semibold text-gray-900 mb-3 block">Available offers</span>
              <ul className="space-y-3 text-sm">
                <li className="flex gap-2 items-start">
                  <Tag size={16} className="text-success mt-0.5 shrink-0" />
                  <span className="text-gray-700"><strong className="font-semibold text-gray-900">Bank Offer:</strong> 10% instant discount on HDFC Bank Credit Cards, up to ₹1000 on orders of ₹5,000 and above <span className="text-primary cursor-pointer hover:underline font-medium ml-1">T&C</span></span>
                </li>
                <li className="flex gap-2 items-start">
                  <Tag size={16} className="text-success mt-0.5 shrink-0" />
                  <span className="text-gray-700"><strong className="font-semibold text-gray-900">Bank Offer:</strong> 5% Cashback on TownBolt Axis Bank Card <span className="text-primary cursor-pointer hover:underline font-medium ml-1">T&C</span></span>
                </li>
                <li className="flex gap-2 items-start">
                  <Tag size={16} className="text-success mt-0.5 shrink-0" />
                  <span className="text-gray-700"><strong className="font-semibold text-gray-900">Special Price:</strong> Get extra 15% off (price inclusive of cashback/coupon) <span className="text-primary cursor-pointer hover:underline font-medium ml-1">T&C</span></span>
                </li>
              </ul>
            </div>

            {/* Delivery & Pincode */}
            <div className="flex gap-4 mb-6 pt-6 border-t border-gray-100 flex-col sm:flex-row text-sm">
              <div className="w-[110px] text-gray-500 font-medium shrink-0 pt-2">Delivery</div>
              <div className="flex-1">
                <div className="flex items-center border-b-2 border-primary w-fit pr-8 pb-1 mb-2 relative">
                  <MapPin size={16} className="text-primary mr-2" />
                  <input 
                    type="text" 
                    placeholder="Enter Delivery Pincode" 
                    className="outline-none text-sm font-medium w-[160px] bg-transparent"
                    maxLength={6}
                    value={pincode}
                    onChange={e => setPincode(e.target.value.replace(/\D/g, ''))}
                  />
                  <button 
                    onClick={checkDelivery}
                    className="absolute right-0 text-primary font-bold text-xs"
                  >
                    Check
                  </button>
                </div>
                {deliveryStatus && (
                  <div className={`text-xs font-medium mt-1 ${deliveryStatus.ok ? 'text-success' : 'text-error'}`}>
                    {deliveryStatus.msg}
                  </div>
                )}
                {!deliveryStatus && <div className="text-xs text-text-secondary mt-1">Please enter PIN code to check delivery time & Pay on Delivery Availability</div>}
                
                <div className="mt-4 flex flex-col gap-3">
                  <div className="flex items-start gap-3">
                    <Truck size={20} className="text-text-secondary" />
                    <div>
                      <p className="font-medium text-gray-900">Free Delivery</p>
                      <p className="text-xs text-gray-500">If ordered within next 2 hrs</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <RotateCcw size={20} className="text-text-secondary" />
                    <div>
                      <p className="font-medium text-gray-900">7 Days Replacement Policy</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield size={20} className="text-text-secondary" />
                    <div>
                      <p className="font-medium text-gray-900">GST invoice available</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Highlights */}
            <div className="flex gap-4 mb-6 pt-6 border-t border-gray-100 flex-col sm:flex-row text-sm">
              <div className="w-[110px] text-gray-500 font-medium shrink-0">Highlights</div>
              <div className="flex-1">
                <ul className="list-disc pl-5 space-y-1 text-gray-800">
                  <li>Premium Build Quality</li>
                  <li>1 Year Manufacturer Warranty</li>
                  <li>100% Original Product</li>
                  <li>Cash on Delivery available</li>
                </ul>
              </div>
            </div>

            {/* Description */}
            <div className="flex gap-4 pt-6 border-t border-gray-100 flex-col sm:flex-row text-sm">
              <div className="w-[110px] text-gray-500 font-medium shrink-0">Description</div>
              <div className="flex-1 text-gray-800 leading-relaxed">
                {product.description}
                {/* Mock long text to show expansion logic if needed, but simple for now */}
              </div>
            </div>
            
          </div>
        </div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <div className="mt-6">
            <ProductCarousel 
              title="Similar Products"
              products={similarProducts}
            />
          </div>
        )}
      </div>
    </motion.div>
  )
}

function Star({ className, size }: { className?: string, size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}
