import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

interface OrderItem {
  id: string
  productId: string
  product: { id: string; name: string; sku: string }
  unitRequested: string
  quantityRequested: string
  priceCalculatedInPaise: string
}

interface Order {
  id: string
  status: string
  totalPriceInPaise: string
  createdAt: string
  items: OrderItem[]
  notes: string
}

export default function SellerOrders() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('userRole')
    if (!token || role !== 'seller') {
      router.push('/login')
      return
    }

    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/orders', {
        headers: { Authorization: `Bearer ${token}` },
      })

      const data = await response.json()
      if (data.success) {
        setOrders(data.data)
      }
    } catch (err) {
      console.error('Error fetching orders:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredOrders = filter === 'all' ? orders : orders.filter((o) => o.status === filter)

  const formatPrice = (paise: string | number) => {
    const inr = parseFloat(String(paise)) / 100
    return `₹${inr.toFixed(2)}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN')
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-800',
      submitted: 'bg-blue-100 text-blue-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      shipped: 'bg-yellow-100 text-yellow-800',
      delivered: 'bg-green-100 text-green-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-xl text-gray-700">Loading orders...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <Link href="/seller" className="text-indigo-600 hover:text-indigo-700 text-sm">
              ← Back to Store
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          </div>
          <button
            onClick={() => {
              localStorage.clear()
              router.push('/')
            }}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter */}
        <div className="bg-white rounded-lg shadow p-4 mb-6 flex gap-2">
          {['all', 'submitted', 'approved', 'rejected', 'shipped', 'delivered'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded font-semibold capitalize ${
                filter === status
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600 mb-4">No orders found</p>
            <Link href="/seller" className="text-indigo-600 hover:text-indigo-700 font-semibold">
              Continue Shopping →
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="bg-gray-50 p-6 border-b flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Order ID: {order.id}</h3>
                    <p className="text-sm text-gray-600">
                      Placed on: {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-4 py-2 rounded font-semibold text-sm capitalize ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                    <p className="text-xl font-bold text-indigo-600 mt-2">{formatPrice(order.totalPriceInPaise)}</p>
                  </div>
                </div>

                <div className="p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Order Items:</h4>
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="bg-gray-50 p-4 rounded border border-gray-200">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold text-gray-900">{item.product.name}</p>
                            <p className="text-sm text-gray-600">SKU: {item.product.sku}</p>
                          </div>
                          <p className="text-lg font-bold text-indigo-600">
                            {formatPrice(item.priceCalculatedInPaise)}
                          </p>
                        </div>
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantityRequested} {item.unitRequested}
                        </p>
                      </div>
                    ))}
                  </div>

                  {order.notes && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Notes:</span> {order.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
