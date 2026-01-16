'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FiSearch, FiShoppingCart, FiHeart, FiPackage as FiOrders, FiSmartphone, FiUsers, FiHeadphones, FiTv, FiHome, FiShoppingBag, FiPackage } from 'react-icons/fi'
import Image from 'next/image'
import { getCart } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'

const categories = [
  { 
    name: 'Mobiles & Tablets', 
    slug: 'electronics', 
    image: 'https://rukminim2.flixcart.com/flap/128/128/image/22fddf3c7da4c4f4.png'
  },
  { 
    name: 'Fashion', 
    slug: 'fashion', 
    image: 'https://rukminim2.flixcart.com/flap/128/128/image/c12afc196e5d4107.png'
  },
  { 
    name: 'Electronics', 
    slug: 'electronics', 
    image: 'https://rukminim2.flixcart.com/flap/128/128/image/69c6589653afdb9a.png'
  },
  { 
    name: 'TVs & Appliances', 
    slug: 'home-furniture', 
    image: 'https://rukminim2.flixcart.com/flap/128/128/image/0ff199d1bd27eb98.png'
  },
  { 
    name: 'Home & Furniture', 
    slug: 'home-furniture', 
    image: 'https://rukminim2.flixcart.com/flap/128/128/image/ab7e2b022a4587dd.jpg'
  },
  { 
    name: 'Beauty, Food & More', 
    slug: 'beauty', 
    image: 'https://rukminim2.flixcart.com/flap/128/128/image/0d75b34f7d8fbcb3.png'
  },
  { 
    name: 'Grocery', 
    slug: 'grocery', 
    image: 'https://rukminim2.flixcart.com/flap/128/128/image/29327f40e9c4d26b.png'
  },
]

// Category Item Component with fallback
function CategoryItem({ category }) {
  const [imageError, setImageError] = useState(false)
  const [imageSrc, setImageSrc] = useState(category.image)

  // Fallback icons for each category
  const fallbackIcons = {
    'Mobiles & Tablets': FiSmartphone,
    'Fashion': FiUsers,
    'Electronics': FiHeadphones,
    'TVs & Appliances': FiTv,
    'Home & Furniture': FiHome,
    'Beauty, Food & More': FiShoppingBag,
    'Grocery': FiPackage,
  }

  const FallbackIcon = fallbackIcons[category.name] || FiPackage

  const handleImageError = (e) => {
    if (!imageError) {
      // Try alternative image sources first
      const alternativeImages = {
        'Fashion': [
          'https://rukminim2.flixcart.com/flap/128/128/image/c12afc196e5d4107.png',
          'https://rukminim2.flixcart.com/flap/128/128/image/0ff199d1bd27eb98.png',
          'https://rukminim2.flixcart.com/flap/128/128/image/ab7e2b022a4587dd.jpg'
        ],
        'Mobiles & Tablets': [
          'https://rukminim2.flixcart.com/flap/128/128/image/22fddf3c7da4c4f4.png'
        ],
        'Electronics': [
          'https://rukminim2.flixcart.com/flap/128/128/image/69c6589653afdb9a.png'
        ],
        'TVs & Appliances': [
          'https://rukminim2.flixcart.com/flap/128/128/image/0ff199d1bd27eb98.png'
        ],
        'Home & Furniture': [
          'https://rukminim2.flixcart.com/flap/128/128/image/ab7e2b022a4587dd.jpg'
        ],
        'Beauty, Food & More': [
          'https://rukminim2.flixcart.com/flap/128/128/image/0d75b34f7d8fbcb3.png'
        ],
        'Grocery': [
          'https://rukminim2.flixcart.com/flap/128/128/image/29327f40e9c4d26b.png'
        ],
      }
      
      const alternatives = alternativeImages[category.name] || []
      const currentIndex = alternatives.indexOf(imageSrc)
      
      if (currentIndex < alternatives.length - 1) {
        // Try next alternative
        setImageSrc(alternatives[currentIndex + 1])
        setImageError(false)
      } else {
        // All alternatives failed, show icon
        setImageError(true)
      }
    }
  }

  return (
    <Link
      href={`/?category=${category.slug}`}
      className="flex flex-col items-center justify-center space-y-1 min-w-[80px] h-full hover:bg-gray-50 transition px-2 py-1 group"
    >
      <div className="relative w-12 h-12 flex-shrink-0 flex items-center justify-center">
        {!imageError ? (
          <Image
            src={imageSrc}
            alt={category.name}
            fill
            className="object-contain"
            unoptimized
            onError={handleImageError}
          />
        ) : (
          <FallbackIcon size={32} className="text-gray-600" />
        )}
      </div>
      <span className="text-xs font-medium text-gray-700 group-hover:text-flipkart-blue whitespace-nowrap text-center leading-tight">
        {category.name}
      </span>
    </Link>
  )
}

export default function Navbar() {
  const [cartCount, setCartCount] = useState(0)
  const [showDropdown, setShowDropdown] = useState(false)
  const router = useRouter()
  const { user, signOut, loading: authLoading } = useAuth()

  useEffect(() => {
    if (user) {
      fetchCartCount()
      const interval = setInterval(fetchCartCount, 2000)
      return () => clearInterval(interval)
    }
  }, [user])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.user-dropdown')) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showDropdown])

  const fetchCartCount = async () => {
    try {
      const cart = await getCart()
      const count = cart.reduce((sum, item) => sum + item.quantity, 0)
      setCartCount(count)
    } catch (error) {
      console.error('Error fetching cart:', error)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      setShowDropdown(false)
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const getUserName = () => {
    if (user?.name) {
      return user.name
    }
    if (user?.email) {
      return user.email.split('@')[0]
    }
    return 'User'
  }

  return (
    <>
      <nav className="bg-flipkart-blue text-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 min-w-[120px]">
              <span className="text-2xl font-bold">Flipkart</span>
              <div className="flex flex-col text-[10px] leading-tight">
                <span className="text-yellow-300 italic">Explore</span>
                <span className="text-yellow-300 italic">Plus</span>
              </div>
            </Link>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-8">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  const query = e.target.search.value
                  if (query.trim()) {
                    router.push(`/?search=${encodeURIComponent(query.trim())}`)
                  }
                }}
                className="relative"
              >
                <input
                  type="text"
                  name="search"
                  placeholder="Search for products, brands and more"
                  className="w-full px-4 py-2 pl-10 pr-4 text-gray-800 rounded-sm focus:outline-none text-sm"
                />
                <FiSearch className="absolute left-3 top-3 text-gray-400" size={18} />
                <button
                  type="submit"
                  className="absolute right-0 top-0 h-full px-4 bg-flipkart-yellow text-flipkart-blue rounded-r-sm hover:bg-yellow-400 transition"
                >
                  <FiSearch size={18} />
                </button>
              </form>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-6 min-w-[200px] justify-end">
              {authLoading ? (
                <div className="text-sm">Loading...</div>
              ) : user ? (
                <div className="relative user-dropdown">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center space-x-1 text-sm font-medium hover:opacity-80 transition"
                  >
                    <span>{getUserName()}</span>
                    <svg
                      className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-sm shadow-lg border border-gray-200 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-200">
                        <p className="text-sm font-medium text-gray-800">{getUserName()}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      <Link
                        href="/orders"
                        onClick={() => setShowDropdown(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition flex items-center space-x-2"
                      >
                        <FiOrders size={16} />
                        <span>My Orders</span>
                      </Link>
                      <Link
                        href="/wishlist"
                        onClick={() => setShowDropdown(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition flex items-center space-x-2"
                      >
                        <FiHeart size={16} />
                        <span>Wishlist</span>
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="text-sm font-medium hover:opacity-80 transition"
                >
                  Login
                </Link>
              )}
              <Link
                href="/cart"
                className="flex items-center space-x-1 hover:opacity-80 transition relative"
              >
                <FiShoppingCart className="text-2xl" />
                <span className="font-medium text-sm">Cart</span>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-flipkart-yellow text-flipkart-blue rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Category Navigation Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-4 h-16 overflow-x-auto">
            {categories.map((category) => (
              <CategoryItem key={category.slug} category={category} />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
