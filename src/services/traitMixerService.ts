import { PersonalityTrait, RarityTier, Trait, Character, HeadType } from '../types/game';
import { TraitGenerationService } from './traitGenerationService';

type TraitType = 'skin' | 'head' | 'clothes' | 'eyes' | 'bill' | 'feet' | 'background';

export interface GeneratedTrait {
    head: HeadType;
    personality: PersonalityTrait[];
    powerLevel: number;
    rarity: RarityTier;
    dialogueStyle: string | string[];
    moonstoneBonus: number;
}

export class TraitMixerService {
  private readonly generator: TraitGenerationService;

  constructor() {
    this.generator = TraitGenerationService.getInstance();
  }

  mixTraits(character: Character): Character {
    const mixedTraits = this.performTraitMixing(character.traits);
    
    // Ensure all required traits exist
    const validatedTraits = this.validateTraits(mixedTraits);
    
    // Convert Record<string, Trait> to GeneratedProfile traits format
    const generatedTraits = {
      skin: validatedTraits.skin.value || 'default',
      head: validatedTraits.head.value as HeadType || 'Basic',
      clothes: validatedTraits.clothes.value || 'default',
      eyes: validatedTraits.eyes.value || 'default',
      bill: validatedTraits.bill.value || 'default',
      feet: validatedTraits.feet.value || 'default',
      background: validatedTraits.background.value || 'default'
    };

    // Validate head type before generating profile
    if (!this.isValidHeadType(generatedTraits.head)) {
      throw new Error(`Invalid head type: ${generatedTraits.head}`);
    }

    const generated = this.generator.generateProfile({
      traits: generatedTraits,
      personality: this.extractPersonalityTraits(validatedTraits),
      rarity: this.calculateRarity(validatedTraits)
    });

    return {
      ...character,
      traits: validatedTraits,
      unlockedTraits: character.unlockedTraits
    };
  }

  private performTraitMixing(traits: Record<string, Trait>): Record<string, Trait> {
    // Implement trait mixing logic
    return traits;
  }

  private validateTraits(traits: Record<string, Trait | undefined>): Record<string, Trait> {
    const validatedTraits: Record<string, Trait> = {};
    
    // Ensure all required traits exist with default values if missing
    const requiredTraits: TraitType[] = ['skin', 'head', 'clothes', 'eyes', 'bill', 'feet', 'background'];
    
    for (const traitKey of requiredTraits) {
      if (!traits[traitKey]) {
        validatedTraits[traitKey] = this.getDefaultTrait(traitKey);
      } else {
        validatedTraits[traitKey] = traits[traitKey]!;
      }
    }

    return validatedTraits;
  }

  private getDefaultTrait(traitType: TraitType): Trait {
    return {
      type: traitType,
      name: 'Simple',
      image: `/assets/${traitType}/Simple.png`,
      rarity: 'Common' as RarityTier,
      moonstoneBonus: 1,
      value: traitType === 'head' ? HeadType.Basic : 'Simple' as PersonalityTrait
    };
  }

  private isValidHeadType(head: string): head is HeadType {
    return Object.values(HeadType).includes(head as HeadType);
  }

  private extractPersonalityTraits(traits: Record<string, Trait>): PersonalityTrait[] {
    // Implement personality trait extraction logic
    return [];
  }

  private calculateRarity(traits: Record<string, Trait>): RarityTier {
    // Implement rarity calculation logic
    return 'Common';
  }
} 