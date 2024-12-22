import { useEffect, useState, useCallback } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { isWeb3ModalInitialized } from '../lib/web3modal'

export function useWallet() {
  const { address, isConnected, connector } = useAccount()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()
  const [isReady, setIsReady] = useState(false)
  const web3Modal = isWeb3ModalInitialized() ? useWeb3Modal() : null

  const initializeWallet = useCallback(async () => {
    if (isConnected && connector) {
      try {
        const provider = await connector.getProvider()
        if (provider) {
          await provider.request({ method: 'eth_requestAccounts' })
          setIsReady(true)
        }
      } catch (error) {
        console.error('Failed to initialize wallet:', error)
        setIsReady(false)
      }
    } else {
      setIsReady(false)
    }
  }, [isConnected, connector])

  useEffect(() => {
    initializeWallet()
  }, [initializeWallet])

  const handleConnect = useCallback(async () => {
    try {
      if (web3Modal) {
        await web3Modal.open()
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error)
      setIsReady(false)
    }
  }, [web3Modal])

  const handleDisconnect = useCallback(async () => {
    try {
      await disconnect()
      setIsReady(false)
    } catch (error) {
      console.error('Failed to disconnect wallet:', error)
    }
  }, [disconnect])

  return {
    address,
    isConnected,
    isReady,
    connect: handleConnect,
    disconnect: handleDisconnect
  }
}

export default useWallet