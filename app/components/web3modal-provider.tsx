'use client'

import { createWeb3Modal } from '@web3modal/wagmi'
import { config, projectId } from '../../config/wagmi'
import { useEffect, useRef } from 'react'

export function Web3ModalProvider() {
  const initialized = useRef(false)

  useEffect(() => {
    if (!initialized.current) {
      createWeb3Modal({
        wagmiConfig: config,
        projectId,
        themeMode: 'dark',
        themeVariables: {
          '--w3m-accent': '#8B5CF6'
        }
      })
      initialized.current = true
    }
  }, [])

  return null
}