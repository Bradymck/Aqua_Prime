import { PersonalityTrait } from '@/types/game';
import { PERSONALITY_MODIFIERS } from '@/utils/traitConfig';

interface DialogueStyle {
  name: string;
  patterns: string[];
  emotionalRange: string[];
  vocabulary: string[];
}

interface DialoguePattern {
  style: string;
  templates: string[];
  wordChoices: Record<string, string[]>;
  emotionalMarkers: Record<string, string[]>;
}

export class DialogueStyleService {
  private static instance: DialogueStyleService | null = null;

  private constructor() {}

  public static getInstance(): DialogueStyleService {
    if (!DialogueStyleService.instance) {
      DialogueStyleService.instance = new DialogueStyleService();
    }
    return DialogueStyleService.instance;
  }

  public applyStyle(text: string, context: { style: string; emotion: string }): string {
    // Add style and emotion modifiers to the text
    const styledText = this.applyStyleModifiers(text, context.style);
    return this.applyEmotionalModifiers(styledText, context.emotion);
  }

  private applyStyleModifiers(text: string, style: string): string {
    // Implement style-specific modifications
    switch (style) {
      case 'formal':
        return text.replace(/[!?]+/g, '.').replace(/gonna/g, 'going to');
      case 'casual':
        return text;
      case 'playful':
        return text + ' 😊';
      default:
        return text;
    }
  }

  private applyEmotionalModifiers(text: string, emotion: string): string {
    // Implement emotion-specific modifications
    switch (emotion) {
      case 'happy':
        return text + ' ✨';
      case 'sad':
        return text + ' 😔';
      case 'neutral':
        return text;
      default:
        return text;
    }
  }

  private static readonly dialogueStyles: Record<string, DialogueStyle> = {
    structured: {
      name: 'structured',
      patterns: ['logical', 'analytical', 'precise'],
      emotionalRange: ['neutral', 'curious', 'focused'],
      vocabulary: ['therefore', 'consequently', 'analyze', 'determine']
    },
    flowery: {
      name: 'flowery',
      patterns: ['artistic', 'expressive', 'imaginative'],
      emotionalRange: ['passionate', 'inspired', 'dreamy'],
      vocabulary: ['beautiful', 'wonderful', 'imagine', 'create']
    },
    cryptic: {
      name: 'cryptic',
      patterns: ['mysterious', 'enigmatic', 'secretive'],
      emotionalRange: ['mysterious', 'intriguing', 'reserved'],
      vocabulary: ['perhaps', 'possibly', 'curious', 'wonder']
    },
    casual: {
      name: 'casual',
      patterns: ['friendly', 'energetic', 'playful'],
      emotionalRange: ['happy', 'excited', 'cheerful'],
      vocabulary: ['cool', 'awesome', 'fun', 'great']
    }
  };

  public static getEmotionalRangeForStyle(style: string): string[] {
    return this.dialogueStyles[style]?.emotionalRange || [];
  }

  static validateDialogueStyles(styles: string[], traits: PersonalityTrait[]): boolean {
    const validStyles = this.getValidStylesForTraits(traits);
    return styles.every(style => validStyles.includes(style));
  }

  static getValidStylesForTraits(traits: PersonalityTrait[]): string[] {
    if (!Array.isArray(traits)) {
      console.warn('Invalid traits format provided to DialogueStyleService');
      return ['casual'];
    }

    const styles = new Set<string>();
    
    traits.forEach(trait => {
      const modifier = Object.values(PERSONALITY_MODIFIERS).find(mod => 
        mod.traits.includes(trait)
      );
      if (modifier?.dialogueStyle) {
        styles.add(modifier.dialogueStyle);
      }
    });

    // If no styles were found, return casual as default
    if (styles.size === 0) {
      return ['casual'];
    }

    return Array.from(styles);
  }

  private static applyEmotionalMarkers(
    content: string, 
    pattern: DialoguePattern, 
    emotionalState: string
  ): string {
    const markers = pattern.emotionalMarkers[emotionalState] || [];
    if (markers.length === 0) return content;

    let processed = content;
    markers.forEach(marker => {
      const regex = new RegExp(`\\b${marker}\\b`, 'gi');
      processed = processed.replace(regex, `*${marker}*`);
    });

    return processed;
  }

  private static applyWordChoices(
    content: string, 
    pattern: DialoguePattern
  ): string {
    let processed = content;
    Object.entries(pattern.wordChoices).forEach(([word, choices]) => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      processed = processed.replace(regex, () => {
        return choices[Math.floor(Math.random() * choices.length)];
      });
    });

    return processed;
  }
} 