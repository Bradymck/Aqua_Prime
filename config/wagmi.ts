import { createConfig, fallback, http } from '@wagmi/core'
import { mainnet } from '@wagmi/core/chains'
import { defaultWagmiConfig } from '@web3modal/wagmi'

// Get projectId from environment variable
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || ''

// Create wagmi config
export const config = defaultWagmiConfig({
  chains: [mainnet],
  projectId,
  metadata: {
    name: 'Aqua Prime',
    description: 'Web3 Dating App',
    url: 'https://aquaprime.io',
    icons: ['https://avatars.githubusercontent.com/u/37784886']
  }
})

export default config;