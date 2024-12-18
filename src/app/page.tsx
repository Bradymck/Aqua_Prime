'use client'

import dynamic from 'next/dynamic'

const PlatypusPassions = dynamic(() => import('@/components/platypus-passions'), {
  loading: () => (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="loading-spinner" />
    </div>
  ),
  ssr: false
})

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      <main>
        <PlatypusPassions />
      </main>
    </div>
  )
}