'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { getProduct, addToCart, addToWishlist, checkWishlist } from '@/lib/api'
import { FiStar, FiShoppingCart, FiShoppingBag, FiHeart } from 'react-icons/fi'
import { useAuth } from '@/contexts/AuthContext'

export default function ProductDetail() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [inWishlist, setInWishlist] = useState(false)

  useEffect(() => {
    fetchProduct()
  }, [params.id])

  useEffect(() => {
    if (user && product) {
      checkWishlistStatus()
    }
  }, [user, product])

  const fetchProduct = async () => {
    try {
      const data = await getProduct(params.id)
      setProduct(data)
    } catch (error) {
      console.error('Error fetching product:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async () => {
    try {
      await addToCart(product.id, quantity)
      alert('Product added to cart!')
    } catch (error) {
      console.error('Error adding to cart:', error)
      alert('Failed to add product to cart')
    }
  }

  const handleBuyNow = async () => {
    try {
      await addToCart(product.id, quantity)
      router.push('/cart')
    } catch (error) {
      console.error('Error adding to cart:', error)
      alert('Failed to add product to cart')
    }
  }

  const checkWishlistStatus = async () => {
    try {
      const result = await checkWishlist(product.id)
      setInWishlist(result.inWishlist)
    } catch (error) {
      // User not logged in or error
    }
  }

  const handleWishlistClick = async () => {
    if (!user) {
      router.push('/login')
      return
    }

    try {
      if (inWishlist) {
        alert('Item is already in wishlist. Go to wishlist page to remove it.')
      } else {
        await addToWishlist(product.id)
        setInWishlist(true)
        alert('Added to wishlist!')
      }
    } catch (error) {
      console.error('Error updating wishlist:', error)
      if (error.response?.status === 400 && error.response?.data?.error?.includes('already')) {
        setInWishlist(true)
      } else {
        alert('Failed to update wishlist')
      }
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading product...</div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Product not found</h2>
          <button
            onClick={() => router.push('/')}
            className="text-flipkart-blue hover:underline"
          >
            Go back to home
          </button>
        </div>
      </div>
    )
  }

  const discountPercent = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : product.discount_percent || 0

  const images = product.images && product.images.length > 0 ? product.images : []

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <div className="text-sm text-gray-600 mb-4">
          <span className="hover:text-flipkart-blue cursor-pointer">Home</span>
          {' > '}
          <span className="hover:text-flipkart-blue cursor-pointer">{product.category_name || 'Products'}</span>
          {' > '}
          <span className="text-gray-800">{product.name}</span>
        </div>

        <div className="bg-white rounded-sm shadow-sm p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Section */}
            <div>
              <div className="relative w-full h-[500px] bg-white border border-gray-200 rounded-sm mb-4">
                {images.length > 0 ? (
                  <Image
                    src={images[currentImageIndex]}
                    alt={product.name}
                    fill
                    className="object-contain p-4"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image Available
                  </div>
                )}
              </div>
              {images.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded border-2 ${
                        currentImageIndex === index
                          ? 'border-flipkart-blue'
                          : 'border-gray-300'
                      } bg-white`}
                    >
                      <div className="relative w-full h-full">
                        <Image
                          src={img}
                          alt={`${product.name} ${index + 1}`}
                          fill
                          className="object-contain p-1 rounded"
                          unoptimized
                        />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info Section */}
            <div>
              <h1 className="text-2xl font-medium text-gray-800 mb-4 leading-tight">
                {product.name}
              </h1>

              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1 bg-green-600 text-white px-2 py-1 rounded">
                  <span className="font-semibold">{product.rating || 0}</span>
                  <FiStar className="fill-current" size={14} />
                </div>
                <span className="text-sm text-blue-600 font-medium">
                  {product.review_count || 0} Ratings & {Math.floor((product.review_count || 0) / 10)} Reviews
                </span>
                {product.brand && (
                  <span className="text-sm text-gray-600">| {product.brand}</span>
                )}
              </div>

              <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-baseline space-x-4 mb-2">
                  <span className="text-3xl font-semibold">₹{product.price?.toLocaleString()}</span>
                  {product.original_price && product.original_price > product.price && (
                    <>
                      <span className="text-xl text-gray-500 line-through">
                        ₹{product.original_price.toLocaleString()}
                      </span>
                      <span className="text-green-600 font-semibold text-lg">
                        {discountPercent}% off
                      </span>
                    </>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Delivery by {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
                </p>
              </div>

              {product.description && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-2">Description</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">{product.description}</p>
                </div>
              )}

              {product.specifications && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-3">Specifications</h3>
                  <div className="bg-gray-50 p-4 rounded-sm">
                    {typeof product.specifications === 'string' ? (
                      <pre className="text-sm whitespace-pre-wrap">{product.specifications}</pre>
                    ) : (
                      <div className="space-y-2 text-sm">
                        {Object.entries(product.specifications).map(([key, value]) => (
                          <div key={key} className="flex border-b border-gray-200 pb-2 last:border-0">
                            <span className="font-medium w-40 text-gray-600 capitalize">
                              {key.replace(/_/g, ' ')}:
                            </span>
                            <span className="text-gray-800 flex-1">{value}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="mb-6">
                <label className="block font-semibold text-gray-800 mb-2">Quantity:</label>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 border border-gray-300 rounded-sm hover:bg-gray-100 font-semibold"
                  >
                    -
                  </button>
                  <span className="text-lg font-semibold w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 border border-gray-300 rounded-sm hover:bg-gray-100 font-semibold"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex space-x-4 mb-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-flipkart-yellow text-flipkart-blue font-semibold py-3 px-6 rounded-sm hover:bg-yellow-400 transition flex items-center justify-center space-x-2 text-lg shadow-md"
                >
                  <FiShoppingCart size={20} />
                  <span>ADD TO CART</span>
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 bg-orange-500 text-white font-semibold py-3 px-6 rounded-sm hover:bg-orange-600 transition flex items-center justify-center space-x-2 text-lg shadow-md"
                >
                  <FiShoppingBag size={20} />
                  <span>BUY NOW</span>
                </button>
                <button
                  onClick={handleWishlistClick}
                  className={`px-4 py-3 rounded-sm transition flex items-center justify-center shadow-md ${
                    inWishlist
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <FiHeart className={inWishlist ? 'fill-current' : ''} size={20} />
                </button>
              </div>

              {product.stock > 0 ? (
                <p className="text-green-600 font-medium text-sm">
                  ✓ In Stock ({product.stock} available)
                </p>
              ) : (
                <p className="text-red-600 font-medium text-sm">✗ Out of Stock</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
