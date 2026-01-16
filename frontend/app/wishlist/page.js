'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getWishlist, removeFromWishlist, addToCart } from '@/lib/api'
import ProtectedRoute from '@/components/ProtectedRoute'
import { FiHeart, FiShoppingCart, FiTrash2 } from 'react-icons/fi'
import ProductCard from '@/components/ProductCard'

function WishlistContent() {
  const [wishlistItems, setWishlistItems] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchWishlist()
  }, [])

  const fetchWishlist = async () => {
    try {
      const data = await getWishlist()
      setWishlistItems(data)
    } catch (error) {
      console.error('Error fetching wishlist:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async (wishlistId) => {
    if (confirm('Remove this item from wishlist?')) {
      try {
        await removeFromWishlist(wishlistId)
        fetchWishlist()
      } catch (error) {
        console.error('Error removing from wishlist:', error)
        alert('Failed to remove item')
      }
    }
  }

  const handleAddToCart = async (productId) => {
    try {
      await addToCart(productId, 1)
      alert('Item added to cart!')
    } catch (error) {
      console.error('Error adding to cart:', error)
      alert('Failed to add item to cart')
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading wishlist...</div>
        </div>
      </div>
    )
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="text-center bg-white p-12 rounded-sm shadow-sm max-w-xl mx-auto">
            <FiHeart className="mx-auto text-6xl text-gray-400 mb-4" />
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Your wishlist is empty!</h2>
            <p className="text-gray-600 mb-6">Add items to your wishlist to save them for later.</p>
            <Link
              href="/"
              className="inline-block bg-flipkart-blue text-white px-6 py-2 rounded-sm hover:bg-blue-700 transition shadow-md"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          My Wishlist ({wishlistItems.length} items)
        </h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {wishlistItems.map((item) => (
            <div key={item.id} className="bg-white rounded-sm shadow-sm p-4 relative group">
              {/* Remove button */}
              <button
                onClick={() => handleRemove(item.id)}
                className="absolute top-2 right-2 z-10 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition opacity-0 group-hover:opacity-100"
                title="Remove from wishlist"
              >
                <FiTrash2 className="text-red-600" size={18} />
              </button>

              {/* Product Image */}
              <Link href={`/product/${item.product_id}`}>
                <div className="relative w-full h-48 bg-gray-100 rounded-sm mb-3 overflow-hidden">
                  {item.product?.images && item.product.images.length > 0 ? (
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      className="object-contain p-2"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                      No Image
                    </div>
                  )}
                </div>
              </Link>

              {/* Product Info */}
              <div className="space-y-2">
                <Link href={`/product/${item.product_id}`}>
                  <h3 className="font-medium text-sm text-gray-800 line-clamp-2 hover:text-flipkart-blue">
                    {item.product?.name}
                  </h3>
                </Link>

                {item.product?.brand && (
                  <p className="text-xs text-gray-600">{item.product.brand}</p>
                )}

                <div className="flex items-center space-x-2">
                  <span className="text-lg font-semibold">₹{item.product?.price?.toLocaleString()}</span>
                  {item.product?.original_price && item.product.original_price > item.product.price && (
                    <>
                      <span className="text-gray-500 line-through text-sm">
                        ₹{item.product.original_price.toLocaleString()}
                      </span>
                      {item.product.discount_percent > 0 && (
                        <span className="text-green-600 text-xs font-medium">
                          {item.product.discount_percent}% off
                        </span>
                      )}
                    </>
                  )}
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={() => handleAddToCart(item.product_id)}
                  className="w-full bg-flipkart-blue text-white py-2 rounded-sm hover:bg-blue-700 transition text-sm font-medium flex items-center justify-center space-x-2"
                >
                  <FiShoppingCart size={16} />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Wishlist() {
  return (
    <ProtectedRoute>
      <WishlistContent />
    </ProtectedRoute>
  )
}
