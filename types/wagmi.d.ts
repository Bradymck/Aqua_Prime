declare module 'wagmi' {
  import type { Config } from '@wagmi/core'
  export * from '@wagmi/core'
  
  export function WagmiConfig(props: {
    children: React.ReactNode
    config: Config
  }): JSX.Element
  
  export function useAccount(): {
    address?: `0x${string}`
    isConnected: boolean
  }
  
  export function useConnect(): {
    connect: (args: { connector: any }) => Promise<void>
  }
  
  export function useDisconnect(): {
    disconnect: () => void
  }

  export function useContractWrite(config: {
    address: `0x${string}`,
    abi: any[],
    functionName: string
  }): {
    writeAsync: (args?: { args: any[] }) => Promise<{ hash: string; wait(): Promise<any> }>
  }
} 