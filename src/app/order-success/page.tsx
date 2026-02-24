'use client'

import Link from 'next/link'
import { CheckCircle, Package, Home } from 'lucide-react'
import { motion } from 'framer-motion'

export default function OrderSuccessPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto text-center"
      >
        <CheckCircle size={80} className="text-green-600 mx-auto mb-6" />
        <h1 className="text-4xl font-bold mb-4">Order Placed Successfully!</h1>
        <p className="text-xl text-gray-600 mb-8">
          Thank you for your order. We'll send you a confirmation email shortly.
        </p>
        
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 mb-8">
          <Package size={48} className="text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">What's Next?</h2>
          <ul className="text-left space-y-2 max-w-md mx-auto">
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">1.</span>
              <span>You'll receive an order confirmation email</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">2.</span>
              <span>We'll prepare your fresh organic products</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">3.</span>
              <span>Your order will be delivered within 24-48 hours</span>
            </li>
          </ul>
        </div>
        
        <div className="flex gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 transition"
          >
            <Home size={20} />
            Back to Home
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 border-2 border-green-600 text-green-600 px-8 py-3 rounded-lg font-bold hover:bg-green-50 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
