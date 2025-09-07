'use client'

import Link from 'next/link'

interface EmptyStateProps {
  title: string
  description: string
  actionText?: string
  actionHref?: string
  icon?: string
}

export default function EmptyState({ 
  title, 
  description, 
  actionText, 
  actionHref,
  icon = '📝'
}: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">{description}</p>
      {actionText && actionHref && (
        <Link
          href={actionHref}
          className="btn btn-primary"
        >
          {actionText}
        </Link>
      )}
    </div>
  )
}
