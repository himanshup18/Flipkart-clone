'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCart, createOrder } from '@/lib/api'

export default function Checkout() {
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    landmark: ''
  })
  const router = useRouter()

  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart = async () => {
    try {
      const data = await getCart()
      setCartItems(data)
      if (data.length === 0) {
        router.push('/cart')
      }
    } catch (error) {
      console.error('Error fetching cart:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation
    if (!formData.name || !formData.phone || !formData.address || 
        !formData.city || !formData.state || !formData.pincode) {
      alert('Please fill in all required fields')
      return
    }

    setSubmitting(true)
    try {
      const order = await createOrder(formData)
      router.push(`/order-confirmation/${order.id}`)
    } catch (error) {
      console.error('Error placing order:', error)
      alert('Failed to place order. Please try again.')
    } finally {
      setSubmitting(false)
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
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-gray-600">Loading...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-sm shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-4 border-b border-gray-200">Delivery Address</h2>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-flipkart-blue"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-flipkart-blue"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">
                      Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-flipkart-blue"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-flipkart-blue"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700">
                        State <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-flipkart-blue"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700">
                        Pincode <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-flipkart-blue"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700">
                        Landmark (Optional)
                      </label>
                      <input
                        type="text"
                        name="landmark"
                        value={formData.landmark}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-flipkart-blue"
                      />
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <div className="bg-white rounded-sm shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-4 border-b border-gray-200">Order Summary</h2>
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center pb-3 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="font-medium text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-gray-800">
                      ₹{(parseFloat(item.price) * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-sm shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-4 border-b border-gray-200">Price Details</h2>
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
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full bg-flipkart-blue text-white font-semibold py-3 rounded-sm hover:bg-blue-700 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'PLACING ORDER...' : 'PLACE ORDER'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
