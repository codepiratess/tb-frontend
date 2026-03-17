import { Metadata } from 'next'
import { CATEGORY_LIST } from '../../../../constants'
import CategoryPageClient from './CategoryPageClient'

import React from 'react'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const category = CATEGORY_LIST.find(c => c.slug === slug)

  return {
    title: `${category?.name || 'Category'} | TownBolt`,
    description: `Shop the best products in ${category?.name || 'this category'} on TownBolt.`,
  }
}

export default function CategoryPage({ params }: Props) {
  const { slug } = React.use(params)
  return <CategoryPageClient slug={slug} />
}
