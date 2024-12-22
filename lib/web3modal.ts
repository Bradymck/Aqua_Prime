import { createWeb3Modal } from '@web3modal/wagmi/react'
import config, { projectId, baseSepoliaChain } from '../config/wagmi'

let initialized = false

export function initializeWeb3Modal() {
  if (typeof window !== 'undefined' && !initialized) {
    createWeb3Modal({
      wagmiConfig: config,
      projectId,
      defaultChain: baseSepoliaChain,
      chains: [baseSepoliaChain],
      featuredWalletIds: [],
      includeWalletIds: [],
      themeMode: 'dark',
      themeVariables: {
        '--w3m-accent': '#4F46E5',
        '--w3m-border-radius-master': '4px'
      }
    })
    initialized = true
  }
}

export function isWeb3ModalInitialized() {
  return initialized
}