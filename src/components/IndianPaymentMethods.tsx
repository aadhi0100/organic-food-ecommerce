'use client'

import { CreditCard, Smartphone, Wallet, Building2 } from 'lucide-react'
import { motion } from 'framer-motion'

interface PaymentMethodsProps {
  selected: string
  onSelect: (method: string) => void
}

export function IndianPaymentMethods({ selected, onSelect }: PaymentMethodsProps) {
  const methods = [
    {
      id: 'upi',
      name: 'UPI',
      icon: <Smartphone className="w-6 h-6" />,
      description: 'PhonePe, Google Pay, Paytm',
      popular: true
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      icon: <Wallet className="w-6 h-6" />,
      description: 'Pay when you receive',
      popular: true
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: <CreditCard className="w-6 h-6" />,
      description: 'Visa, Mastercard, RuPay'
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      icon: <Building2 className="w-6 h-6" />,
      description: 'All major banks'
    }
  ]

  return (
    <div className="space-y-3">
      {methods.map((method) => (
        <motion.button
          key={method.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(method.id)}
          className={`w-full p-4 rounded-lg border-2 transition text-left ${
            selected === method.id
              ? 'border-green-600 bg-green-50 dark:bg-green-900'
              : 'border-gray-200 dark:border-gray-700 hover:border-green-300'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-lg ${
              selected === method.id
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
            }`}>
              {method.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold dark:text-white">{method.name}</span>
                {method.popular && (
                  <span className="text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full">
                    Popular
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{method.description}</p>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 ${
              selected === method.id
                ? 'border-green-600 bg-green-600'
                : 'border-gray-300 dark:border-gray-600'
            }`}>
              {selected === method.id && (
                <div className="w-full h-full flex items-center justify-center text-white text-xs">
                  ✓
                </div>
              )}
            </div>
          </div>
        </motion.button>
      ))}
    </div>
  )
}
