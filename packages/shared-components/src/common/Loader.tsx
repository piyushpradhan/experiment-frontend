import * as React from 'react'

interface LoaderProps {
  message?: string
  onHide?: () => void
}

export const Loader: React.FC<LoaderProps> = ({
  message = 'Loading...',
  onHide,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="text-gray-700">{message}</span>
        </div>
        {onHide && (
          <button
            onClick={onHide}
            className="mt-4 text-sm text-gray-500 hover:text-gray-700"
          >
            Hide
          </button>
        )}
      </div>
    </div>
  )
}
