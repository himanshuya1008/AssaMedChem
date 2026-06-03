import React, { ReactNode, useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Sidebar from './Sidebar'

interface LayoutProps {
  children: ReactNode
  title?: string
  showSidebar?: boolean
}

export default function Layout({ children, title = 'AasaMedChem', showSidebar = true }: LayoutProps) {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState('')
  const [userName, setUserName] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('userRole')
    const name = localStorage.getItem('userName')
    setIsLoggedIn(!!token)
    setUserRole(role || '')
    setUserName(name || '')
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userRole')
    localStorage.removeItem('userName')
    router.push('/')
  }

  // Don't show layout for auth pages
  if (router.pathname === '/login' || router.pathname === '/register') {
    return <>{children}</>
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      {showSidebar && isLoggedIn && (
        <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      )}

      {/* Main Content */}
      <div className={`flex-1 flex flex-col overflow-hidden transition-all ${sidebarOpen && showSidebar ? 'ml-0' : ''}`}>
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              {showSidebar && (
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              )}
              <h1 className="text-xl font-bold text-gray-900">{title}</h1>
            </div>

            {isLoggedIn && (
              <div className="flex items-center gap-4">
                <div className="hidden md:flex flex-col items-end">
                  <p className="text-sm font-medium text-gray-900">{userName}</p>
                  <p className="text-xs text-gray-500 capitalize">{userRole}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  )
}
