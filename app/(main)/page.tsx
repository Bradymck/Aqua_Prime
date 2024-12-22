'use client'

import { useWallet } from '@/private/hooks/useWallet'
import { useBalances } from '@/private/hooks/useBalances'
import { MoonstoneBalance } from '@/components/ui/MoonstoneBalance'
import { ProfileGenerator } from '@/components/ProfileGenerator/ProfileGenerator'

export default function Home() {
  const { address } = useWallet()

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

  return (
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
  )
}