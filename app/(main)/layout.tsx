'use client'

import { useWallet } from '@/private/hooks/useWallet'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isConnected, connect } = useWallet()

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
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
    <div className="p-4">
      <nav className="max-w-4xl mx-auto mb-8">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-3xl font-bold text-white">
            Platypus Passions
          </Link>
          <div className="flex space-x-4">
            <Link href="/" passHref>
              <Button variant="ghost" className="text-pink-400 hover:text-pink-300">
                Generate
              </Button>
            </Link>
            <Link href="/profile-pool" passHref>
              <Button variant="ghost" className="text-pink-400 hover:text-pink-300">
                Profile Pool
              </Button>
            </Link>
          </div>
        </div>
      </nav>
      <div className="max-w-4xl mx-auto">
        {children}
      </div>
    </div>
  )
}