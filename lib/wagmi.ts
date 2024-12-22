import { configureChains, createConfig } from 'wagmi'
import { baseSepolia } from 'wagmi/chains'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { publicProvider } from 'wagmi/providers/public'
import { alchemyProvider } from 'wagmi/providers/alchemy'

const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID as string
const alchemyApiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY as string

if (!walletConnectProjectId) {
  throw new Error('Missing NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID')
}

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [baseSepolia],
  [
    alchemyApiKey ? alchemyProvider({ apiKey: alchemyApiKey }) : publicProvider(),
  ],
)

const config = createConfig({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new WalletConnectConnector({
      chains,
      options: {
        projectId: walletConnectProjectId,
        metadata: {
          name: 'Platypus Passions',
          description: 'Web3 Dating App for Platypus Enthusiasts',
          url: 'https://platypus-passions.com',
          icons: ['https://platypus-passions.com/logo.png']
        }
      }
    })
  ],
  publicClient,
  webSocketPublicClient
})

export { config as default, baseSepolia }