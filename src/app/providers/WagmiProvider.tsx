'use client'

import { type ReactNode } from 'react'
import { WagmiConfig } from 'wagmi'
import { config } from '../config/wagmi'

interface WagmiProviderProps {
  children: ReactNode
}

export function WagmiProvider({ children }: WagmiProviderProps) {
  return <WagmiConfig config={config}>{children}</WagmiConfig>
}
