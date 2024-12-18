'use client'

import { createWeb3Modal } from '@web3modal/wagmi/react'
import { WagmiConfig } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import { config } from '@/app/config/wagmi'

// Initialize web3modal
createWeb3Modal({
  wagmiConfig: config,
  projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID || '',
  defaultChain: mainnet,
  themeMode: 'dark',
  themeVariables: {
    '--w3m-accent': '#FF69B4',
    '--w3m-color-fg-1': '#FF69B4',
    '--w3m-color-fg-2': '#FF69B4',
    '--w3m-color-fg-3': '#FF69B4',
    '--w3m-font-family': 'inherit',
    '--w3m-overlay-background-color': 'rgba(0, 0, 0, 0.7)'
  }
})

export function WalletConnectProvider({ children }: { children: React.ReactNode }) {
  return <WagmiConfig config={config}>{children}</WagmiConfig>
} 