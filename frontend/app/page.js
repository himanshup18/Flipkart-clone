'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getProducts, getCategories } from '@/lib/api'
import ProductCard from '@/components/ProductCard'
import CategoryFilter from '@/components/CategoryFilter'
import ImageCarousel from '@/components/ImageCarousel'

function HomeContent() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Read search query from URL
    const urlSearch = searchParams.get('search')
    if (urlSearch) {
      setSearchQuery(urlSearch)
    }
    const urlCategory = searchParams.get('category')
    if (urlCategory) {
      setSelectedCategory(urlCategory)
    }
  }, [searchParams])

  useEffect(() => {
    fetchData()
  }, [selectedCategory, searchQuery])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [productsData, categoriesData] = await Promise.all([
        getProducts({ category: selectedCategory || undefined, search: searchQuery || undefined }),
        getCategories()
      ])
      setProducts(productsData)
      setCategories(categoriesData)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryChange = (categorySlug) => {
    setSelectedCategory(categorySlug)
    router.push(categorySlug ? `/?category=${categorySlug}` : '/')
  }

  const handleSearch = (query) => {
    setSearchQuery(query)
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-6">
        {/* Image Carousel */}
        {!selectedCategory && !searchQuery && (
          <div className="mb-6">
            <ImageCarousel />
          </div>
        )}

        <div className="flex gap-6">
          <aside className="w-64 flex-shrink-0 hidden lg:block">
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
            />
          </aside>

          <main className="flex-1">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="text-lg text-gray-600">Loading products...</div>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-sm shadow-sm">
                <p className="text-gray-500 text-lg">No products found</p>
              </div>
            ) : (
              <>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {selectedCategory
                      ? categories.find(c => c.slug === selectedCategory)?.name || 'Products'
                      : 'All Products'}
                    <span className="text-gray-500 font-normal ml-2 text-sm">
                      (Showing {products.length} products)
                    </span>
                  </h2>
                  <div className="text-sm text-gray-600">
                    Sort by: <span className="font-medium text-gray-800">Popularity</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  )
}
