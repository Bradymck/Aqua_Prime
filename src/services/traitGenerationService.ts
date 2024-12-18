import { PersonalityTrait, RarityTier, HeadType, GeneratedProfile, Trait } from '../types/game';
import { TRAIT_CATEGORIES, PERSONALITY_MODIFIERS, RARITY_TIERS } from '../utils/traitConfig';
import { ValidationRules } from './validationRules';
import { RarityService } from './rarityService';
import { DialogueStyleService } from './dialogueStyleService';
import OpenAI from 'openai';

let openai: OpenAI | null = null;

if (typeof process.env.OPENAI_API_KEY === 'string' && process.env.OPENAI_API_KEY.length > 0) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

export class TraitGenerationService {
  private static instance: TraitGenerationService;
  private traitCategories: Record<string, string[]>;

  private constructor() {
    // Initialize trait categories based on asset folder structure
    this.traitCategories = {
      background: [
        'beach', 'blue_ka_pow', 'blue_spiral', 'blue_zoom', 'great_wave',
        'green', 'green_spiral', 'grey_marble', 'luminous', 'magenta_marble',
        'mspaint', 'ocean_marble', 'orange', 'pink', 'pink_zoom',
        'purple_ka_pow', 'red_spiral', 'studio', 'system_error', 'vapor_wave',
        'white', 'white_zoom'
      ],
      skin: [
        'blue_foundation', 'brown', 'burnt', 'checkers', 'clear',
        'confetti', 'cooked', 'cosmic', 'dark_purple', 'erased',
        'gold', 'infected', 'lines', 'navy', 'pink_spotted',
        'purple', 'rock', 'royal_blue', 'royal_purple', 'scribble',
        'trippy', 'zombie_skin'
      ],
      clothes: [
        'anarchy', 'aqua_hoodie', 'aqua_man', 'awoken', 'baker',
        'cloud_raincoat', 'dancer', 'dark_cloud', 'detective', 'eth_hoodie',
        'factory_manager', 'feels_good', 'fry_manager', 'galactic', 'gold_nipple_rings',
        'green_hoodie', 'howdy', 'inmate', 'kelvin_klein', 'kimono',
        'martial_arts', 'mental_patient', 'nipple_ring', 'nipple_rings', 'orange_raincoat',
        'painter', 'pink_slav', 'sharted', 'slav_suite', 'smug_prep',
        'speed_doh', 'stream_tide', 'stripper', 'supa_suit', 'super_spam',
        'supersuitroadconewarrior', 'supervisor', 'tan_hoodie', 'the_bools', 'the_seltiks',
        'typical_tiktoker', 'typical_x', 'wannabe', 'white_cloud', 'white_slav',
        'yeehaw', 'yellow_raincoat'
      ],
      eyes: [
        'apathetic', 'crazy', 'cyborg', 'dead', 'evil',
        'love', 'mad', 'oni', 'sad', 'scared',
        'shock', 'sneaky', 'snek', 'stare', 'suspicious',
        'targets'
      ],
      bill: [
        'cyborg', 'fangs', 'grit', 'lipstick', 'nervous',
        'pascifier', 'relaxed', 'smoking', 'spikes', 'sucker',
        'teeth', 'tongue'
      ],
      head: [
        '3d_glasses', '3d_greaser', '8_bit_shades', 'anti_jason', 'black_cowboy',
        'blue_beats', 'blue_hat', 'brown_mohawk', 'clown', 'clown_wig',
        'cowboy', 'devil_horns', 'evil_clown', 'fast_food', 'fast_food_goggles',
        'frog_bucket_hat', 'gizmo', 'goggles', 'goggles_and_mohawk', 'gold_combover',
        'gold_horn', 'gold_slick', 'gold_swirl', 'green_mohawk', 'green_slicked',
        'grey_combover', 'horn', 'jason', 'messy_hair_hat', 'monocle',
        'neko_mask', 'newsboy', 'newsboy_monocle', 'old_red', 'old_white',
        'oni_mask', 'pink_cap', 'pink_hat', 'plague_mask', 'purple_cap',
        'red_beats', 'red_mohawk', 'roadcone', 'rose_plague_mask', 'shades',
        'sherlock', 'spiky_black', 'spiky_gold', 'spiky_pink', 'spiky_red',
        'third_eye', 'tin_foil', 'unibeats', 'valkyrie', 'viking',
        'witch_hat', 'wizard_hat'
      ],
      feet: [
        'black_boots', 'black_sneakers', 'blue_cowboy', 'blue_leather', 'blue_robo',
        'blue_sneakers', 'blue_space', 'boots', 'cowboy', 'daruma_doll',
        'eeezy', 'geta', 'green_robo', 'maneki_neko', 'old_leather',
        'pink_boots', 'purple_shoes', 'red_sneakers', 'stinky', 'white_boots',
        'white_shoes', 'yellow_space'
      ],
      lefthand: [
        'basketball', 'black_bracelet', 'brush', 'cactus', 'football',
        'glow_stick', 'mjollnir', 'plushie', 'red_bracelet', 'sheild',
        'tp', 'wand', 'watch', 'water'
      ],
      righthand: [
        'black_bracelet', 'controller', 'frogcicle', 'glow_stick', 'gun',
        'hook', 'memory_ring', 'mic', 'pallete', 'phone',
        'pickle', 'pizza', 'racket', 'red_bracelet', 'spatula',
        'spike_bat', 'squirt_gun', 'strawberry_icecream', 'sword', 'wine'
      ],
      tail: [
        'android', 'apple', 'azure_furry', 'black_fist', 'bone',
        'bones', 'emerald_hydra', 'fist', 'general_tso', 'green',
        'green_fist', 'medusa', 'murica', 'pika', 'pink_fist',
        'red_devil', 'reptile', 'ruby_furry', 'sapphire_hydra', 'silver_fist',
        'skull_bone', 'stinger', 'sunrise', 'tails', 'typical',
        'white'
      ]
    };
  }

  public static getInstance(): TraitGenerationService {
    if (!this.instance) {
      this.instance = new TraitGenerationService();
    }
    return this.instance;
  }

  private async generateAIBackstory(profile: GeneratedProfile): Promise<string> {
    if (!openai) {
      return this.generateFallbackBackstory(profile);
    }

    try {
      const personalityTraits = profile.personality?.traits || [];
      const prompt = `Generate a creative backstory for a platypus NFT character with the following traits:
      - Personality: ${personalityTraits.join(', ')}
      - Alignment: ${profile.alignment}
      - Rarity: ${profile.rarity}`;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{
          role: "system",
          content: "You are a creative writer tasked with generating brief, engaging backstories for NFT characters in a tongue-in-cheek dating app. The backstories should be 2-3 sentences long and incorporate the character's traits in a natural way."
        }, {
          role: "user",
          content: prompt
        }],
        max_tokens: 150
      });

      return response.choices[0].message.content || this.generateFallbackBackstory(profile);
    } catch (error) {
      console.error('Error generating AI backstory:', error);
      return this.generateFallbackBackstory(profile);
    }
  }

  private generateFallbackBackstory(profile: GeneratedProfile): string {
    const personalityTraits = profile.personality?.traits || [];
    const templates = [
      `A ${profile.rarity?.toLowerCase() || 'mysterious'} platypus with ${personalityTraits.join(' and ') || 'unique'} tendencies.`,
      `This ${profile.alignment || 'enigmatic'} platypus embodies ${personalityTraits.join(', ') || 'mystery'}, making them a unique ${profile.rarity?.toLowerCase() || 'specimen'}.`,
      `A mysterious figure with ${personalityTraits.join(' and ') || 'intriguing'} traits.`
    ];
    return templates[Math.floor(Math.random() * templates.length)];
  }

  private selectRandomTrait(category: string): string {
    const validTraits = this.traitCategories[category];
    if (!validTraits || !Array.isArray(validTraits) || validTraits.length === 0) {
      console.warn(`Invalid trait category: ${category}`);
      return 'default';
    }
    return validTraits[Math.floor(Math.random() * validTraits.length)];
  }

  private generatePersonalityTraits(): PersonalityTrait[] {
    const availableTraits = Object.values(PERSONALITY_MODIFIERS).flatMap(mod => mod.traits);
    const selectedTraits = [];
    
    // Always select at least one trait
    if (availableTraits.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableTraits.length);
      selectedTraits.push(availableTraits[randomIndex]);
    }

    // Add 1-2 more random traits
    const additionalTraitsCount = Math.floor(Math.random() * 2) + 1;
    for (let i = 0; i < additionalTraitsCount && availableTraits.length > selectedTraits.length; i++) {
      let trait;
      do {
        trait = availableTraits[Math.floor(Math.random() * availableTraits.length)];
      } while (selectedTraits.includes(trait));
      selectedTraits.push(trait);
    }

    return selectedTraits as PersonalityTrait[];
  }

  private generateAlignment(): string {
    const alignments = ['whitehat', 'greyhat', 'blackhat'];
    return alignments[Math.floor(Math.random() * alignments.length)];
  }

  public async generateProfile(options: ProfileGenerationOptions = {}): Promise<GeneratedProfile> {
    const traits = {
      head: options.preferredTraits?.find(t => t.startsWith('head_')) || this.selectRandomTrait('head'),
      skin: options.preferredTraits?.find(t => t.startsWith('skin_')) || this.selectRandomTrait('skin'),
      clothes: options.preferredTraits?.find(t => t.startsWith('clothes_')) || this.selectRandomTrait('clothes'),
      eyes: options.preferredTraits?.find(t => t.startsWith('eyes_')) || this.selectRandomTrait('eyes'),
      bill: options.preferredTraits?.find(t => t.startsWith('bill_')) || this.selectRandomTrait('bill'),
      feet: options.preferredTraits?.find(t => t.startsWith('feet_')) || this.selectRandomTrait('feet'),
      background: options.preferredTraits?.find(t => t.startsWith('bg_')) || this.selectRandomTrait('background'),
    };

    const personalityTraits = this.generatePersonalityTraits();
    const personality = {
      traits: personalityTraits,
      mbti: options.preferredMBTI || 'INTP'
    };

    // Convert traits object to array format for RarityService
    const traitsArray = Object.entries(traits).map(([category, value]) => ({
      category,
      value: value.toString()
    }));

    const rarity = options.preferredRarity || RarityService.calculateFromTraits(traitsArray);
    const dialogueStyle = DialogueStyleService.getValidStylesForTraits(personalityTraits)[0] || 'casual';
    const alignment = options.preferredAlignment || this.generateAlignment();

    return {
      traits,
      personality,
      rarity,
      dialogueStyle,
      alignment,
      powerLevel: this.calculatePowerLevel(rarity),
      moonstoneBonus: this.calculateMoonstoneBonus(rarity)
    };
  }

  private calculatePowerLevel(rarity: number): number {
    const basePower = Math.floor(Math.random() * 51) + 50;
    return Math.floor(basePower * rarity);
  }

  private calculateMoonstoneBonus(rarity: number): number {
    return Number(rarity.toFixed(1));
  }
}