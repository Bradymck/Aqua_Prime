/**
 * @file ProfileGenerator.tsx
 * Component for generating new platypus profiles in the AquaPrime app.
 * Child component of PlatypusPassions that handles the profile generation process.
 *
 * Important notes:
 * - Uses useBalances hook for Moonstone token balance
 * - Requires MOONSTONE_COST tokens to generate a profile
 * - Displays balance in card with 2 decimal places
 * - Makes API call to /api/profiles/generate for profile creation
 * - Shows loading state during generation
 * - Displays generated profile with traits and image
 *
 * @requires useWallet - For wallet connection state
 * @requires useBalances - For Moonstone token balance
 * @requires ProfileGenerator API - For profile generation
 */

'use client'

import { useState } from 'react'
import { useWallet } from '@/private/hooks/useWallet'
import { useBalances } from '@/private/hooks/useBalances'
import { Button } from '../../components/ui/button'
import { Card } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { MoonstoneBalance } from '../../components/ui/MoonstoneBalance'
import { toast } from '../../components/ui/use-toast'
import Image from 'next/image'
import { Loader2 } from 'lucide-react'

interface ProfileGeneratorProps {
  onLoadLikedProfiles?: () => Promise<any>
}

export function ProfileGenerator({ onLoadLikedProfiles }: ProfileGeneratorProps) {
  const { address, isConnected } = useWallet()
  const { moonstone } = useBalances()
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedProfile, setGeneratedProfile] = useState<any>(null)
  const MOONSTONE_COST = 10

  const handleGenerateProfile = async () => {
    if (moonstone < MOONSTONE_COST) {
      toast({
        title: "Insufficient Moonstones",
        description: `You need ${MOONSTONE_COST} Moonstones to generate a profile.`,
        variant: "destructive"
      })
      return
    }

    setIsGenerating(true)
    try {
      // First generate profile data from API
      const response = await fetch('/api/profiles/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress: address,
          count: 1,
        }),
      })

      if (!response.ok) throw new Error('Failed to generate profile')

      const data = await response.json()
      const profile = data.profiles[0]

      setGeneratedProfile(profile)

      // Refresh liked profiles after generation
      if (onLoadLikedProfiles) {
        await onLoadLikedProfiles()
      }

      toast({
        title: "Profile Generated!",
        description: "Your unique Platypus profile has been created!",
      })
    } catch (error) {
      console.error('Error generating profile:', error)
      toast({
        title: "Error",
        description: "Failed to generate profile. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsGenerating(false)
    }
  }

  if (!isConnected) {
    return (
      <Card className="p-6 bg-purple-900/50 text-center">
        <p className="text-pink-200">Connect your wallet to generate a profile</p>
      </Card>
    )
  }

  return (
    <Card className="p-6 bg-purple-900/50">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-pink-400 mb-2">Generate Your Platypus Profile</h2>
        <p className="text-pink-200">Cost: {MOONSTONE_COST} 🌙</p>
        <p className="text-pink-200">Your Balance: <MoonstoneBalance /></p>
      </div>

      {generatedProfile ? (
        <div className="space-y-4">
          <div className="relative h-64 w-full rounded-lg overflow-hidden">
            <Image
              src={`/api/render-platypus?traits=${encodeURIComponent(
                JSON.stringify({
                  background: generatedProfile.nftMetadata.background,
                  skin: generatedProfile.nftMetadata.skin,
                })
              )}`}
              alt="Generated Platypus"
              fill
              className="object-cover"
            />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-white">{generatedProfile.name}</h3>
            <p className="text-pink-200">{generatedProfile.bio}</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(generatedProfile.nftMetadata).map(([trait, value]) => {
                if (typeof value === 'string') {
                  return (
                    <Badge key={trait} variant="outline" className="text-pink-400 border-pink-400">
                      {trait}: {value}
                    </Badge>
                  )
                }
                return null
              })}
            </div>
          </div>
          <Button
            className="w-full bg-pink-600 hover:bg-pink-700"
            onClick={() => setGeneratedProfile(null)}
          >
            Generate Another Profile
          </Button>
        </div>
      ) : (
        <Button
          className="w-full bg-pink-600 hover:bg-pink-700"
          onClick={handleGenerateProfile}
          disabled={isGenerating || moonstone < MOONSTONE_COST}
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            'Generate Profile'
          )}
        </Button>
      )}
    </Card>
  )
}

export default ProfileGenerator