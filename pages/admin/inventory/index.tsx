import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

interface InventoryItem {
  id: string
  productId: string
  product: {
    id: string
    name: string
    sku: string
  }
  quantityInBaseUnit: string
  dimensionType: string
}

export default function AdminInventory() {
  const router = useRouter()
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editQuantity, setEditQuantity] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('userRole')
    if (!token || role !== 'admin') {
      router.push('/login')
      return
    }

    fetchInventory()
  }, [])

  const fetchInventory = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/inventory', {
        headers: { Authorization: `Bearer ${token}` },
      })

      const data = await response.json()
      if (data.success) {
        setInventory(data.data)
      }
    } catch (err) {
      console.error('Error fetching inventory:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateQuantity = async (id: string) => {
    if (!editQuantity) {
      alert('Please enter a quantity')
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/admin/inventory/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantityInBaseUnit: editQuantity }),
      })

      if (response.ok) {
        alert('Inventory updated successfully')
        setEditingId(null)
        setEditQuantity('')
        fetchInventory()
      }
    } catch (err) {
      console.error('Error updating inventory:', err)
      alert('Error updating inventory')
    }
  }

  const getBaseUnitLabel = (dimensionType: string) => {
    const labels: Record<string, string> = {
      weight: 'grams (g)',
      volume: 'milliliters (mL)',
      count: 'items',
    }
    return labels[dimensionType] || dimensionType
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-xl text-gray-700">Loading inventory...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
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
        {inventory.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600">No inventory items found</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Product</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">SKU</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Type</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Current Quantity</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {inventory.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{item.product.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.product.sku}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{getBaseUnitLabel(item.dimensionType)}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-semibold">
                      {editingId === item.id ? (
                        <input
                          type="number"
                          step="0.000001"
                          value={editQuantity}
                          onChange={(e) => setEditQuantity(e.target.value)}
                          className="px-3 py-1 border border-gray-300 rounded w-32"
                          placeholder="Enter quantity"
                        />
                      ) : (
                        `${parseFloat(item.quantityInBaseUnit).toFixed(2)} ${getBaseUnitLabel(item.dimensionType)}`
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      {editingId === item.id ? (
                        <>
                          <button
                            onClick={() => handleUpdateQuantity(item.id)}
                            className="text-green-600 hover:text-green-700 font-semibold"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setEditingId(null)
                              setEditQuantity('')
                            }}
                            className="text-red-600 hover:text-red-700 font-semibold"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingId(item.id)
                            setEditQuantity(item.quantityInBaseUnit)
                          }}
                          className="text-indigo-600 hover:text-indigo-700 font-semibold"
                        >
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Storage Strategy Info */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Storage Strategy</h3>
          <p className="text-blue-800 mb-3">
            All quantities are stored in base units for consistency:
          </p>
          <ul className="list-disc list-inside text-blue-800 space-y-1">
            <li><strong>Weight:</strong> Stored in grams (g) - 1 kg = 1000 g</li>
            <li><strong>Volume:</strong> Stored in milliliters (mL) - 1 L = 1000 mL</li>
            <li><strong>Count:</strong> Stored in items - 1 item = 1 unit</li>
          </ul>
          <p className="text-blue-700 mt-3 text-sm">
            When customers place orders in different units, automatic conversion ensures accurate quantity tracking.
          </p>
        </div>
      </main>
    </div>
  )
}
