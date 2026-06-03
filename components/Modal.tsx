import React, { ReactNode } from 'react'

interface ModalProps {
  isOpen: boolean
  title: string
  onClose: () => void
  children: ReactNode
  size?: 'sm' | 'md' | 'lg'
}

export default function Modal({ isOpen, title, onClose, children, size = 'md' }: ModalProps) {
  if (!isOpen) return null

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        {/* Modal content */}
        <div
          className={`inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:align-middle w-full ${sizes[size]} sm:my-8`}
        >
          <div className="bg-white px-6 pt-5 pb-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">{title}</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-500 text-2xl leading-none">
                ×
              </button>
            </div>
            <div>{children}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
