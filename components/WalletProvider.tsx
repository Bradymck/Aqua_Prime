import { ReactNode } from 'react'
import { WagmiConfig } from 'wagmi'
import { Web3Modal } from '@web3modal/wagmi/react'
import config, { projectId } from '../config/wagmi'

interface WalletProviderProps {
  children: ReactNode
}

export function WalletProvider({ children }: WalletProviderProps) {
  return (
    <WagmiConfig config={config}>
      {children}
      <Web3Modal
        projectId={projectId}
        themeMode="light"
        themeVariables={{
          '--w3m-font-family': 'Roboto, sans-serif',
          '--w3m-accent-color': '#2563eb',
          '--w3m-background-color': '#ffffff'
        }}
      />
    </WagmiConfig>
  )
}

export default WalletProvider