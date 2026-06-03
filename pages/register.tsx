import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function Register() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('seller')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Registration failed')
        return
      }

      router.push('/login?registered=true')
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Register</h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="John Doe"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="your@email.com"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="••••••••"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">Account Type</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="seller">Seller/User</option>
              <option value="admin">Administrator</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded font-semibold hover:bg-indigo-700 disabled:bg-gray-400"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <div className="mt-4 text-center text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="text-indigo-600 hover:text-indigo-700 font-semibold">
            Login here
          </Link>
        </div>
      </div>
    </div>
  )
}
