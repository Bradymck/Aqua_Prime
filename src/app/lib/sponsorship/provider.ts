import { ethers } from 'ethers';
import { Provider, TransactionRequest, TransactionResponse } from '../../../types/provider';

export class SponsorshipProvider implements Provider {
  private provider: ethers.JsonRpcProvider;
  private signer: ethers.Signer;

  constructor(rpcUrl: string, privateKey: string) {
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    this.signer = new ethers.Wallet(privateKey, this.provider);
  }

  async sendTransaction(transaction: TransactionRequest): Promise<TransactionResponse> {
    try {
      return await this.signer.sendTransaction({
        to: transaction.to,
        data: transaction.data,
        value: transaction.value || '0',
        gasLimit: transaction.gasLimit ? BigInt(transaction.gasLimit) : undefined
      });
    } catch (error) {
      console.error('Transaction error:', error);
      throw new Error('Failed to send transaction');
    }
  }

  async estimateGas(transaction: TransactionRequest): Promise<bigint> {
    try {
      return await this.provider.estimateGas({
        to: transaction.to,
        data: transaction.data,
        value: transaction.value || '0'
      });
    } catch (error) {
      console.error('Gas estimation error:', error);
      throw new Error('Failed to estimate gas');
    }
  }

  async waitForTransaction(hash: string): Promise<ethers.TransactionReceipt> {
    const receipt = await this.provider.waitForTransaction(hash);
    if (!receipt) {
      throw new Error('Transaction receipt not found');
    }
    return receipt;
  }
} 