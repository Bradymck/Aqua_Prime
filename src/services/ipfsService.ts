import { create } from '@web3-storage/w3up-client';
import { unixfs } from '@helia/unixfs';
import { GeneratedTrait } from './traitMixerService';
import { NFTMetadata } from '../types/nft';
import { PersonalityTrait } from '../types/game';
const Sharp = require('sharp');

export class IPFSService {
  private static instance: IPFSService;
  private client: any;

  private constructor() {
    this.client = create();
  }

  static getInstance(): IPFSService {
    if (!IPFSService.instance) {
      IPFSService.instance = new IPFSService();
    }
    return IPFSService.instance;
  }

  async initialize() {
    const space = await this.client.createSpace('your-space-name');
    await this.client.setCurrentSpace(space.did());
    await this.client.capability.access.authorize({
      access: { provider: process.env.NFT_STORAGE_KEY || '' }
    });
  }

  async uploadImage(imageBuffer: Buffer, trait: GeneratedTrait): Promise<string> {
    try {
      const optimizedBuffer = await Sharp(imageBuffer)
        .png({ quality: 85 })
        .toBuffer();

      const fs = unixfs(this.client);
      const cid = await fs.addBytes(optimizedBuffer);
      return `ipfs://${cid}`;
    } catch (error) {
      console.error('IPFS upload error:', error);
      throw new Error('Failed to upload image to IPFS');
    }
  }

  async uploadMetadata(metadata: NFTMetadata): Promise<string> {
    try {
      const fs = unixfs(this.client);
      const cid = await fs.addBytes(Buffer.from(JSON.stringify(metadata)));
      return `ipfs://${cid}`;
    } catch (error) {
      console.error('IPFS metadata upload error:', error);
      throw new Error('Failed to upload metadata to IPFS');
    }
  }

  async uploadBatch(
    traits: GeneratedTrait[], 
    images: Buffer[]
  ): Promise<{ metadataUris: string[]; imageUris: string[] }> {
    try {
      // Upload all images first
      const imagePromises = images.map((img, i) => 
        this.uploadImage(img, traits[i])
      );
      const imageUris = await Promise.all(imagePromises);

      // Generate and upload metadata for each
      const metadataPromises = traits.map((trait, i) => {
        const metadata: NFTMetadata = {
          name: `ARI #${i + 1}`,
          description: `A unique ARI with ${trait.personality.join(', ')} traits`,
          image: imageUris[i],
          attributes: [
            { trait_type: 'Head', value: trait.head },
            { trait_type: 'Power Level', value: trait.powerLevel },
            { trait_type: 'Rarity', value: trait.rarity }
          ],
          properties: {
            head: trait.head,
            personality: trait.personality.map(p => PersonalityTrait[p as keyof typeof PersonalityTrait]),
            powerLevel: trait.powerLevel,
            rarity: trait.rarity,
            dialogueStyle: Array.isArray(trait.dialogueStyle) ? trait.dialogueStyle : [trait.dialogueStyle],
            moonstoneBonus: trait.moonstoneBonus
          }
        };
        return this.uploadMetadata(metadata);
      });

      const metadataUris = await Promise.all(metadataPromises);

      return {
        metadataUris,
        imageUris
      };

    } catch (error) {
      console.error('Batch upload error:', error);
      throw new Error('Failed to upload batch to IPFS');
    }
  }

  async checkStatus(cid: string): Promise<boolean> {
    try {
      const status = await this.client.status(cid);
      return status.pin.status === 'pinned';
    } catch (error) {
      console.error('Status check error:', error);
      return false;
    }
  }
} 
