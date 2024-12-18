'use client'

import { ReactNode } from 'react'
import { Toaster } from '@/components/ui/toast'
import { WagmiProvider } from './providers/WagmiProvider'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <WagmiProvider>
      {children}
      <Toaster />
    </WagmiProvider>
  )
} 