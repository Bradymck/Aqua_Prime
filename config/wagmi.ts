import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'
import { mainnet } from 'viem/chains'
import { Chain } from 'viem'

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || ''

const metadata = {
  name: 'Aqua Prime',
  description: 'Web3 Dating App',
  url: 'https://aquaprime.io',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const chains: readonly [Chain, ...Chain[]] = [mainnet]

export const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  enableWalletConnect: true,
  enableInjected: true,
  enableEIP6963: true,
  enableCoinbase: true,
})

export { projectId, chains }
export default config;