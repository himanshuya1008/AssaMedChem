import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
}

export default function Sidebar({ isOpen }: SidebarProps) {
  const router = useRouter()
  const [userRole, setUserRole] = useState('')

  useEffect(() => {
    const role = localStorage.getItem('userRole')
    setUserRole(role || '')
  }, [])

  const isActive = (path: string) => router.pathname === path

  const menuItems =
    userRole === 'admin'
      ? [
          { href: '/admin', label: 'Dashboard', icon: '📊' },
          { href: '/admin/products', label: 'Products', icon: '📦' },
          { href: '/admin/inventory', label: 'Inventory', icon: '📈' },
          { href: '/admin/orders', label: 'Orders', icon: '🛒' },
        ]
      : [
          { href: '/seller', label: 'Browse', icon: '🛍️' },
          { href: '/seller/orders', label: 'My Orders', icon: '📋' },
        ]

  return (
    <aside
      className={`${
        isOpen ? 'w-64' : 'w-20'
      } bg-gradient-to-b from-indigo-700 to-indigo-900 text-white flex flex-col transition-all duration-300 shadow-lg`}
    >
      {/* Logo Section */}
      <div className="p-6 border-b border-indigo-600">
        <div className="flex items-center gap-3">
          <div className="text-2xl">⚗️</div>
          {isOpen && <span className="font-bold text-lg">AasaMedChem</span>}
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 px-3 py-6 space-y-2">
        {menuItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <div
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive(item.href)
                  ? 'bg-indigo-600 shadow-lg'
                  : 'hover:bg-indigo-600 text-indigo-100'
              }`}
            >
              <span className="text-xl flex-shrink-0">{item.icon}</span>
              {isOpen && <span className="font-medium">{item.label}</span>}
            </div>
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-indigo-600">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-indigo-600 transition text-indigo-100">
          <span className="text-xl">⚙️</span>
          {isOpen && <span className="font-medium text-sm">Settings</span>}
        </button>
      </div>
    </aside>
  )
}
