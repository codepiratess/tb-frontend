'use client'

import React from 'react'
import Link from 'next/link'
import { Zap, Instagram, Twitter, Facebook, Youtube, Send } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-[#172337] text-white pt-12 pb-6">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-1 group w-max">
              <span className="text-2xl font-bold italic tracking-tight text-white group-hover:opacity-90 transition-opacity">
                TownBolt
              </span>
              <div className="bg-white/10 p-1 rounded-full group-hover:bg-white/20 transition-colors">
                <Zap size={18} className="text-yellow-400 fill-yellow-400" />
              </div>
            </Link>
            <p className="text-gray-400 text-sm">
              Your neighbourhood store, online. Discover the best products from local sellers at unbeatable prices.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm text-gray-400 uppercase tracking-wider font-semibold mb-4">Categories</h3>
            <ul className="space-y-2 text-sm text-white">
              <li><Link href="/category/mobiles" className="hover:underline">Mobiles</Link></li>
              <li><Link href="/category/electronics" className="hover:underline">Electronics</Link></li>
              <li><Link href="/category/clothing" className="hover:underline">Clothing</Link></li>
              <li><Link href="/category/home-kitchen" className="hover:underline">Home & Kitchen</Link></li>
              <li><Link href="/category/beauty" className="hover:underline">Beauty</Link></li>
              <li><Link href="/category/sports" className="hover:underline">Sports</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm text-gray-400 uppercase tracking-wider font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2 text-sm text-white">
              <li><Link href="/orders" className="hover:underline">Track Your Order</Link></li>
              <li><Link href="/returns" className="hover:underline">Return Policy</Link></li>
              <li><Link href="/shipping" className="hover:underline">Shipping Info</Link></li>
              <li><Link href="/contact" className="hover:underline">Contact Us</Link></li>
              <li><Link href="/faq" className="hover:underline">FAQs</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm text-gray-400 uppercase tracking-wider font-semibold mb-4">Connect</h3>
            <p className="text-sm text-gray-400 mb-4">Subscribe to our newsletter for updates and exclusive offers!</p>
            <form className="flex mb-6" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter email address" 
                className="bg-white/10 border border-white/20 text-white px-3 py-2 rounded-l-sm w-full text-sm focus:outline-none focus:border-primary placeholder:text-gray-500"
              />
              <button 
                type="submit"
                className="bg-primary hover:bg-primary-dark transition-colors px-4 py-2 rounded-r-sm flex items-center justify-center"
              >
                <Send size={16} />
              </button>
            </form>
            <div className="flex gap-2">
              <div className="w-32 h-10 bg-white/10 rounded-sm flex items-center justify-center text-xs border border-white/20 cursor-pointer hover:bg-white/20 transition-colors">
                Download App
              </div>
            </div>
          </div>

        </div>

        <div className="border-t border-white/10 pt-6 mt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
          <p>© 2025 TownBolt. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span>·</span>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <span>·</span>
            <Link href="/sitemap" className="hover:text-white transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
