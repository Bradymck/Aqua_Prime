'use client'

import { useEffect } from 'react'
import { useStyleService } from '@/hooks/useStyleService'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const { styles } = useStyleService();

  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div style={styles} className="flex flex-col items-center justify-center min-h-screen p-4">
      <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
      <button
        onClick={reset}
        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
      >
        Try again
      </button>
    </div>
  )
}
