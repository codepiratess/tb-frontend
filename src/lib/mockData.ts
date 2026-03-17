export const mockDashboardStats = {
  totalRevenue: 482350,
  revenueGrowth: 12.5,
  totalOrders: 1284,
  ordersToday: 24,
  ordersGrowth: 8.2,
  totalProducts: 247,
  lowStockProducts: 12,
  productsGrowth: 2.1,
  totalCustomers: 3847,
  customersToday: 8,
  customersGrowth: 18.7,
}

export const mockRevenueData = [
  { name: 'Mon', revenue: 45000 },
  { name: 'Tue', revenue: 52000 },
  { name: 'Wed', revenue: 48000 },
  { name: 'Thu', revenue: 61000 },
  { name: 'Fri', revenue: 55000 },
  { name: 'Sat', revenue: 67000 },
  { name: 'Sun', revenue: 72000 },
]

export const mockCategoryData = [
  { name: 'Electronics', value: 45 },
  { name: 'Fashion', value: 25 },
  { name: 'Home', value: 20 },
  { name: 'Beauty', value: 10 },
]

export const mockSalesByCategory = mockCategoryData

export const mockRecentOrders = [
  { id: '#TB847291', customer: 'Aadesh Kumar', amount: 4299, status: 'delivered', date: '2 hours ago' },
  { id: '#TB847292', customer: 'Suresh Raina', amount: 1299, status: 'pending', date: '3 hours ago' },
  { id: '#TB847293', customer: 'Hardik Pandya', amount: 8499, status: 'shipped', date: '5 hours ago' },
  { id: '#TB847294', customer: 'Rohit Sharma', amount: 2599, status: 'confirmed', date: '6 hours ago' },
  { id: '#TB847295', customer: 'Virat Kohli', amount: 15499, status: 'delivered', date: '8 hours ago' },
]

export const mockTopProducts = [
  { id: 1, name: 'iPhone 15 Pro', sales: 124, revenue: 1488000, image: 'https://placehold.co/48x48?text=iPhone' },
  { id: 2, name: 'MacBook Air M2', sales: 86, revenue: 1032000, image: 'https://placehold.co/48x48?text=Mac' },
  { id: 3, name: 'AirPods Pro 2', sales: 215, revenue: 428000, image: 'https://placehold.co/48x48?text=AirPods' },
  { id: 4, name: 'Apple Watch S9', sales: 98, revenue: 392000, image: 'https://placehold.co/48x48?text=Watch' },
  { id: 5, name: 'iPad Air M1', sales: 54, revenue: 324000, image: 'https://placehold.co/48x48?text=iPad' },
]

export const mockLowStockProducts = [
  { id: 1, name: 'Sony WH-1000XM5', stock: 3, image: 'https://placehold.co/48x48?text=Sony' },
  { id: 2, name: 'Samsung S23 Ultra', stock: 5, image: 'https://placehold.co/48x48?text=Samsung' },
  { id: 3, name: 'Nintendo Switch', stock: 2, image: 'https://placehold.co/48x48?text=Switch' },
  { id: 4, name: 'Logitech MX Master 3S', stock: 8, image: 'https://placehold.co/48x48?text=Logi' },
  { id: 5, name: 'Dell XPS 13', stock: 4, image: 'https://placehold.co/48x48?text=Dell' },
]

export const mockProducts = Array.from({ length: 10 }).map((_, i) => ({
  id: `prod-${i + 1}`,
  name: `Premium Product ${i + 1}`,
  slug: `premium-product-${i + 1}`,
  sku: `TB-PRD-00${i + 1}`,
  price: 2499 + i * 500,
  originalPrice: 3999 + i * 500,
  stock: 50 + i * 5,
  categoryId: 'cat-1',
  category: { name: 'Electronics', slug: 'electronics' },
  status: 'active',
  isFeatured: i % 3 === 0,
  image: 'https://placehold.co/100x100?text=Product'
}))

export const mockCategories = [
  { id: 'cat-1', name: 'Electronics', slug: 'electronics', productsCount: 124, status: 'active', sortOrder: 1 },
  { id: 'cat-2', name: 'Fashion', slug: 'fashion', productsCount: 86, status: 'active', sortOrder: 2 },
  { id: 'cat-3', name: 'Home & Living', slug: 'home-living', productsCount: 215, status: 'active', sortOrder: 3 },
  { id: 'cat-4', name: 'Beauty', slug: 'beauty', productsCount: 98, status: 'active', sortOrder: 4 },
  { id: 'cat-5', name: 'Books', slug: 'books', productsCount: 54, status: 'inactive', sortOrder: 5 },
]

export const mockSubcategories = [
  { id: 'sub-1', name: 'Smartphones', slug: 'smartphones', categoryId: 'cat-1', productsCount: 45, status: 'active' },
  { id: 'sub-2', name: 'Laptops', slug: 'laptops', categoryId: 'cat-1', productsCount: 32, status: 'active' },
  { id: 'sub-3', name: 'Men Shoes', slug: 'men-shoes', categoryId: 'cat-2', productsCount: 28, status: 'active' },
]

export const mockOrders = Array.from({ length: 10 }).map((_, i) => ({
  id: `#TB84729${i}`,
  customerName: `Customer ${i + 1}`,
  email: `customer${i + 1}@example.com`,
  phone: '9876543210',
  totalAmount: 4299 + i * 1000,
  status: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'][i % 5],
  paymentStatus: ['paid', 'pending', 'failed'][i % 3],
  date: '2 hours ago',
  items: 3,
}))

export const mockCustomers = Array.from({ length: 10 }).map((_, i) => ({
  id: `cust-${i + 1}`,
  name: `Premium Customer ${i + 1}`,
  email: `customer${i + 1}@example.com`,
  phone: '9876543210',
  joinedDate: 'Jan 12, 2024',
  orders: 12 + i,
  spent: 45000 + i * 5000,
  status: 'active',
}))

export const mockOrdersByHour = [
  { hour: '00:00', count: 4 },
  { hour: '02:00', count: 2 },
  { hour: '04:00', count: 1 },
  { hour: '06:00', count: 5 },
  { hour: '08:00', count: 12 },
  { hour: '10:00', count: 24 },
  { hour: '12:00', count: 32 },
  { hour: '14:00', count: 28 },
  { hour: '16:00', count: 35 },
  { hour: '18:00', count: 48 },
  { hour: '20:00', count: 42 },
  { hour: '22:00', count: 18 },
]
