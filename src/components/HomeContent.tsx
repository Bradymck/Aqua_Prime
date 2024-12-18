'use client'

import React from 'react'
import { usePrivy } from '@privy-io/react-auth'

export default function HomeContent() {
  const { login, authenticated, ready, user } = usePrivy()

  if (!ready) {
    return <div>Loading...</div>
  }

  const handleLogin = async () => {
    try {
      await login()
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {authenticated ? (
        <div>
          <p className="text-lg font-semibold">Connected!</p>
          <p>Wallet: {user?.wallet?.address}</p>
        </div>
      ) : (
        <button
          onClick={handleLogin}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Connect Wallet
        </button>
      )}
    </div>
  )
}
