import { Character, PersonalityTrait } from '../types/game';
import { BaseService, ServiceConfig, ServiceStatus } from './core/BaseService';

export class TraitMixingService extends BaseService {
  private static instance: TraitMixingService;
  private unlockRequirements: Record<string, {
    moonstone: number;
    chatCount: number;
    callCount: number;
  }>;

  private constructor() {
    super({ name: 'TraitMixingService' });
    this.unlockRequirements = {
      'Clothes/Detective.png': { moonstone: 100, chatCount: 10, callCount: 5 },
      'Clothes/Howdy.png': { moonstone: 200, chatCount: 20, callCount: 10 },
      // Add more trait requirements as needed
    };
  }

  public static getInstance(): TraitMixingService {
    if (!TraitMixingService.instance) {
      TraitMixingService.instance = new TraitMixingService();
    }
    return TraitMixingService.instance;
  }

  public checkUnlockRequirements(
    character: Character,
    moonstoneBalance: number,
    chatCount: number,
    callCount: number
  ): string[] {
    const unlockedTraits = new Set(character.unlockedTraits);
    const availableUnlocks: string[] = [];

    Object.entries(this.unlockRequirements).forEach(([traitPath, requirements]) => {
      if (!unlockedTraits.has(traitPath) &&
          moonstoneBalance >= requirements.moonstone &&
          chatCount >= requirements.chatCount &&
          callCount >= requirements.callCount) {
        availableUnlocks.push(traitPath);
      }
    });

    return availableUnlocks;
  }

  public applyTrait(character: Character, traitPath: string): Character {
    if (!this.unlockRequirements[traitPath]) {
      throw new Error(`Invalid trait path: ${traitPath}`);
    }

    return {
      ...character,
      unlockedTraits: [...character.unlockedTraits, traitPath],
      traits: {
        ...character.traits,
        [traitPath.split('/')[0].toLowerCase()]: traitPath
      }
    };
  }

  async initialize(): Promise<void> {
    // Implementation
  }

  async healthCheck(): Promise<ServiceStatus> {
    return {
      status: 'healthy',
      timestamp: Date.now(),
      details: {
        // Add relevant trait mixing service details
      }
    };
  }

  generateInitialTraits(): Record<string, any> {
    // Return an object with initial traits
    return {
      // Add your trait categories and values here
      personality: { name: 'Friendly' },
      appearance: { name: 'Cute' },
      // ... other traits
    };
  }
} 