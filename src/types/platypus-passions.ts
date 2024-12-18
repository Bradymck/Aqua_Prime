export type Alignment = 'whiteHat' | 'greyHat' | 'blackHat';

export interface NFTMetadata {
  background: string;
  skin: string;
  feet: string;
  eyes: string;
  head: string;
  bill: string;
  clothes: string;
  tail: string;
  lefthand: string;
  righthand: string;
  mbti: string;
  personalityTraits: string[];
}

export interface Personality {
  mbti: string;
  traits: string[];
  alignment: Alignment;
}

export interface PlatypusProfile {
  id: string;
  name: string;
  age: string;
  bio: string;
  personality: Personality;
  alignment: string;
  rarity: string;
  nftMetadata: NFTMetadata;
} 

function generateAlignment(): '😈' | '😎' | '😇' {
  const random = Math.random();
  if (random < 0.33) return '😈'; // Black Hat
  if (random < 0.66) return '😎'; // Grey Hat
  return '😇'; // White Hat
} 