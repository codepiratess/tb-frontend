import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import AppProvider from '../store/provider'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'TownBolt - Single Vendor E-Commerce',
  description: 'Your one-stop shop for everything',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased text-text-primary bg-background`}>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  )
}
