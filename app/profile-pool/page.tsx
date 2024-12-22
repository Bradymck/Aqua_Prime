/**
 * @deprecated - DO NOT USE THIS FILE
 * This file is deprecated and should not be used.
 * The active version is in private/app/profile-pool/page.tsx
 */

'use client'

import { useState, useEffect } from 'react'
import { usePrivy, PrivyUser } from '@privy-io/react-auth'
import { Card } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { Loader2 } from 'lucide-react'
import { toast } from '@/app/components/ui/use-toast'
import Link from 'next/link'

interface Profile {
  id: string;
  name: string;
  bio: string;
}

export default function ProfilePool() {
  const { user, authenticated, login } = usePrivy()
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProfiles = async () => {
    if (!user?.wallet?.address) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/profile-pool?userId=${user.wallet.address}`);
      if (!response.ok) throw new Error('Failed to fetch profiles');

      const data = await response.json();
      setProfiles(data?.data?.profiles || []);
    } catch (error) {
      console.error('Error fetching profiles:', error);
      toast({
        title: "Error",
        description: "Failed to load profiles. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authenticated && user?.wallet?.address) {
      fetchProfiles();
    }
  }, [authenticated, user?.wallet?.address]);

  if (!authenticated) {
    return (
      <Card className="max-w-md mx-auto p-6 bg-purple-900/50 text-center">
        <p className="text-gray-300">Please connect your wallet to view profiles.</p>
        <Button onClick={login} className="mt-4 bg-pink-600 hover:bg-pink-700">
          Connect Wallet
        </Button>
      </Card>
    );
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

          {(!profiles || profiles.length === 0) && !loading && (
            <Card className="max-w-md mx-auto p-6 bg-purple-900/50 text-center">
              <p className="text-gray-300 mb-4">Dive into the world of Platypus Passions! Generate your first batch of unique platypus profiles and start your dating adventure. 🦆✨</p>
              <Button
                onClick={async () => {
                  try {
                    setLoading(true);
                    const response = await fetch('/api/profile-pool', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json'
                      },
                      body: JSON.stringify({ count: 5, walletAddress: user?.wallet?.address })
                    });

                    if (!response.ok) {
                      throw new Error('Failed to generate profiles');
                    }

                    toast({
                      title: "Success",
                      description: "Generated new profiles successfully!"
                    });

                    await fetchProfiles();
                  } catch (error) {
                    console.error('Error generating profiles:', error);
                    toast({
                      title: "Error",
                      description: "Failed to generate profiles. Please try again.",
                      variant: "destructive"
                    });
                  } finally {
                    setLoading(false);
                  }
                }}
                disabled={loading}
                size="lg"
                className="bg-pink-600 hover:bg-pink-700 text-lg py-6 px-8"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                    Generating Profiles...
                  </>
                ) : (
                  'Generate Profiles'
                )}
              </Button>
            </Card>
          )}
        </div>

        {error && <div className="text-center text-red-500 mb-4">{error}</div>}

        {loading && !profiles.length && (
          <div className="flex justify-center items-center">
            <Loader2 className="h-8 w-8 animate-spin text-pink-400" />
          </div>
        )}

        {profiles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profiles.map((profile) => (
              <Card key={profile.id} className="bg-purple-900/50 p-4">
                <h3 className="text-xl font-semibold text-white mb-2">{profile.name}</h3>
                <p className="text-gray-300 text-sm mb-4 line-clamp-3">{profile.bio}</p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}