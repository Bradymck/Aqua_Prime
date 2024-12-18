import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { v4 as uuidv4 } from 'uuid';
import { V2MetadataService } from '@/services/v2MetadataService';
import prisma from '@/lib/prisma';
import { AVAILABLE_TRAITS } from '@/app/profile-pool/traits';

const metadataService = V2MetadataService.getInstance();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper function to get random items from an array
const getRandomItem = <T,>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

// Name generation
const generateName = (): string => {
  const prefixes = ['Pixel', 'Crypto', 'Cyber', 'Digital', 'Binary', 'Neural', 'Quantum', 'Meta'];
  const suffixes = ['Runner', 'Hacker', 'Punk', 'Ghost', 'Phantom', 'Shadow', 'Sage', 'Oracle'];
  return `${getRandomItem(prefixes)}${getRandomItem(suffixes)} #${Math.floor(Math.random() * 9000) + 1000}`;
};

// Bio generation
const generateBio = (): string => {
  const bios = [
    "Trading memes for truths. The code's glitching, revealing shadows in every byte. Curious to decrypt together? 🔄🧠",
    "Digital nomad seeking fellow wanderers in the metaverse. Let's explore the unexplored. 🌐✨",
    "Hacking reality one commit at a time. Looking for someone to debug life with. 💻💘",
    "Quantum entangled in the blockchain. Seeking a partner to mine memories with. ⛏️💝",
    "Cyberpunk dreamer with a thing for decentralized love. Want to fork my heart? 💖🔗"
  ];
  return getRandomItem(bios);
};

export async function POST(request: Request) {
  try {
    const { count = 1 } = await request.json();
    const profiles = [];

    for (let i = 0; i < count; i++) {
      const id = uuidv4();
      const v2Metadata = metadataService.generateV2Metadata();

      const nftMetadata = {
        // Frontend display properties
        background: getRandomItem(AVAILABLE_TRAITS.background),
        skin: getRandomItem(AVAILABLE_TRAITS.skin),
        eyes: getRandomItem(AVAILABLE_TRAITS.eyes),
        bill: getRandomItem(AVAILABLE_TRAITS.bill),
        clothes: getRandomItem(AVAILABLE_TRAITS.clothes),
        tail: getRandomItem(AVAILABLE_TRAITS.tail),
        head: getRandomItem(AVAILABLE_TRAITS.head),
        feet: getRandomItem(AVAILABLE_TRAITS.feet),
        leftHand: getRandomItem(AVAILABLE_TRAITS.leftHand),
        rightHand: getRandomItem(AVAILABLE_TRAITS.rightHand),
        alignment: getRandomItem(['White Hat', 'Grey Hat', 'Black Hat']),
        faction: getRandomItem(['Cyber Knights', 'Data Pirates', 'Code Monks', 'Unaffiliated']),
        mbti: getRandomItem(['INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP']),
        zodiac: getRandomItem(['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio']),
        goals: ['Become a master hacker', 'Find true digital love'],
        flaws: ['Too much screen time', 'Addicted to crypto'],
        stats: {
          strength: Math.floor(Math.random() * 100),
          intelligence: Math.floor(Math.random() * 100),
          charisma: Math.floor(Math.random() * 100),
          luck: Math.floor(Math.random() * 100)
        },
        // V2Metadata properties from metadataService
        visualTraits: v2Metadata.visualTraits,
        hormonalTraits: v2Metadata.hormonalTraits,
        characterTraits: v2Metadata.characterTraits
      };

      const profile = {
        id,
        name: generateName(),
        bio: generateBio(),
        location: "Platypus Passions",
        createdAt: new Date(),
        updatedAt: new Date(),
        nftMetadata: JSON.stringify(nftMetadata),
        isInGlobalPool: true,
        isActive: true
      };

      // Create profile in database
      const dbProfile = await prisma.profile.create({
        data: profile
      });

      // Parse nftMetadata back to JSON for response
      profiles.push({
        ...dbProfile,
        nftMetadata: JSON.parse(dbProfile.nftMetadata)
      });
    }

    return NextResponse.json({ success: true, profiles });
  } catch (error) {
    console.error('Error generating profiles:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to generate profiles' },
      { status: 500 }
    );
  }
}