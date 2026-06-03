import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Button from '@/components/Button'
import Card from '@/components/Card'

export default function Home() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('userRole')
    setIsLoggedIn(!!token)
    setUserRole(role || '')
  }, [])

  // Don't show landing page if logged in
  if (isLoggedIn) {
    if (userRole === 'admin') {
      router.push('/admin')
    } else {
      router.push('/seller')
    }
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚗️</span>
            <h1 className="text-xl font-bold text-indigo-600">AasaMedChem</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-indigo-600 hover:text-indigo-700 font-semibold"
            >
              Login
            </Link>
            <Link href="/register">
              <Button variant="primary" size="md">
                Register
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32 lg:py-40">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-0 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-0 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Manage Your
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {' '}Inventory
              </span>
              Effortlessly
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              A professional inventory and order management system designed for pharmaceutical and chemical businesses. Streamline your operations with powerful tools and insights.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Link href="/login">
                <Button variant="primary" size="lg">
                  Get Started
                </Button>
              </Link>
              <button className="px-6 py-3 text-indigo-600 font-semibold border-2 border-indigo-600 rounded-lg hover:bg-indigo-50 transition">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage your inventory and orders efficiently
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '📦',
                title: 'Inventory Management',
                description:
                  'Track stock levels in real-time, manage products, and automate inventory updates.',
              },
              {
                icon: '🛒',
                title: 'Order Management',
                description:
                  'Process orders efficiently, track shipments, and manage customer information.',
              },
              {
                icon: '📊',
                title: 'Analytics & Reports',
                description:
                  'Get insights into your business with comprehensive analytics and reports.',
              },
              {
                icon: '👥',
                title: 'Multi-User Support',
                description:
                  'Manage different roles and permissions for admins, sellers, and staff.',
              },
              {
                icon: '🔒',
                title: 'Secure & Reliable',
                description:
                  'Enterprise-grade security to protect your data and sensitive information.',
              },
              {
                icon: '☁️',
                title: 'Cloud-Based',
                description:
                  'Access your inventory from anywhere with our cloud-based solution.',
              },
            ].map((feature, idx) => (
              <Card key={idx}>
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to transform your business?
          </h2>
          <p className="text-lg text-indigo-100 mb-8">
            Join hundreds of businesses already using AasaMedChem to streamline their operations.
          </p>
          <Link href="/register">
            <Button variant="secondary" size="lg">
              Start Free Trial
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">⚗️</span>
                <span className="text-white font-bold">AasaMedChem</span>
              </div>
              <p className="text-sm">Professional inventory management for pharmaceutical and chemical businesses.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Terms</a></li>
                <li><a href="#" className="hover:text-white">Support</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>© 2024 AasaMedChem. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
