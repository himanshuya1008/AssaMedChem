import React, { ReactNode } from 'react'

interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info'
  message: ReactNode
  onClose?: () => void
}

export default function Alert({ type, message, onClose }: AlertProps) {
  const styles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  }

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  }

  return (
    <div className={`border rounded-lg p-4 flex items-start justify-between gap-4 ${styles[type]}`}>
      <div className="flex items-start gap-3">
        <span className="text-lg font-semibold">{icons[type]}</span>
        <div>{message}</div>
      </div>
      {onClose && (
        <button onClick={onClose} className="flex-shrink-0 text-lg opacity-50 hover:opacity-100">
          ×
        </button>
      )}
    </div>
  )
}
