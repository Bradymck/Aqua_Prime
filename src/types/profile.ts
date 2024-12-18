export interface Profile {
  id: string;
  name: string;
  bio: string;
  location?: string;
  createdAt: Date;
  updatedAt: Date;
  nftMetadata: string | NFTMetadata;
  isInGlobalPool: boolean;
  isActive: boolean;
  ownerAddress?: string;
  _count?: {
    likes: number;
    dislikes: number;
  };
}

export interface NFTMetadata {
  background: string;
  skin: string;
  eyes: string;
  bill: string;
  clothes: string;
  tail?: string;
  head?: string;
  feet?: string;
  leftHand?: string;
  rightHand?: string;
  alignment: string;
  faction: string;
  mbti: string;
  zodiac: string;
  goals: string[];
  flaws: string[];
  stats: {
    strength: number;
    intelligence: number;
    charisma: number;
    luck: number;
  };
  visualTraits?: any[];
  hormonalTraits?: any[];
  characterTraits?: any;
}