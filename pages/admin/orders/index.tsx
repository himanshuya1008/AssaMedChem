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
  userId: string
  user: { id: string; name: string; email: string }
  status: string
  totalPriceInPaise: string
  createdAt: string
  items: OrderItem[]
  notes: string
  deliveryLocation?: string
}

export default function AdminOrders() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [newStatus, setNewStatus] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('userRole')
    if (!token || role !== 'admin') {
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

  const handleStatusUpdate = async () => {
    if (!selectedOrder || !newStatus) {
      alert('Please select a status')
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/orders/${selectedOrder.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        alert('Order status updated')
        setSelectedOrder(null)
        fetchOrders()
      }
    } catch (err) {
      console.error('Error updating order:', err)
    }
  }

  const filteredOrders = filter === 'all' ? orders : orders.filter((o) => o.status === filter)

  const formatPrice = (paise: string | number) => {
    const inr = parseFloat(String(paise)) / 100
    return `₹${inr.toFixed(2)}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div>
            <Link href="/admin" className="text-indigo-600 hover:text-indigo-700 text-sm">
              ← Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">All Orders</h1>
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
        <div className="bg-white rounded-lg shadow p-4 mb-6 flex gap-2 flex-wrap">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Orders List */}
          <div className="lg:col-span-2">
            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-gray-600">No orders found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    onClick={() => {
                      setSelectedOrder(order)
                      setNewStatus(order.status)
                    }}
                    className={`bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-lg transition ${
                      selectedOrder?.id === order.id ? 'ring-2 ring-indigo-500' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-gray-900">Order ID: {order.id.slice(0, 8)}...</p>
                        <p className="text-sm text-gray-600">Customer: {order.user.name}</p>
                        <p className="text-xs text-gray-500">{order.user.email}</p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block px-3 py-1 rounded font-semibold text-sm capitalize ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <p className="text-gray-600">Placed: {formatDate(order.createdAt)}</p>
                      <p className="font-bold text-indigo-600">{formatPrice(order.totalPriceInPaise)}</p>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">{order.items.length} item(s)</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Order Details */}
          {selectedOrder && (
            <div className="bg-white rounded-lg shadow p-6 h-fit sticky top-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Details</h2>

              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600">Order ID</p>
                  <p className="font-semibold text-gray-900">{selectedOrder.id}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Customer</p>
                  <p className="font-semibold text-gray-900">{selectedOrder.user.name}</p>
                  <p className="text-sm text-gray-600">{selectedOrder.user.email}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Delivery Location</p>
                  <p className="font-semibold text-gray-900 text-indigo-700">{selectedOrder.deliveryLocation || 'Main Warehouse'}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="font-semibold text-gray-900">{formatDate(selectedOrder.createdAt)}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="text-2xl font-bold text-indigo-600">{formatPrice(selectedOrder.totalPriceInPaise)}</p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <p className="font-semibold text-gray-900 mb-3">Items:</p>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="bg-gray-50 p-2 rounded text-sm">
                      <p className="font-semibold text-gray-900">{item.product.name}</p>
                      <p className="text-gray-600">
                        {item.quantityRequested} {item.unitRequested}
                      </p>
                      <p className="text-indigo-600 font-semibold">{formatPrice(item.priceCalculatedInPaise)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Update Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="submitted">Submitted</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                </select>

                <button
                  onClick={handleStatusUpdate}
                  className="w-full bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 font-semibold"
                >
                  Update Status
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
