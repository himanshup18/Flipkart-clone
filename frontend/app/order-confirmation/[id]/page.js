'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getOrder } from '@/lib/api'
import { FiCheckCircle } from 'react-icons/fi'

export default function OrderConfirmation() {
  const params = useParams()
  const router = useRouter()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrder()
  }, [params.id])

  const fetchOrder = async () => {
    try {
      const data = await getOrder(params.id)
      setOrder(data)
    } catch (error) {
      console.error('Error fetching order:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading order details...</div>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Order not found</h2>
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

  const shippingAddress = typeof order.shipping_address === 'string' 
    ? JSON.parse(order.shipping_address) 
    : order.shipping_address

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8 text-center mb-6">
          <FiCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
          <h1 className="text-3xl font-semibold text-green-600 mb-2">
            Order Placed Successfully!
          </h1>
          <p className="text-gray-600 mb-4">
            Thank you for your purchase. Your order has been confirmed.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-600 mb-1">Order Number</p>
            <p className="text-2xl font-bold text-flipkart-blue">{order.order_number}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Order Details</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Order Date</p>
              <p className="font-medium">
                {new Date(order.created_at).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Order Status</p>
              <p className="font-medium capitalize">{order.status}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold">₹{parseFloat(order.total_amount).toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
          <div className="text-gray-700">
            <p className="font-medium">{shippingAddress.name}</p>
            <p>{shippingAddress.address}</p>
            <p>
              {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.pincode}
            </p>
            {shippingAddress.landmark && (
              <p className="text-sm text-gray-600">Landmark: {shippingAddress.landmark}</p>
            )}
            <p className="mt-2">Phone: {shippingAddress.phone}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Order Items</h2>
          <div className="space-y-3">
            {order.items && order.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center border-b border-gray-200 pb-3 last:border-0">
                <div>
                  <p className="font-medium">{item.product_name}</p>
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                </div>
                <p className="font-semibold">
                  ₹{parseFloat(item.subtotal).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between text-lg font-semibold">
              <span>Total Amount</span>
              <span>₹{parseFloat(order.total_amount).toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => router.push('/')}
            className="bg-flipkart-blue text-white px-8 py-3 rounded font-semibold hover:bg-blue-700 transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  )
}
