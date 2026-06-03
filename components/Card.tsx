import React, { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  hover?: boolean
}

export default function Card({ children, className = '', onClick, hover = false }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition ${
        hover && 'hover:shadow-lg hover:border-indigo-200 cursor-pointer'
      } ${className}`}
    >
      {children}
    </div>
  )
}
