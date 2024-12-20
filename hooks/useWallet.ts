import { useEffect } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { useWeb3Modal } from '@web3modal/wagmi/react'

export function useWallet() {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()
  const { open } = useWeb3Modal()

  useEffect(() => {
    // Handle initial connection
    if (!isConnected) {
      console.log('Wallet not connected')
    }
  }, [isConnected])

  const handleConnect = async () => {
    try {
      await open()
    } catch (error) {
      console.error('Failed to connect wallet:', error)
    }
  }

  const handleDisconnect = async () => {
    try {
      await disconnect()
    } catch (error) {
      console.error('Failed to disconnect wallet:', error)
    }
  }

  return {
    address,
    isConnected,
    connect: handleConnect,
    disconnect: handleDisconnect
  }
}

export default useWallet