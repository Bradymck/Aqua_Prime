import { createConfig } from 'wagmi'
import { type Chain } from 'viem'
import { baseSepolia } from 'wagmi/chains'
import { defaultWagmiConfig } from '@web3modal/wagmi/react'
import { http } from 'viem'

// Configure Base Sepolia chain
const baseSepoliaChain = {
  id: 84532,
  name: 'Base Sepolia',
  network: 'base-sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    public: { http: ['https://sepolia.base.org'] },
    default: { http: ['https://sepolia.base.org'] },
  },
  blockExplorers: {
    default: { name: 'BaseScan', url: 'https://sepolia.basescan.org' },
  },
  testnet: true,
} as const;

// Get WalletConnect Project ID from environment variable
export const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID

// Debug logging
console.log('Environment variables:', {
  NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
  NODE_ENV: process.env.NODE_ENV
});

if (!projectId) {
  throw new Error('Missing NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID')
}

const metadata = {
  name: 'Aqua Prime',
  description: 'Web3/NFT-based dating app with platypus characters',
  url: 'https://aquaprime.io',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

// Create wagmi config with Web3Modal
export const config = defaultWagmiConfig({
  chains: [baseSepoliaChain],
  projectId,
  metadata,
  transports: {
    [baseSepoliaChain.id]: http('https://sepolia.base.org')
  }
})

export { baseSepoliaChain }
export default config;