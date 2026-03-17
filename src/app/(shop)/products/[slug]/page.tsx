import { Metadata } from 'next'
import { mockProducts } from '../../../../lib/mockData'
import ProductDetailClient from './ProductDetailClient'

import React from 'react'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = mockProducts.find(p => p.slug === slug)

  if (!product) {
    return {
      title: 'Product Not Found - TownBolt',
    }
  }

  return {
    title: `${product.name} | TownBolt`,
    description: product.description.substring(0, 160),
    openGraph: {
      images: [product.images[0]],
      title: product.name,
      description: product.description.substring(0, 160),
    }
  }
}

export default function ProductPage({ params }: Props) {
  const { slug } = React.use(params)
  // In a real app we'd fetch this from API directly in Server Component
  // For now we use the client component with mock logic
  return <ProductDetailClient slug={slug} />
}
