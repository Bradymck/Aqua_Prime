import { createConfig } from 'wagmi'
import { type Chain, createPublicClient, http } from 'viem'
import { baseSepolia } from 'wagmi/chains'

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

export const config = createConfig({
  chains: [baseSepoliaChain],
  transports: {
    [baseSepoliaChain.id]: http()
  }
})

export { baseSepoliaChain }
export default config;