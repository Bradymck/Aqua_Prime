import { createConfig } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { createPublicClient, http } from 'viem'

const publicClient = createPublicClient({
  chain: mainnet,
  transport: http()
})

export const config = createConfig({
  autoConnect: true,
  publicClient
})

export const chains = [mainnet, sepolia] as const
