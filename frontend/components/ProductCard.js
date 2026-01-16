'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { FiStar, FiHeart } from 'react-icons/fi'
import { addToWishlist, removeFromWishlist, checkWishlist } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'

export default function ProductCard({ product }) {
  const router = useRouter()
  const { user } = useAuth()
  const [inWishlist, setInWishlist] = useState(false)
  const [wishlistId, setWishlistId] = useState(null)

  useEffect(() => {
    if (user) {
      checkWishlistStatus()
    }
  }, [user, product.id])

  const checkWishlistStatus = async () => {
    try {
      const result = await checkWishlist(product.id)
      setInWishlist(result.inWishlist)
    } catch (error) {
      // User not logged in or error
    }
  }

  const handleClick = () => {
    router.push(`/product/${product.id}`)
  }

  const handleWishlistClick = async (e) => {
    e.stopPropagation()
    if (!user) {
      router.push('/login')
      return
    }

    try {
      if (inWishlist) {
        // Note: We'd need wishlistId to remove, but for now just show message
        alert('Item is in wishlist. Go to wishlist page to remove it.')
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

  const discountPercent = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : product.discount_percent || 0

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-sm shadow-sm hover:shadow-lg transition-all cursor-pointer overflow-hidden border border-gray-100 p-4 flex flex-col relative group"
    >
      {/* Wishlist Button */}
      <button
        onClick={handleWishlistClick}
        className={`absolute top-2 right-2 z-10 p-2 rounded-full shadow-md transition ${
          inWishlist
            ? 'bg-red-500 text-white'
            : 'bg-white text-gray-600 hover:bg-red-50 opacity-0 group-hover:opacity-100'
        }`}
        title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <FiHeart className={inWishlist ? 'fill-current' : ''} size={18} />
      </button>

      <div className="relative w-full h-48 bg-white mb-3 flex-shrink-0">
        {product.images && product.images.length > 0 ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-contain p-2"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            No Image
          </div>
        )}
      </div>
      
      <div className="flex-1 flex flex-col">
        <h3 className="font-medium text-gray-800 mb-2 line-clamp-2 text-sm leading-snug min-h-[2.5rem]">
          {product.name}
        </h3>
        
        <div className="flex items-center space-x-1 mb-2">
          <span className="bg-green-600 text-white px-1.5 py-0.5 rounded text-xs font-semibold flex items-center">
            <FiStar className="fill-current mr-0.5" size={10} />
            <span className="ml-0.5">{product.rating || 0}</span>
          </span>
          <span className="text-gray-500 text-xs">
            ({product.review_count || 0})
          </span>
        </div>
        
        <div className="flex items-baseline space-x-2 mb-1">
          <span className="text-lg font-semibold">₹{product.price?.toLocaleString()}</span>
          {product.original_price && product.original_price > product.price && (
            <>
              <span className="text-gray-500 line-through text-sm">
                ₹{product.original_price.toLocaleString()}
              </span>
              <span className="text-green-600 text-xs font-semibold">
                {discountPercent}% off
              </span>
            </>
          )}
        </div>
        
        {product.brand && (
          <p className="text-xs text-gray-500 mb-2">{product.brand}</p>
        )}
        
        {product.stock > 0 ? (
          <p className="text-green-600 text-xs font-medium mt-auto">In Stock</p>
        ) : (
          <p className="text-red-600 text-xs font-medium mt-auto">Out of Stock</p>
        )}
      </div>
    </div>
  )
}
