'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { FiStar } from 'react-icons/fi'

export default function ProductCard({ product }) {
  const router = useRouter()

  const handleClick = () => {
    router.push(`/product/${product.id}`)
  }

  const discountPercent = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : product.discount_percent || 0

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-sm shadow-sm hover:shadow-lg transition-all cursor-pointer overflow-hidden border border-gray-100 p-4 flex flex-col"
    >
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
