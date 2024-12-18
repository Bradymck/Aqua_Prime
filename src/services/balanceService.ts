import { ethers } from 'ethers';
import prisma from '../lib/prisma';
import { getAlchemyProvider } from '../utils/providers';
import { CoinbaseBalanceService } from './coinbaseBalanceService';

export class BalanceService {
  private static instance: BalanceService;

  private constructor() {}

  static getInstance(): BalanceService {
    if (!BalanceService.instance) {
      BalanceService.instance = new BalanceService();
    }
    return BalanceService.instance;
  }

  async getBalances(ethAddress: string) {
    const [moonstoneBalance, userProfile, coinbaseBalances] = await Promise.all([
      this.getMoonstoneBalance(ethAddress),
      this.getUserProfile(ethAddress),
      CoinbaseBalanceService.getInstance().getBalances(ethAddress)
    ]);

    return {
      moonstone: moonstoneBalance,
      sandDollars: userProfile?.sandDollars || 0,
      tokens: coinbaseBalances.tokens
    };
  }

  private async getMoonstoneBalance(address: string): Promise<string> {
    const provider = getAlchemyProvider();
    const moonstoneContract = new ethers.Contract(
      process.env.NEXT_PUBLIC_MOONSTONE_ADDRESS!,
      ['function balanceOf(address) view returns (uint256)'],
      provider
    );

    try {
      const balance = await moonstoneContract.balanceOf(address);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Error fetching Moonstone balance:', error);
      return '0';
    }
  }

  async getUserProfile(ethAddress: string) {
    const profile = await prisma.userProfile.findUnique({
      where: { ethAddress: ethAddress.toLowerCase() }
    });

    if (!profile) {
      return prisma.userProfile.create({
        data: {
          ethAddress: ethAddress.toLowerCase(),
          sandDollars: 0
        }
      });
    }

    return profile;
  }

  async addSandDollars(ethAddress: string, amount: number, description: string) {
    const profile = await this.getUserProfile(ethAddress);
    
    return prisma.$transaction([
      prisma.userProfile.update({
        where: { id: profile.id },
        data: { 
          sandDollars: { increment: amount },
          updatedAt: new Date()
        }
      }),
      prisma.balanceTransaction.create({
        data: {
          userId: profile.id,
          type: 'EARN',
          amount,
          description
        }
      })
    ]);
  }

  async spendSandDollars(ethAddress: string, amount: number, description: string) {
    const profile = await this.getUserProfile(ethAddress);

    if (profile.sandDollars < amount) {
      throw new Error('Insufficient sand dollars');
    }

    return prisma.$transaction([
      prisma.userProfile.update({
        where: { id: profile.id },
        data: {
          sandDollars: { decrement: amount },
          updatedAt: new Date()
        }
      }),
      prisma.balanceTransaction.create({
        data: {
          userId: profile.id,
          type: 'SPEND',
          amount,
          description
        }
      })
    ]);
  }

  async getTransactionHistory(ethAddress: string) {
    const profile = await this.getUserProfile(ethAddress);
    
    return prisma.balanceTransaction.findMany({
      where: { userId: profile.id },
      orderBy: { timestamp: 'desc' },
      take: 50
    });
  }
} 