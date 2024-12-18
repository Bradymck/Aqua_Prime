export enum PersonalityTrait {
  FRIENDLY = 'FRIENDLY',
  MYSTERIOUS = 'MYSTERIOUS',
  PLAYFUL = 'PLAYFUL',
  SERIOUS = 'SERIOUS',
  WISE = 'WISE',
  MISCHIEVOUS = 'MISCHIEVOUS',
  CARING = 'CARING',
  ADVENTUROUS = 'ADVENTUROUS',
  ANALYTICAL = 'ANALYTICAL',
  CREATIVE = 'CREATIVE'
}

export interface Reaction {
  emoji: string;
  count: number;
}

export interface Personality {
  metaAwareness: number;
  traits: Record<string, any>;
  // Add other personality properties as needed
}

export interface Trait {
  type: string;
  name: string;
  image: string;
  rarity: RarityTier;
  moonstoneBonus: number;
  value: string | PersonalityTrait | HeadType;
}

export interface Character {
  traits: Record<string, Trait>;
  unlockedTraits: string[];
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  reactions?: Reaction[];
}

export interface AIContext {
  emotionalState: string;
  // Add other context properties as needed
}

export interface ContractState {
  isConnected: boolean;
  selectedNFTId?: string;
  // Add other contract state properties as needed
}

export type GameState = 
  | "app-check"
  | "age-check"
  | "age-restricted"
  | "wallet-connection"
  | "disclaimer"
  | "welcome"
  | "choose-type"
  | "loading"
  | "dating-app"
  | "chat"
  | "inventory"
  | "marketplace";

export enum RarityTier {
  COMMON = 'COMMON',
  UNCOMMON = 'UNCOMMON',
  RARE = 'RARE',
  EPIC = 'EPIC',
  LEGENDARY = 'LEGENDARY'
}

export enum HeadType {
  Basic = 'Basic',
  Advanced = 'Advanced',
  Elite = 'Elite',
  Legendary = 'Legendary'
}

export type RealityEventType = 'coincidence' | 'glitch' | 'pattern' | 'déjà_vu';
 