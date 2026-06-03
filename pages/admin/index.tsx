import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import StatCard from '@/components/StatCard'
import Card from '@/components/Card'
import Button from '@/components/Button'

export default function AdminDashboard() {
  const router = useRouter()
  const [userName, setUserName] = useState('')
  const [stats] = useState({
    totalProducts: 245,
    totalOrders: 89,
    lowStockItems: 12,
    totalRevenue: '$12,450',
  })

  useEffect(() => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('userRole')
    const name = localStorage.getItem('userName')

    if (!token || role !== 'admin') {
      router.push('/login')
      return
    }

    setUserName(name || 'Admin')
  }, [router])

  return (
    <div>
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="section-title">Dashboard</h1>
        <p className="text-muted">Welcome back, {userName}! Here's your business overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon="📦"
          title="Total Products"
          value={stats.totalProducts}
          trend={5}
          color="blue"
        />
        <StatCard
          icon="🛒"
          title="Total Orders"
          value={stats.totalOrders}
          trend={12}
          color="green"
        />
        <StatCard
          icon="⚠️"
          title="Low Stock Items"
          value={stats.lowStockItems}
          trend={-3}
          color="orange"
        />
        <StatCard
          icon="💰"
          title="Total Revenue"
          value={stats.totalRevenue}
          trend={8}
          color="green"
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <Card>
            <h2 className="section-subtitle mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/admin/products/new">
                <div className="p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg hover:shadow-md transition cursor-pointer border border-indigo-200">
                  <div className="text-2xl mb-2">➕</div>
                  <h3 className="font-semibold text-indigo-900">Add Product</h3>
                  <p className="text-sm text-indigo-700">Create new product</p>
                </div>
              </Link>
              <Link href="/admin/inventory">
                <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg hover:shadow-md transition cursor-pointer border border-orange-200">
                  <div className="text-2xl mb-2">📊</div>
                  <h3 className="font-semibold text-orange-900">Check Inventory</h3>
                  <p className="text-sm text-orange-700">View stock levels</p>
                </div>
              </Link>
              <Link href="/admin/orders">
                <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg hover:shadow-md transition cursor-pointer border border-green-200">
                  <div className="text-2xl mb-2">🛒</div>
                  <h3 className="font-semibold text-green-900">View Orders</h3>
                  <p className="text-sm text-green-700">Manage orders</p>
                </div>
              </Link>
              <Link href="/admin/products">
                <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg hover:shadow-md transition cursor-pointer border border-purple-200">
                  <div className="text-2xl mb-2">📋</div>
                  <h3 className="font-semibold text-purple-900">All Products</h3>
                  <p className="text-sm text-purple-700">Manage inventory</p>
                </div>
              </Link>
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <h2 className="section-subtitle">System Info</h2>
          <div className="space-y-4">
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-600">Last Updated</p>
              <p className="text-lg font-semibold text-blue-900">Just now</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-gray-600">System Status</p>
              <p className="text-lg font-semibold text-green-900">✓ Operational</p>
            </div>
            <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-200">
              <p className="text-sm text-gray-600">Active Users</p>
              <p className="text-lg font-semibold text-indigo-900">5 Online</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Navigation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            href: '/admin/products',
            icon: '📦',
            title: 'Products',
            description: 'Manage all products',
            color: 'from-indigo-500 to-blue-500',
          },
          {
            href: '/admin/orders',
            icon: '🛒',
            title: 'Orders',
            description: 'View all orders',
            color: 'from-green-500 to-emerald-500',
          },
          {
            href: '/admin/inventory',
            icon: '📊',
            title: 'Inventory',
            description: 'Stock management',
            color: 'from-orange-500 to-red-500',
          },
          {
            href: '#',
            icon: '⚙️',
            title: 'Settings',
            description: 'System settings',
            color: 'from-purple-500 to-pink-500',
          },
        ].map((item) => (
          <Link key={item.title} href={item.href}>
            <Card hover={item.href !== '#'} className="cursor-pointer">
              <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br ${item.color} text-white rounded-lg mb-4`}>
                <span className="text-xl">{item.icon}</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.description}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
