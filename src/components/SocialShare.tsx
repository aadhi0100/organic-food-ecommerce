'use client'

import { Facebook, Twitter, Copy, MessageCircle } from 'lucide-react'
import { useNotification } from '@/context/NotificationContext'

interface SocialShareProps {
  url: string
  title: string
  description?: string
}

export function SocialShare({ url, title, description }: SocialShareProps) {
  const { notify } = useNotification()
  const text = description ? `${title} — ${description}` : title

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url)
      notify('success', 'Link copied to clipboard!')
    } catch {
      notify('error', 'Failed to copy link')
    }
  }

  const shareOptions = [
    {
      label: 'WhatsApp',
      icon: <MessageCircle size={18} />,
      color: 'bg-green-500 hover:bg-green-600',
      href: `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
    },
    {
      label: 'Facebook',
      icon: <Facebook size={18} />,
      color: 'bg-blue-600 hover:bg-blue-700',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
    {
      label: 'Twitter',
      icon: <Twitter size={18} />,
      color: 'bg-sky-500 hover:bg-sky-600',
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
    },
  ]

  return (
    <div className="flex flex-wrap items-center gap-2">
      {shareOptions.map((opt) => (
        <a
          key={opt.label}
          href={opt.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-white transition ${opt.color}`}
        >
          {opt.icon}
          {opt.label}
        </a>
      ))}
      <button
        onClick={copyToClipboard}
        className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
      >
        <Copy size={18} />
        Copy Link
      </button>
    </div>
  )
}
