import { ReactNode, useEffect } from 'react'
import { WagmiConfig } from 'wagmi'
import config from '../config/wagmi'
import { initializeWeb3Modal } from '../lib/web3modal'

// Initialize web3modal outside of component
initializeWeb3Modal()

interface WalletProviderProps {
  children: ReactNode
}

export function WalletProvider({ children }: WalletProviderProps) {
  return (
    <WagmiConfig config={config}>
      {children}
    </WagmiConfig>
  )
}

export default WalletProvider