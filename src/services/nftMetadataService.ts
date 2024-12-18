import { keccak256, toUtf8Bytes } from 'ethers';
import { GeneratedTrait } from '@/types/game';
import { NFTMetadata } from '@/types/nft';

export class NFTMetadataService {
  private static instance: NFTMetadataService | null = null;

  private constructor() {}

  public static getInstance(): NFTMetadataService {
    if (!NFTMetadataService.instance) {
      NFTMetadataService.instance = new NFTMetadataService();
    }
    return NFTMetadataService.instance;
  }

  generateMetadata(trait: GeneratedTrait, imageUri: string): NFTMetadata {
    return {
      name: `ARI #${this.generateTokenId(trait.head)}`,
      description: this.generateDescription(trait),
      image: imageUri,
      attributes: [
        { trait_type: 'Head', value: trait.head },
        { trait_type: 'Power Level', value: trait.powerLevel },
        { trait_type: 'Rarity', value: trait.rarity }
      ],
      properties: {
        head: trait.head,
        personality: trait.personality,
        powerLevel: trait.powerLevel,
        rarity: trait.rarity,
        dialogueStyle: Array.isArray(trait.dialogueStyle) ? trait.dialogueStyle : [trait.dialogueStyle],
        moonstoneBonus: trait.moonstoneBonus
      }
    };
  }

  private generateDescription(trait: GeneratedTrait): string {
    return `A unique ARI with ${trait.personality.join(', ')} traits. Power level: ${trait.powerLevel}. Provides ${trait.moonstoneBonus}x moonstone bonus.`;
  }

  private generateTokenId(head: string): string {
    return keccak256(toUtf8Bytes(head)).slice(0, 16);
  }
} 