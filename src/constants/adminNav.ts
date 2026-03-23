import { 
  LayoutDashboard, 
  Package, 
  Tag, 
  Layers, 
  ShoppingBag, 
  Users, 
  BarChart3, 
  Settings, 
  UserCircle, 
  Star, 
  Clock, 
  Truck, 
  BanknoteArrowUpIcon 
} from 'lucide-react'

export interface NavItem {
  id: string
  label: string
  icon: any
  href: string
  badge?: number
  subItems?: { label: string; href: string }[]
}

export interface NavSection {
  label: string
  items: NavItem[]
}

export const NAV_SECTIONS: NavSection[] = [
  {
    label: 'MAIN',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
    ]
  },
  {
    label: 'CATALOGUE',
    items: [
      { 
        id: 'products', 
        label: 'Products', 
        icon: Package, 
        href: '/admin/products',
        subItems: [
          { label: 'All Products', href: '/admin/products' },
          { label: 'Add New', href: '/admin/products/new' },
          { label: 'Low Stock', href: '/admin/products?filter=low-stock' },
        ]
      },
      { 
        id: 'categories', 
        label: 'Categories', 
        icon: Tag, 
        href: '/admin/categories',
        subItems: [
          { label: 'All Categories', href: '/admin/categories' },
          { label: 'Add Category', href: '/admin/categories/new' },
        ]
      },
      { id: 'subcategories', label: 'Sub-categories', icon: Layers, href: '/admin/subcategories' },
    ]
  },
  {
    label: 'ORDERS',
    items: [
      { id: 'all-orders', label: 'All Orders', icon: ShoppingBag, href: '/admin/orders' },
      { id: 'pending', label: 'Pending', icon: Clock, href: '/admin/orders?status=pending', badge: 5 },
      { id: 'shipping', label: 'Shipping', icon: Truck, href: '/admin/orders?status=shipped' },
    ]
  },
  {
    label: 'CUSTOMERS',
    items: [
      { id: 'users', label: 'All Users', icon: Users, href: '/admin/users' },
      { id: 'reviews', label: 'Reviews', icon: Star, href: '/admin/reviews' },
    ]
  },
  {
    label: 'REPORTS',
    items: [
      { id: 'analytics', label: 'Analytics', icon: BarChart3, href: '/admin/analytics' },
    ]
  },
  {
    label: 'SETTINGS',
    items: [
      { id: 'settings', label: 'Shop Settings', icon: Settings, href: '/admin/settings' },
      { id: 'profile', label: 'My Profile', icon: UserCircle, href: '/admin/profile' },
      { id: 'banners', label: 'Banners', icon: BanknoteArrowUpIcon, href: '/admin/banners' },
    ]
  }
]
