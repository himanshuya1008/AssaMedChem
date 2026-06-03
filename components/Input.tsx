import React, { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  icon?: ReactNode
}

import { ReactNode } from 'react'

export default function Input({ label, error, helperText, icon, className = '', ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}
      <div className="relative">
        {icon && <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">{icon}</div>}
        <input
          className={`w-full px-4 py-2 ${icon ? 'pl-10' : ''} border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${
            error ? 'border-red-500' : 'border-gray-300'
          } ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {helperText && <p className="mt-1 text-sm text-gray-500">{helperText}</p>}
    </div>
  )
}
