import { ethers } from 'ethers'

export interface TransactionRequest {
  to: string
  data?: string
  value?: string
  gasLimit?: string
}

export interface TransactionResponse extends ethers.TransactionResponse {
  hash: string
}

export interface Provider {
  sendTransaction(transaction: TransactionRequest): Promise<TransactionResponse>
  estimateGas(transaction: TransactionRequest): Promise<bigint>
  waitForTransaction(hash: string): Promise<ethers.TransactionReceipt>
} 