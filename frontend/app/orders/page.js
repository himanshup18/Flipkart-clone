'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getOrders } from '@/lib/api'
import ProtectedRoute from '@/components/ProtectedRoute'
import { FiPackage, FiShoppingBag } from 'react-icons/fi'

function OrdersContent() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const data = await getOrders()
      setOrders(data)
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'text-green-600 bg-green-100'
      case 'pending':
        return 'text-yellow-600 bg-yellow-100'
      case 'cancelled':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading orders...</div>
        </div>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="text-center bg-white p-12 rounded-sm shadow-sm max-w-xl mx-auto">
            <FiPackage className="mx-auto text-6xl text-gray-400 mb-4" />
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">No orders yet!</h2>
            <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
            <Link
              href="/"
              className="inline-block bg-flipkart-blue text-white px-6 py-2 rounded-sm hover:bg-blue-700 transition shadow-md"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">My Orders</h1>

        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-sm shadow-sm p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 pb-4 border-b border-gray-200">
                <div>
                  <div className="flex items-center space-x-4 mb-2">
                    <span className="text-sm text-gray-600">Order #{order.order_number}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Placed on {formatDate(order.created_at)}
                  </p>
                </div>
                <div className="mt-2 md:mt-0">
                  <p className="text-lg font-semibold text-gray-800">
                    ₹{parseFloat(order.total_amount).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {order.items && order.items.length > 0 ? (
                  order.items.map((item) => (
                    <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0">
                      <div className="relative w-20 h-20 bg-gray-100 rounded-sm flex-shrink-0">
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                          Image
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800 mb-1">{item.product_name}</h3>
                        <p className="text-sm text-gray-600 mb-2">Quantity: {item.quantity}</p>
                        <p className="text-sm font-semibold text-gray-800">
                          ₹{parseFloat(item.product_price).toLocaleString()} × {item.quantity} = ₹{parseFloat(item.subtotal).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 text-sm">No items found</p>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  <p className="mb-1">
                    <span className="font-medium">Shipping Address:</span>
                  </p>
                  {order.shipping_address && typeof order.shipping_address === 'object' ? (
                    <div className="text-gray-700">
                      <p>{order.shipping_address.name}</p>
                      <p>{order.shipping_address.address}</p>
                      <p>
                        {order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.pincode}
                      </p>
                      {order.shipping_address.phone && (
                        <p className="mt-1">Phone: {order.shipping_address.phone}</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-700">{order.shipping_address}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Orders() {
  return (
    <ProtectedRoute>
      <OrdersContent />
    </ProtectedRoute>
  )
}
