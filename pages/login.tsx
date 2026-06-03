import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Alert from '@/components/Alert'
import Button from '@/components/Button'
import Input from '@/components/Input'

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showTestCredentials, setShowTestCredentials] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Login failed')
        return
      }

      localStorage.setItem('token', data.token)
      localStorage.setItem('userRole', data.user.role)
      localStorage.setItem('userName', data.user.name)

      if (data.user.role === 'admin') {
        router.push('/admin')
      } else {
        router.push('/seller')
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleQuickLogin = (testEmail: string, testPassword: string) => {
    setEmail(testEmail)
    setPassword(testPassword)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-blue-500 to-indigo-600 flex items-center justify-center px-4 py-12">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white opacity-10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white opacity-10 rounded-full translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-xl shadow-lg mb-4">
            <span className="text-3xl">⚗️</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">AasaMedChem</h1>
          <p className="text-indigo-100">Inventory & Order Management</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 backdrop-blur-xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Sign In</h2>

          {error && (
            <Alert type="error" message={error} onClose={() => setError('')} />
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@example.com"
              icon="✉️"
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              icon="🔒"
            />

            <div className="flex justify-between items-center py-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <Link href="#" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              loading={loading}
              variant="primary"
              size="lg"
              className="w-full mt-6"
            >
              Sign In
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-sm text-gray-500">or</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Test Credentials */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <button
              type="button"
              onClick={() => setShowTestCredentials(!showTestCredentials)}
              className="w-full text-left text-sm font-medium text-blue-900"
            >
              {showTestCredentials ? '▼' : '▶'} Demo Credentials
            </button>
            {showTestCredentials && (
              <div className="mt-3 space-y-2 text-sm">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('admin@assmedchem.com', 'admin123')}
                  className="w-full text-left px-3 py-2 bg-white rounded hover:bg-gray-50 text-gray-700 border border-blue-100"
                >
                  👤 Admin: admin@assmedchem.com
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('seller@assmedchem.com', 'seller123')}
                  className="w-full text-left px-3 py-2 bg-white rounded hover:bg-gray-50 text-gray-700 border border-blue-100"
                >
                  🏪 Seller: seller@assmedchem.com
                </button>
              </div>
            )}
          </div>

          {/* Register Link */}
          <p className="text-center text-gray-600 text-sm">
            Don't have an account?{' '}
            <Link href="/register" className="font-semibold text-indigo-600 hover:text-indigo-700">
              Create one
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-indigo-100 text-sm mt-6">
          © 2024 AasaMedChem. All rights reserved.
        </p>
      </div>
    </div>
  )
}
