import { createPublicClient, http } from 'viem'
import { mainnet } from 'wagmi/chains'

export const publicClient = createPublicClient({
  chain: mainnet,
  transport: http()
}) 