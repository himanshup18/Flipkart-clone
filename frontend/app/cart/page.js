'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { getCart, updateCartItem, removeFromCart } from '@/lib/api'
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag } from 'react-icons/fi'
import ProtectedRoute from '@/components/ProtectedRoute'

function CartContent() {
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart = async () => {
    try {
      const data = await getCart()
      setCartItems(data)
    } catch (error) {
      console.error('Error fetching cart:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleQuantityChange = async (cartId, newQuantity) => {
    if (newQuantity < 1) return
    try {
      await updateCartItem(cartId, newQuantity)
      fetchCart()
    } catch (error) {
      console.error('Error updating cart:', error)
      alert('Failed to update quantity')
    }
  }

  const handleRemove = async (cartId) => {
    if (confirm('Are you sure you want to remove this item?')) {
      try {
        await removeFromCart(cartId)
        fetchCart()
      } catch (error) {
        console.error('Error removing item:', error)
        alert('Failed to remove item')
      }
    }
  }

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0)
  }

  const calculateTotal = () => {
    return calculateSubtotal()
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading cart...</div>
        </div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-sm shadow-sm p-12 text-center max-w-2xl mx-auto">
            {/* Empty Cart Illustration */}
            <div className="mb-6 flex justify-center">
              <div className="relative w-64 h-64">
                <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center">
                  <FiShoppingBag className="text-gray-400" size={80} />
                </div>
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center">
                  <span className="text-2xl">📱</span>
                </div>
                <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-yellow-200 rounded-full flex items-center justify-center">
                  <span className="text-xl">👕</span>
                </div>
                <div className="absolute top-1/2 -left-8 w-10 h-10 bg-green-200 rounded-full flex items-center justify-center">
                  <span className="text-lg">💡</span>
                </div>
                <div className="absolute top-1/4 -right-8 w-10 h-10 bg-red-200 rounded-full flex items-center justify-center">
                  <span className="text-lg">🚗</span>
                </div>
              </div>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Your cart is empty!</h2>
            <p className="text-gray-600 mb-6">
              Explore our wide selection and find something you like
            </p>
            <button
              onClick={() => router.push('/')}
              className="bg-flipkart-blue text-white px-8 py-3 rounded-sm font-semibold hover:bg-blue-700 transition shadow-md"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-sm shadow-sm p-6">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 pb-6 mb-6 border-b border-gray-200 last:border-0 last:pb-0 last:mb-0"
                >
                  <div className="relative w-32 h-32 bg-white border border-gray-200 rounded-sm flex-shrink-0">
                    {item.images && item.images.length > 0 ? (
                      <Image
                        src={item.images[0]}
                        alt={item.name}
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

                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800 mb-1 text-lg">{item.name}</h3>
                    {item.brand && (
                      <p className="text-gray-600 text-sm mb-2">{item.brand}</p>
                    )}
                    <p className="text-lg font-semibold mb-4">
                      ₹{item.price?.toLocaleString()}
                    </p>

                    <div className="flex items-center space-x-4">
                      <div className="flex items-center border border-gray-300 rounded-sm">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="px-3 py-1.5 hover:bg-gray-100 font-semibold"
                        >
                          <FiMinus size={14} />
                        </button>
                        <span className="px-4 py-1.5 border-x border-gray-300 font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="px-3 py-1.5 hover:bg-gray-100 font-semibold"
                        >
                          <FiPlus size={14} />
                        </button>
                      </div>

                      <button
                        onClick={() => handleRemove(item.id)}
                        className="text-red-600 hover:text-red-800 flex items-center space-x-1 font-medium text-sm"
                      >
                        <FiTrash2 size={16} />
                        <span>REMOVE</span>
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-xl font-semibold text-gray-800">
                      ₹{(parseFloat(item.price) * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-sm shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-4 border-b border-gray-200">
                Price Details
              </h2>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    Price ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)
                  </span>
                  <span className="text-gray-800">₹{calculateSubtotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery Charges</span>
                  <span className="text-green-600 font-medium">FREE</span>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-4 mb-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span className="text-gray-800">Total Amount</span>
                  <span className="text-gray-800">₹{calculateTotal().toLocaleString()}</span>
                </div>
              </div>
              <button
                onClick={() => router.push('/checkout')}
                className="w-full bg-flipkart-blue text-white font-semibold py-3 rounded-sm hover:bg-blue-700 transition shadow-md"
              >
                PLACE ORDER
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Cart() {
  return (
    <ProtectedRoute>
      <CartContent />
    </ProtectedRoute>
  )
}
