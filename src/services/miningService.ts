import { PrismaClient, Player, Coordinate, CoordinateMemory } from '@prisma/client';
import { ethers } from 'ethers';
import { getAlchemyProvider } from '@/utils/providers';

export class MiningService {
  private static instance: MiningService;
  private prisma: PrismaClient;

  private constructor() {
    this.prisma = new PrismaClient();
  }

  static getInstance(): MiningService {
    if (!MiningService.instance) {
      MiningService.instance = new MiningService();
    }
    return MiningService.instance;
  }

  async addVoiceSession(playerId: number, x: number, y: number, transcript: string, summary: string) {
    const coordinate = await this.prisma.coordinate.findFirst({
      where: { x, y },
      include: { 
        memories: {
          orderBy: { timestamp: 'desc' },
          take: 3
        }
      }
    });

    if (!coordinate) throw new Error('Coordinate not found');

    // Start transaction with proper typing
    await this.prisma.$transaction(async (prisma) => {
      // Add new memory
      await prisma.coordinateMemory.create({
        data: {
          coordinateId: coordinate.id,
          playerId,
          transcript,
          summary
        }
      });

      // Get latest 3 memories for this coordinate after adding new one
      const latestMemories = await prisma.coordinateMemory.findMany({
        where: { coordinateId: coordinate.id },
        orderBy: { timestamp: 'desc' },
        take: 3
      });

      // Check if all 3 latest memories belong to this player
      const allBelongToPlayer = latestMemories.length === 3 && 
        latestMemories.every(m => m.playerId === playerId);

      // If player owns all 3 slots, they get mining rights
      if (allBelongToPlayer) {
        // First stop any existing mining operations on this coordinate
        if (coordinate.ownerId && coordinate.ownerId !== playerId) {
          await this.stopMining(coordinate.ownerId, coordinate.id);
        }

        // Start mining for new owner
        await prisma.coordinate.update({
          where: { id: coordinate.id },
          data: {
            ownerId: playerId,
            miningStart: new Date(),
            lastMined: new Date()
          }
        });

        // Start mining rewards
        await this.startMining(playerId, coordinate.id);
      }
      // If they don't have all 3 slots, they can't mine
      else if (coordinate.ownerId === playerId) {
        // Stop mining if they lost control
        await this.stopMining(playerId, coordinate.id);
        
        // Remove ownership
        await prisma.coordinate.update({
          where: { id: coordinate.id },
          data: {
            ownerId: null,
            miningStart: null,
            lastMined: null
          }
        });
      }
    });
  }

  private async startMining(playerId: number, coordinateId: number) {
    const player = await this.prisma.player.findUnique({
      where: { id: playerId },
      include: { ownedSpaces: true }
    });

    if (!player?.ethAddress) throw new Error('Player ETH address not found');

    // Calculate mining rate (could be based on various factors)
    const miningRate = this.calculateMiningRate(player);

    // Start periodic mining rewards
    await this.prisma.player.update({
      where: { id: playerId },
      data: {
        miningRate: { increment: miningRate }
      }
    });

    // Record mining start
    await this.prisma.miningHistory.create({
      data: {
        playerId,
        coordinateId,
        amount: 0, // Initial record
        timestamp: new Date()
      }
    });
  }

  private async stopMining(playerId: number, coordinateId: number) {
    const player = await this.prisma.player.findUnique({
      where: { id: playerId }
    });

    if (!player) return;

    // Record final mining amount before stopping
    await this.checkAndDistributeMiningRewards(playerId, coordinateId);

    // Stop mining
    await this.prisma.player.update({
      where: { id: playerId },
      data: {
        miningRate: { decrement: player.miningRate }
      }
    });
  }

  private async checkAndDistributeMiningRewards(playerId: number, coordinateId: number) {
    const player = await this.prisma.player.findUnique({
      where: { id: playerId }
    });

    if (!player || player.miningRate === 0) return;

    const now = new Date();
    const hoursSinceLastCheck = (now.getTime() - player.lastMiningCheck.getTime()) / (1000 * 60 * 60);
    const moonstoneEarned = player.miningRate * hoursSinceLastCheck;

    if (moonstoneEarned > 0) {
      // Record mining rewards
      await this.prisma.miningHistory.create({
        data: {
          playerId,
          coordinateId,
          amount: moonstoneEarned,
          timestamp: now
        }
      });

      // Update player's stats
      await this.prisma.player.update({
        where: { id: playerId },
        data: {
          moonstoneMined: { increment: moonstoneEarned },
          lastMiningCheck: now
        }
      });

      // Mint moonstone tokens
      await this.mintMoonstone(player.ethAddress, moonstoneEarned);
    }
  }

  private calculateMiningRate(player: Player & { ownedSpaces: Coordinate[] }): number {
    // Base rate of 1 moonstone per hour
    let rate = 1;
    return rate;
  }

  private async mintMoonstone(address: string, amount: number) {
    const provider = getAlchemyProvider();
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
    
    const moonstoneContract = new ethers.Contract(
      process.env.NEXT_PUBLIC_MOONSTONE_ADDRESS!,
      ['function mint(address to, uint256 amount)'],
      signer
    );

    try {
      const tx = await moonstoneContract.mint(address, ethers.parseEther(amount.toString()));
      await tx.wait();
    } catch (error) {
      console.error('Error minting moonstone:', error);
      throw error;
    }
  }
} 