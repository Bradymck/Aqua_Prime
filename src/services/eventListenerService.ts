import { createPublicClient, http, parseAbiItem } from 'viem'
import { base, baseGoerli } from 'viem/chains'
import MoonstoneABI from '../../contracts/abi/Moonstone.json'
import AquaPrimeNFTABI from '../../contracts/abi/AquaPrimeNFT.json'
import SubscriptionABI from '../../contracts/abi/AquaPrimeSubscription.json'
import addresses from '../../addresses.json'

const client = createPublicClient({
  chain: base,
  transport: http()
})

// Event types
export interface MintEvent {
  tokenId: number
  owner: string
  timestamp: number
}

export interface BurnEvent {
  tokenId: number
  owner: string
  moonstoneReward: number
  timestamp: number
}

export interface SubscriptionEvent {
  user: string
  endTime: number
  isTrial: boolean
}

export const watchEvents = async (callback: (event: any) => void) => {
  return client.watchEvent({
    address: addresses.moonstone as `0x${string}`,
    event: parseAbiItem('event Transfer(address indexed from, address indexed to, uint256 value)'),
    onLogs: callback
  })
} 