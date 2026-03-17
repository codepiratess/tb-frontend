export interface Category {
  id: string
  name: string
  slug: string
  image: string
  productCount: number
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  originalPrice: number
  discount: number
  images: string[]
  category: Category
  categoryId: string
  subCategory?: string
  stock: number
  rating: number
  reviewCount: number
  tags: string[]
  isFeatured: boolean
  isNewArrival: boolean
  freeDelivery: boolean
  isActive: boolean
  specifications?: { key: string; value: string }[]
  createdAt: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Address {
  id?: string
  fullName: string
  phone: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  pincode: string
  type: 'home' | 'work' | 'other'
  isDefault?: boolean
}

export interface OrderItem {
  id: string
  product: Product
  quantity: number
  unitPrice: number
  totalPrice: number
  productName: string
  productImage: string
  productSlug: string
}

export interface Order {
  id: string
  orderNumber: string
  userId: string
  items: OrderItem[]
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
  totalAmount: number
  subtotal: number
  discount: number
  deliveryCharge: number
  shippingAddress: any
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  paymentMethod: string
  createdAt: string
  updatedAt: string
}

export interface User {
  id: string
  firstName: string
  lastName?: string
  email: string
  phone?: string
  role: 'customer' | 'admin'
  profileImage?: string
  addresses: Address[]
  createdAt: string
}

export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
