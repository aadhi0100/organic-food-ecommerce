'use client'

import { useNotification } from '@/context/NotificationContext'
import { CheckCircle, XCircle, Info, AlertTriangle } from 'lucide-react'

export default function TestPage() {
  const { notify } = useNotification()

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">Notification Test Center</h1>
          
          <div className="bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-bold mb-6">Test All Notification Types</h2>
            
            <div className="space-y-4">
              <button
                onClick={() => notify('success', 'Success! Your order has been placed successfully.')}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium"
              >
                <CheckCircle size={24} />
                Test Success Notification
              </button>

              <button
                onClick={() => notify('error', 'Error! Payment failed. Please try again.')}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium"
              >
                <XCircle size={24} />
                Test Error Notification
              </button>

              <button
                onClick={() => notify('info', 'Info: New organic products have been added to the store!')}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium"
              >
                <Info size={24} />
                Test Info Notification
              </button>

              <button
                onClick={() => notify('warning', 'Warning: Some items in your cart are running low on stock.')}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition font-medium"
              >
                <AlertTriangle size={24} />
                Test Warning Notification
              </button>
            </div>

            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-bold mb-2">Test Instructions:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Click any button above to test different notification types</li>
                <li>• Notifications will appear in the top-right corner</li>
                <li>• Each notification auto-dismisses after 5 seconds</li>
                <li>• You can manually close notifications by clicking the X button</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-bold mb-6">Multiple Notifications Test</h2>
            
            <button
              onClick={() => {
                notify('success', 'First notification')
                setTimeout(() => notify('info', 'Second notification'), 500)
                setTimeout(() => notify('warning', 'Third notification'), 1000)
                setTimeout(() => notify('error', 'Fourth notification'), 1500)
              }}
              className="w-full px-6 py-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition font-medium"
            >
              Test Multiple Notifications (Stacked)
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
