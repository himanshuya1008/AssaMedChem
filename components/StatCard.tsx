import React from 'react'

interface StatCardProps {
  icon: string
  title: string
  value: string | number
  description?: string
  trend?: number
  color?: 'blue' | 'green' | 'orange' | 'red'
}

export default function StatCard({
  icon,
  title,
  value,
  description,
  trend,
  color = 'blue',
}: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    orange: 'bg-orange-100 text-orange-600',
    red: 'bg-red-100 text-red-600',
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
          {trend !== undefined && (
            <p className={`text-sm font-semibold mt-2 ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </p>
          )}
        </div>
        <div className={`${colorClasses[color]} rounded-lg p-4 text-2xl`}>{icon}</div>
      </div>
    </div>
  )
}
