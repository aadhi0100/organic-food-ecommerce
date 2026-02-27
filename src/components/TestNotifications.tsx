'use client'

import { useNotification } from '@/context/NotificationContext'

export function TestNotifications() {
  const { notify } = useNotification()

  return (
    <div className="fixed bottom-4 left-4 z-50 space-y-2">
      <button
        onClick={() => notify('success', 'Success! Your order has been placed.')}
        className="block w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm"
      >
        Test Success
      </button>
      <button
        onClick={() => notify('error', 'Error! Payment failed. Please try again.')}
        className="block w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
      >
        Test Error
      </button>
      <button
        onClick={() => notify('info', 'Info: New products added to store!')}
        className="block w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
      >
        Test Info
      </button>
      <button
        onClick={() => notify('warning', 'Warning: Low stock on some items.')}
        className="block w-full px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 text-sm"
      >
        Test Warning
      </button>
    </div>
  )
}
