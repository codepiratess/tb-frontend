export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGIN_PHONE: '/auth/login/phone',
    SEND_OTP: '/auth/send-otp',
    VERIFY_OTP: '/auth/verify-otp',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    CHANGE_PASSWORD: '/auth/change-password',
    ME: '/auth/me',
  },
  // Users
  USERS: {
    PROFILE: '/users/profile',
    PROFILE_IMAGE: '/users/profile/image',
    ADDRESSES: '/users/addresses',
    ADDRESS: (id: string) => `/users/addresses/${id}`,
    SET_DEFAULT_ADDRESS: (id: string) => `/users/addresses/${id}/set-default`,
    FCM_TOKEN: '/users/fcm-token',
    DELETE_ACCOUNT: '/users/account',
    ADMIN_ALL: '/users',
    ADMIN_USER: (id: string) => `/users/${id}`,
  },
  // Products
  PRODUCTS: {
    ALL: '/products',
    FEATURED: '/products/featured',
    NEW_ARRIVALS: '/products/new-arrivals',
    SEARCH: '/products/search',
    DETAIL: (slug: string) => `/products/${slug}`,
    TOGGLE_STATUS: (id: string) => `/products/${id}/toggle-status`,
    TOGGLE_FEATURED: (id: string) => `/products/${id}/toggle-featured`,
    UPDATE_STOCK: (id: string) => `/products/${id}/stock`,
    BULK_DELETE: '/products/bulk',
  },
  // Categories
  CATEGORIES: {
    ALL: '/categories',
    DETAIL: (slug: string) => `/categories/${slug}`,
    CREATE: '/categories',
    UPDATE: (id: string) => `/categories/${id}`,
    DELETE: (id: string) => `/categories/${id}`,
  },
  // Orders
  ORDERS: {
    CREATE: '/orders',
    MY_ORDERS: '/orders',
    DETAIL: (id: string) => `/orders/${id}`,
    CANCEL: (id: string) => `/orders/${id}/cancel`,
    ADMIN_ALL: '/orders/admin/all',
    ADMIN_DETAIL: (id: string) => `/orders/${id}/admin`,
    UPDATE_STATUS: (id: string) => `/orders/${id}/status`,
  },
  // Payments
  PAYMENTS: {
    CREATE_ORDER: '/payments/create-order',
    VERIFY: '/payments/verify',
    REFUND: (orderId: string) => `/payments/refund/${orderId}`,
  },
  // Reviews
  REVIEWS: {
    BY_PRODUCT: (productId: string) => `/reviews/product/${productId}`,
    CREATE: '/reviews',
    UPDATE: (id: string) => `/reviews/${id}`,
    HELPFUL: (id: string) => `/reviews/${id}/helpful`,
    ADMIN_PENDING: '/reviews/admin/pending',
    ADMIN_APPROVE: (id: string) => `/reviews/${id}/approve`,
  },
  // Wishlist
  WISHLIST: {
    GET: '/wishlist',
    ADD: (productId: string) => `/wishlist/${productId}`,
    REMOVE: (productId: string) => `/wishlist/${productId}`,
    CLEAR: '/wishlist',
    CHECK: (productId: string) => `/wishlist/check/${productId}`,
  },
  // Upload
  UPLOAD: {
    IMAGE: '/upload/image',
    IMAGES: '/upload/images',
    DELETE: '/upload',
  },
  // Analytics
  ANALYTICS: {
    DASHBOARD: '/analytics/dashboard-stats',
    REVENUE: '/analytics/revenue',
    SALES_BY_CATEGORY: '/analytics/sales-by-category',
    TOP_PRODUCTS: '/analytics/top-products',
    ORDERS_BY_HOUR: '/analytics/orders-by-hour',
    TOP_CUSTOMERS: '/analytics/top-customers',
    STATUS_BREAKDOWN: '/analytics/order-status-breakdown',
  },
} as const;

export const APP_CONFIG = {
  NAME: process.env.NEXT_PUBLIC_APP_NAME || 'TownBolt',
  URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  RAZORPAY_KEY: process.env.NEXT_PUBLIC_RAZORPAY_KEY || '',
  USE_MOCK: process.env.NEXT_PUBLIC_USE_MOCK === 'true',
};

export const CATEGORY_LIST = [
  { name: 'Mobiles', slug: 'mobiles' },
  { name: 'Electronics', slug: 'electronics' },
  { name: 'Clothing', slug: 'clothing' },
  { name: 'Footwear', slug: 'footwear' },
  { name: 'Home & Kitchen', slug: 'home-kitchen' },
  { name: 'Beauty', slug: 'beauty' },
  { name: 'Sports', slug: 'sports' },
  { name: 'Books', slug: 'books' },
  { name: 'Toys', slug: 'toys' },
  { name: 'Grocery', slug: 'grocery' },
  { name: 'Furniture', slug: 'furniture' },
  { name: 'Appliances', slug: 'appliances' },
];

export const ORDER_STATUS_COLORS = {
  pending: { bg: 'bg-yellow-50', text: 'text-yellow-600', border: 'border-yellow-200' },
  confirmed: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
  shipped: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
  delivered: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200' },
  cancelled: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200' },
};
