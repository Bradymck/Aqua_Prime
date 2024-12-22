/**
 * @deprecated - DO NOT USE THIS FILE
 * This file is deprecated and should not be used.
 * The active version is in private/app/profile-pool/page.tsx
 */

'use client'

import { useState, useEffect } from 'react'
import { useWallet } from '@/private/hooks/useWallet'
import { Card } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import Image from 'next/image'
import { Loader2 } from 'lucide-react'
import { toast } from '@/app/components/ui/use-toast'
import Link from 'next/link'

interface Profile {
  id: string
  name: string
  bio: string
  nftMetadata: any
  totalLikes: number
  isPopular: boolean
}

export default function ProfilePool() {
  const { address } = useWallet()
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [offset, setOffset] = useState(0)
  const LIMIT = 10

  const loadProfiles = async (isFirstLoad = false) => {
    if (!address) return

    try {
      setIsLoading(true)
      const response = await fetch(`/api/profile-pool?userId=${address}&limit=${LIMIT}&offset=${isFirstLoad ? 0 : offset}`)
      if (!response.ok) throw new Error('Failed to fetch profiles')

      const data = await response.json()
      const newProfiles = Array.isArray(data?.data?.profiles) ? data.data.profiles : []

      if (isFirstLoad) {
        setProfiles(newProfiles)
        setOffset(LIMIT)
      } else {
        setProfiles(prev => [...prev, ...newProfiles])
        setOffset(prev => prev + LIMIT)
      }
    } catch (error) {
      console.error('Error loading profiles:', error)
      toast({
        title: "Error",
        description: "Failed to load profiles. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    let mounted = true

    const fetchInitialProfiles = async () => {
      if (!address) return

      try {
        setIsLoading(true)
        const response = await fetch(`/api/profile-pool?userId=${address}&limit=${LIMIT}&offset=0`)
        if (!response.ok) throw new Error('Failed to fetch profiles')

        const data = await response.json()
        const newProfiles = Array.isArray(data?.data?.profiles) ? data.data.profiles : []

        if (mounted) {
          setProfiles(newProfiles)
          setOffset(LIMIT)
        }
      } catch (error) {
        console.error('Error loading profiles:', error)
        if (mounted) {
          toast({
            title: "Error",
            description: "Failed to load profiles. Please try again.",
            variant: "destructive"
          })
        }
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    if (address) {
      fetchInitialProfiles()
    }

    return () => {
      mounted = false
    }
  }, [address])

  if (!address) {
    return (
      <Card className="max-w-md mx-auto p-6 bg-purple-900/50 text-center">
        <p className="text-gray-300">Please connect your wallet to view profiles.</p>
      </Card>
    )
  }

  if (isLoading && !profiles?.length) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-pink-400" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-black p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="w-full flex justify-between items-center">
            <Link href="/" className="text-pink-400 hover:text-pink-300">
              ← Back
            </Link>
            <h1 className="text-3xl font-bold text-white">Profile Pool</h1>
            <div className="w-[60px]"></div>
          </div>

          {profiles.length > 0 && (
            <Button
              onClick={async () => {
                try {
                  setIsLoading(true);
                  const response = await fetch('/api/profiles/generate', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ count: 5, walletAddress: address })
                  });

                  if (!response.ok) {
                    throw new Error('Failed to generate profiles');
                  }

                  toast({
                    title: "Success",
                    description: "Generated new profiles successfully!"
                  });

                  await loadProfiles(true);
                } catch (error) {
                  console.error('Error generating profiles:', error);
                  toast({
                    title: "Error",
                    description: "Failed to generate profiles. Please try again.",
                    variant: "destructive"
                  });
                } finally {
                  setIsLoading(false);
                }
              }}
              disabled={isLoading}
              size="lg"
              className="bg-pink-600 hover:bg-pink-700 text-lg py-6 px-8"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                  Generating Profiles...
                </>
              ) : (
                'Generate New Profiles'
              )}
            </Button>
          )}
        </div>

        {isLoading && !profiles.length && (
          <div className="col-span-full flex justify-center items-center">
            <Loader2 className="h-8 w-8 animate-spin text-pink-400" />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles.length > 0 ? (
            profiles.map((profile) => (
              <Card key={profile.id} className="bg-purple-900/50 p-4">
                <div className="relative h-48 w-full rounded-lg overflow-hidden mb-4">
                  <Image
                    src={`/api/render-platypus?traits=${encodeURIComponent(
                      JSON.stringify({
                        background: profile.nftMetadata?.background,
                        skin: profile.nftMetadata?.skin,
                      })
                    )}`}
                    alt={profile.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <h3 className="text-xl font-semibold text-white mb-2">{profile.name}</h3>
                <p className="text-gray-300 text-sm mb-4 line-clamp-3">{profile.bio}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-pink-400">❤️ {profile.totalLikes || 0}</span>
                    {profile.isPopular && (
                      <span className="bg-pink-600 text-white text-xs px-2 py-1 rounded">Popular</span>
                    )}
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-full">
              <Card className="max-w-md mx-auto p-6 bg-purple-900/50 text-center">
                <p className="text-gray-300 mb-4">Dive into the world of Platypus Passions! Generate your first batch of unique platypus profiles and start your dating adventure. 🦆✨</p>
                <Button
                  onClick={async () => {
                    try {
                      setIsLoading(true);
                      const response = await fetch('/api/profiles/generate', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ count: 5, walletAddress: address })
                      });

                      if (!response.ok) {
                        throw new Error('Failed to generate profiles');
                      }

                      toast({
                        title: "Success",
                        description: "Generated new profiles successfully!"
                      });

                      await loadProfiles(true);
                    } catch (error) {
                      console.error('Error generating profiles:', error);
                      toast({
                        title: "Error",
                        description: "Failed to generate profiles. Please try again.",
                        variant: "destructive"
                      });
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                  disabled={isLoading}
                  size="lg"
                  className="bg-pink-600 hover:bg-pink-700 text-lg py-6 px-8"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                      Generating Profiles...
                    </>
                  ) : (
                    'Generate Profiles'
                  )}
                </Button>
              </Card>
            </div>
          )}
        </div>

        {profiles.length > 0 && (
          <div className="mt-8 text-center">
            <Button
              onClick={() => loadProfiles(false)}
              disabled={isLoading}
              className="bg-pink-600 hover:bg-pink-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                'Load More'
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}