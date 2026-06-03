import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Decimal } from 'decimal.js'

interface Product {
  id: string
  name: string
  description: string
  category: string
  sku: string
  pricing: { id: string; unit: string; priceInRupees: string; priceFormatted: string }[]
}

interface CartItem {
  productId: string
  productName: string
  unit: string
  quantity: string
  pricePerUnit: string
  total: string
}

export default function SellerStore() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedUnit, setSelectedUnit] = useState('')
  const [quantity, setQuantity] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('userRole')
    if (!token || role !== 'seller') {
      router.push('/login')
      return
    }

    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      const data = await response.json()
      if (data.success) {
        setProducts(data.data)
        setFilteredProducts(data.data)
      }
    } catch (err) {
      console.error('Error fetching products:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    if (term === '') {
      setFilteredProducts(products)
    } else {
      const filtered = products.filter(
        (p) =>
          p.name.toLowerCase().includes(term.toLowerCase()) ||
          p.sku.toLowerCase().includes(term.toLowerCase()) ||
          p.description?.toLowerCase().includes(term.toLowerCase())
      )
      setFilteredProducts(filtered)
    }
  }

  const handleAddToCart = () => {
    if (!selectedProduct || !selectedUnit || !quantity) {
      alert('Please select product, unit, and quantity')
      return
    }

    const pricing = selectedProduct.pricing.find((p) => p.unit === selectedUnit)
    if (!pricing) {
      alert('Pricing not found for selected unit')
      return
    }

    const pricePerUnit = new Decimal(pricing.priceInRupees)
    const qty = new Decimal(quantity)
    const total = pricePerUnit.times(qty)

    const newItem: CartItem = {
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      unit: selectedUnit,
      quantity,
      pricePerUnit: pricePerUnit.toString(),
      total: total.toString(),
    }

    setCart([...cart, newItem])
    setSelectedProduct(null)
    setSelectedUnit('')
    setQuantity('')
    alert('Added to cart!')
  }

  const handleRemoveFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i !== index))
  }

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert('Cart is empty')
      return
    }

    const token = localStorage.getItem('token')

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: cart.map((item) => ({
            productId: item.productId,
            unit: item.unit,
            quantity: item.quantity,
          })),
          notes: 'Order from seller portal',
        }),
      })

      const data = await response.json()

      if (data.success) {
        alert('Order placed successfully!')
        setCart([])
        router.push('/seller/orders')
      } else {
        alert(data.message || 'Error placing order')
      }
    } catch (err: any) {
      alert('Error: ' + err.message)
    }
  }

  const totalAmount = cart.reduce((sum, item) => sum + parseFloat(item.total), 0)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-xl text-gray-700">Loading products...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <Link href="/" className="text-indigo-600 hover:text-indigo-700 text-sm">
              ← Home
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Product Store</h1>
          </div>
          <div className="flex space-x-4">
            <Link href="/seller/orders" className="text-indigo-600 hover:text-indigo-700 font-semibold">
              My Orders
            </Link>
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
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Products List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <input
                type="text"
                placeholder="Search products by name or SKU..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-gray-600">No products found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                        <p className="text-sm text-gray-600">SKU: {product.sku}</p>
                      </div>
                      {product.category && (
                        <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded text-sm font-semibold">
                          {product.category}
                        </span>
                      )}
                    </div>

                    {product.description && <p className="text-gray-600 mb-4">{product.description}</p>}

                    <div className="mb-4">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Available Units & Pricing:</p>
                      <div className="flex flex-wrap gap-2">
                        {product.pricing.map((p) => (
                          <div key={p.id} className="bg-gray-50 px-3 py-2 rounded border border-gray-200">
                            <p className="text-sm font-semibold text-gray-900">{p.unit}</p>
                            <p className="text-sm text-indigo-600">{p.priceFormatted}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {selectedProduct?.id === product.id ? (
                      <div className="bg-indigo-50 p-4 rounded border-2 border-indigo-300">
                        <div className="mb-4">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Select Unit</label>
                          <select
                            value={selectedUnit}
                            onChange={(e) => {
                              setSelectedUnit(e.target.value)
                              setQuantity('')
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          >
                            <option value="">-- Select Unit --</option>
                            {product.pricing.map((p) => (
                              <option key={p.id} value={p.unit}>
                                {p.unit} ({p.priceFormatted})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="mb-4">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity</label>
                          <input
                            type="number"
                            step="0.01"
                            placeholder="Enter quantity"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>

                        {selectedUnit && quantity && selectedProduct.pricing.find((p) => p.unit === selectedUnit) && (
                          <div className="bg-white p-3 rounded mb-4 border border-indigo-200">
                            <p className="text-sm text-gray-600">Total Price:</p>
                            <p className="text-lg font-bold text-indigo-600">
                              ₹{(
                                parseFloat(
                                  selectedProduct.pricing.find((p) => p.unit === selectedUnit)?.priceInRupees || '0'
                                ) * parseFloat(quantity)
                              ).toFixed(2)}
                            </p>
                          </div>
                        )}

                        <div className="flex gap-2">
                          <button
                            onClick={handleAddToCart}
                            className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 font-semibold"
                          >
                            ✓ Add to Cart
                          </button>
                          <button
                            onClick={() => setSelectedProduct(null)}
                            className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedProduct(product)
                          setSelectedUnit('')
                          setQuantity('')
                        }}
                        className="w-full bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 font-semibold"
                      >
                        Select Product
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart Sidebar */}
          <div className="bg-white rounded-lg shadow p-6 h-fit sticky top-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Shopping Cart</h2>

            {cart.length === 0 ? (
              <p className="text-gray-600 text-center py-8">Cart is empty</p>
            ) : (
              <>
                <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
                  {cart.map((item, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded border border-gray-200">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 text-sm">{item.productName}</p>
                          <p className="text-xs text-gray-600">
                            {item.quantity} {item.unit} × {item.pricePerUnit}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemoveFromCart(index)}
                          className="text-red-600 hover:text-red-700 text-xs font-semibold"
                        >
                          Remove
                        </button>
                      </div>
                      <p className="text-sm font-semibold text-indigo-600">₹{parseFloat(item.total).toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between mb-4">
                    <p className="font-semibold text-gray-900">Total:</p>
                    <p className="text-lg font-bold text-indigo-600">₹{totalAmount.toFixed(2)}</p>
                  </div>

                  <button
                    onClick={handleCheckout}
                    className="w-full bg-green-600 text-white px-4 py-3 rounded hover:bg-green-700 font-semibold"
                  >
                    Place Order
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
