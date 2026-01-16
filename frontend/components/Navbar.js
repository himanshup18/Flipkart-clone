'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FiSearch, FiShoppingCart, FiSmartphone, FiUsers, FiHeadphones, FiTv, FiHome, FiShoppingBag, FiPackage, FiHeart, FiPackage as FiOrders } from 'react-icons/fi'
import { getCart } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'

const categories = [
  { name: 'Mobiles & Tablets', slug: 'electronics', icon: FiSmartphone },
  { name: 'Fashion', slug: 'fashion', icon: FiUsers },
  { name: 'Electronics', slug: 'electronics', icon: FiHeadphones },
  { name: 'TVs & Appliances', slug: 'home-furniture', icon: FiTv },
  { name: 'Home & Furniture', slug: 'home-furniture', icon: FiHome },
  { name: 'Beauty, Food & More', slug: 'beauty', icon: FiShoppingBag },
  { name: 'Grocery', slug: 'grocery', icon: FiPackage },
]

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
          <div className="flex items-center space-x-6 h-12 overflow-x-auto">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <Link
                  key={category.slug}
                  href={`/?category=${category.slug}`}
                  className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-flipkart-blue whitespace-nowrap transition"
                >
                  <Icon size={18} />
                  <span>{category.name}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
