import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

interface Pricing {
  unit: string
  priceInRupees: string
}

export default function EditProduct() {
  const router = useRouter()
  const { id } = router.query

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [sku, setSku] = useState('')
  const [dimensionType, setDimensionType] = useState('count')
  const [initialQuantity, setInitialQuantity] = useState('')
  const [pricing, setPricing] = useState<Pricing[]>([{ unit: 'item', priceInRupees: '' }])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const unitsByDimension: Record<string, string[]> = {
    weight: ['g', 'kg'],
    volume: ['mL', 'L'],
    count: ['item'],
  }

  useEffect(() => {
    if (!id) return
    fetchProductDetails()
  }, [id])

  const fetchProductDetails = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/admin/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      const data = await response.json()
      if (data.success) {
        const prod = data.data
        setName(prod.name)
        setDescription(prod.description || '')
        setCategory(prod.category || '')
        setSku(prod.sku)
        setDimensionType(prod.dimensionType)
        setInitialQuantity(prod.quantity)
        setPricing(prod.pricing.length > 0 ? prod.pricing : [{ unit: 'item', priceInRupees: '' }])
      } else {
        setError(data.message || 'Error loading product details')
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleAddPricing = () => {
    setPricing([...pricing, { unit: unitsByDimension[dimensionType][0] || 'item', priceInRupees: '' }])
  }

  const handleRemovePricing = (index: number) => {
    setPricing(pricing.filter((_, i) => i !== index))
  }

  const handlePricingChange = (index: number, field: string, value: string) => {
    const updated = [...pricing]
    updated[index] = { ...updated[index], [field]: value }
    setPricing(updated)
  }

  const handleDimensionTypeChange = (newType: string) => {
    setDimensionType(newType)
    // Reset pricing units for new dimension
    const defaultUnit = unitsByDimension[newType][0] || 'item'
    setPricing([{ unit: defaultUnit, priceInRupees: '' }])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)

    if (!name || !sku || pricing.some((p) => !p.unit || !p.priceInRupees)) {
      setError('Please fill all required fields')
      setSaving(false)
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          description,
          category,
          sku,
          pricing: pricing.map((p) => ({
            unit: p.unit,
            priceInRupees: parseFloat(p.priceInRupees),
          })),
          inventory: {
            quantity: initialQuantity ? parseFloat(initialQuantity) : 0,
            dimensionType,
          },
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Error updating product')
        return
      }

      alert('Product updated successfully!')
      router.push('/admin/products')
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-xl text-gray-700">Loading product details...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/admin/products" className="text-indigo-600 hover:text-indigo-700 text-sm">
            ← Back to Products
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="border-b pb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Information</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., Sulfuric Acid"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">SKU (Stock Keeping Unit) *</label>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., SA-001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Product description..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., Acids, Bases, Solvents"
                  />
                </div>
              </div>
            </div>

            {/* Inventory */}
            <div className="border-b pb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Inventory Setup</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Dimension Type *
                  </label>
                  <select
                    value={dimensionType}
                    onChange={(e) => handleDimensionTypeChange(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="weight">Weight (grams, kilograms)</option>
                    <option value="volume">Volume (milliliters, liters)</option>
                    <option value="count">Count (items)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Stock Quantity (in base unit)
                  </label>
                  <input
                    type="number"
                    step="0.000001"
                    value={initialQuantity}
                    onChange={(e) => setInitialQuantity(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="0"
                  />
                  <p className="text-xs text-gray-600 mt-1">
                    {dimensionType === 'weight' && 'Base unit: grams (1 kg = 1000 g)'}
                    {dimensionType === 'volume' && 'Base unit: milliliters (1 L = 1000 mL)'}
                    {dimensionType === 'count' && 'Base unit: items'}
                  </p>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="border-b pb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Pricing by Unit</h2>
                <button
                  type="button"
                  onClick={handleAddPricing}
                  className="text-indigo-600 hover:text-indigo-700 font-semibold text-sm"
                >
                  + Add Price
                </button>
              </div>

              <div className="space-y-3">
                {pricing.map((p, index) => (
                  <div key={index} className="flex gap-3">
                    <select
                      value={p.unit}
                      onChange={(e) => handlePricingChange(index, 'unit', e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {unitsByDimension[dimensionType]?.map((unit) => (
                        <option key={unit} value={unit}>
                          {unit}
                        </option>
                      )) || <option value={p.unit}>{p.unit}</option>}
                    </select>

                    <input
                      type="number"
                      step="0.01"
                      placeholder="Price in INR"
                      value={p.priceInRupees}
                      onChange={(e) => handlePricingChange(index, 'priceInRupees', e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />

                    <button
                      type="button"
                      onClick={() => handleRemovePricing(index)}
                      className="px-4 py-2 text-red-600 hover:text-red-700 font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded hover:bg-indigo-700 disabled:bg-gray-400 font-semibold"
              >
                {saving ? 'Saving...' : 'Save Product'}
              </button>
              <Link
                href="/admin/products"
                className="flex-1 bg-gray-300 text-gray-700 px-6 py-3 rounded hover:bg-gray-400 font-semibold text-center"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
