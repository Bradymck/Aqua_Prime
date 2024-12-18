import { createConfig, configureChains } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import { http } from 'viem'

// Configure chains and providers
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet],
  [publicProvider()]
)

// Create wagmi config
export const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
}) 