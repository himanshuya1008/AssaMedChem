import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

interface Product {
  id: string
  name: string
  description: string
  category: string
  sku: string
  isActive: boolean
  pricing: any[]
  inventory: any
}

export default function AdminProducts() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/products', {
        headers: { Authorization: `Bearer ${token}` },
      })

      const data = await response.json()
      if (data.success) {
        setProducts(data.data)
      } else {
        setError(data.message)
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        setProducts(products.filter((p) => p.id !== id))
      }
    } catch (err) {
      console.error('Error deleting product:', err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-xl text-gray-700">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div>
            <Link href="/admin" className="text-indigo-600 hover:text-indigo-700 mb-2">
              ← Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          </div>
          <Link
            href="/admin/products/new"
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            + Add Product
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {products.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600 mb-4">No products found</p>
            <Link
              href="/admin/products/new"
              className="text-indigo-600 hover:text-indigo-700 font-semibold"
            >
              Create your first product →
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">SKU</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Category</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Units</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Inventory</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{product.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{product.sku}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {product.pricing.map((p) => p.unitType).join(', ')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {product.inventory
                        ? `${product.inventory.quantityInBaseUnit} ${product.inventory.dimensionType}`
                        : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="text-indigo-600 hover:text-indigo-700"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}
