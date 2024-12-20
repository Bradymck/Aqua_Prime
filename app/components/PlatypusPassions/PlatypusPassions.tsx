'use client'

import { useWeb3Modal } from '@web3modal/wagmi/react'

export default function PlatypusPassions() {
  const { open } = useWeb3Modal()

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-black flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-white mb-8">Aqua Prime</h1>
      <button
        onClick={() => open()}
        className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
      >
        Connect Wallet
      </button>
    </div>
  )
}