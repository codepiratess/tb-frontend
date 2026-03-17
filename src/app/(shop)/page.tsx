import React from 'react'
import { Metadata } from 'next'
import { Truck, RotateCcw, Shield } from 'lucide-react'
import { HeroBanner } from '@/components/home/HeroBanner'
import { CategoryStrip } from '@/components/home/CategoryStrip'
import { DealOfTheDay } from '@/components/home/DealOfTheDay'
import { FeaturedSection } from '@/components/home/FeaturedSection'
import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { getQueryClient } from '@/lib/queryClient'
import { Input } from '@/components/ui/Input'
import { publicApi } from '@/lib/api'
import { API_ENDPOINTS } from '@/constants'

export const metadata: Metadata = {
  title: 'TownBolt - Online Shopping Site for Mobiles, Electronics, Furniture, Grocery, Lifestyle, Books & More',
  description: 'Shop Online for Electronics, Apparel, Computers, Books, DVDs & more at TownBolt.',
}

async function getCategories() {
  const { data } = await publicApi.get(API_ENDPOINTS.CATEGORIES.ALL);
  return data;
}

async function getFeaturedProducts() {
  const { data } = await publicApi.get(API_ENDPOINTS.PRODUCTS.FEATURED);
  return data;
}

async function getNewArrivals() {
  const { data } = await publicApi.get(API_ENDPOINTS.PRODUCTS.NEW_ARRIVALS);
  return data;
}

export default async function HomePage() {
  const queryClient = getQueryClient()

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ['categories'],
      queryFn: getCategories,
    }),
    queryClient.prefetchQuery({
      queryKey: ['products', 'featured'],
      queryFn: getFeaturedProducts,
    }),
    queryClient.prefetchQuery({
      queryKey: ['products', 'new-arrivals'],
      queryFn: getNewArrivals,
    })
  ])

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className="min-h-screen bg-gray-50 pb-16">
        
        <HeroBanner />
        <CategoryStrip />

        <div className="container mx-auto px-4 lg:px-6">
          <DealOfTheDay />
          
          <FeaturedSection 
            title="Featured Products"
            queryKey={['products', 'featured']}
            viewAllLink="/products?isFeatured=true"
          />

          {/* Value Proposition Banners */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4 my-10">
            <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-primary shrink-0">
                <Truck size={24} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Free Delivery</h4>
                <p className="text-sm text-gray-500">On orders above ₹499</p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-success shrink-0">
                <RotateCcw size={24} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Easy 30-day Returns</h4>
                <p className="text-sm text-gray-500">No questions asked</p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
                <Shield size={24} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Secure Payments</h4>
                <p className="text-sm text-gray-500">100% encrypted checkout</p>
              </div>
            </div>
          </section>

          <FeaturedSection 
            title="New Arrivals"
            queryKey={['products', 'new-arrivals']}
            viewAllLink="/products?isNewArrival=true"
          />

        </div>

        {/* Newsletter Strip */}
        <section className="w-full bg-gradient-to-r from-primary to-primary-dark py-12 mt-12 mb-0">
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-center gap-6">
            <div className="text-center md:text-left text-white">
              <h3 className="text-2xl font-bold mb-2">Get exclusive deals in your inbox</h3>
              <p className="text-white/80">Subscribe to our newsletter and save on your first order.</p>
            </div>
            <form className="flex w-full max-w-md">
              <Input
                type="email" 
                placeholder="Enter your email address" 
                className="flex-1 h-12 px-4 rounded-l-sm outline-none text-gray-900"
                required
              />
              <button 
                type="submit" 
                className="h-12 px-6 bg-accent text-white font-bold rounded-r-sm hover:bg-orange-600 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </section>

      </main>
    </HydrationBoundary>
  )
}
