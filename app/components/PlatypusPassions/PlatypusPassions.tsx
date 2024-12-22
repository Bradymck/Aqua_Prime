/**
 * @file PlatypusPassions.tsx
 * Main component for the AquaPrime dating app interface.
 * Parent component that handles wallet connection and displays the profile generation interface.
 *
 * Component hierarchy:
 * - PlatypusPassions (parent)
 *   - ProfileGenerator (child)
 *
 * Important notes:
 * - Uses useBalances hook for Moonstone token balance
 * - Displays balance in top section with 2 decimal places
 * - Handles wallet connection state
 * - Renders ProfileGenerator when wallet is connected
 */

'use client'

import { useState, useEffect } from 'react'
import { useWallet } from '@/private/hooks/useWallet'
import { Button } from '../ui/button'
import { MoonstoneBalance } from '../ui/MoonstoneBalance'
import Image from 'next/image'
import { ProfileGenerator } from '../ProfileGenerator/ProfileGenerator'

export default function PlatypusPassions() {
  const { address, isConnected, connect } = useWallet()
  const [currentView, setCurrentView] = useState<'welcome' | 'generate' | 'app'>('welcome')

  useEffect(() => {
    if (isConnected) {
      setCurrentView('generate')
    } else {
      setCurrentView('welcome')
    }
  }, [isConnected])

  const loadLikedProfiles = async () => {
    if (!address) return

    try {
      const response = await fetch(`/api/likes?userId=${address}`)
      if (!response.ok) throw new Error('Failed to fetch liked profiles')
      const data = await response.json()
      return data.data.likes
    } catch (error) {
      console.error('Error loading liked profiles:', error)
      return []
    }
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 to-black flex flex-col items-center justify-center p-4">
        <h1 className="text-4xl font-bold text-white mb-8">Platypus Passions</h1>
        <div className="mb-6">
          <Image
            src="/assets/branding/get_in.png"
            alt="Get in friend"
            width={300}
            height={200}
            className="rounded-lg mx-auto mb-4"
          />
        </div>
        <Button
          onClick={connect}
          className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 rounded-lg text-lg font-semibold"
        >
          Connect Wallet
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-black p-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-4xl font-bold text-white text-center mb-8">Platypus Passions</h1>

        {/* Navigation */}
        <div className="flex justify-center space-x-4 mb-8">
          <Button
            variant="ghost"
            className="text-pink-400 hover:text-pink-300"
            onClick={() => setCurrentView('generate')}
          >
            Generate
          </Button>
          <Button
            variant="ghost"
            className="text-pink-400 hover:text-pink-300"
            onClick={() => window.location.href = '/profile-pool'}
          >
            Profile Pool
          </Button>
        </div>

        {currentView === 'generate' && (
          <>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Generate Matches</h2>
              <p className="text-gray-300 mb-6">Find your perfect platypus!</p>
              <div className="flex justify-center mb-4">
                <span className="text-pink-500 text-4xl">💕</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Ready to Meet New Platypuses?</h3>
              <p className="text-gray-300 mb-6">
                Burn a moonstone to generate 5 unique profiles! Each one is a portal to a new adventure in AquaPrime.
              </p>
              <div className="bg-purple-900/50 rounded-lg p-4 mb-6">
                <p className="text-white mb-2">Moonstones: <MoonstoneBalance /></p>
              </div>
            </div>
            <ProfileGenerator onLoadLikedProfiles={loadLikedProfiles} />
          </>
        )}
      </div>
    </div>
  )
}