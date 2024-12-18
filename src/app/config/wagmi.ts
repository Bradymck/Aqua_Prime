import { createConfig } from 'wagmi'
import { mainnet, arbitrum } from 'wagmi/chains'
import { createPublicClient, http } from 'viem'
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'

const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID

if (!projectId) {
  throw new Error('NEXT_PUBLIC_WC_PROJECT_ID is required but not set')
}

const metadata = {
  name: 'Platypus Passions',
  description: 'Web3 Dating App',
  url: 'https://platypus-passions.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const chains = [mainnet, arbitrum] as const

export const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  ssr: true
}) 