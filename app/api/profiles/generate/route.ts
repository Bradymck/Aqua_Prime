import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import prisma from '@/lib/prisma';
import { generateName } from '@/lib/nameGenerator';
import { generateBio } from '@/lib/bioGenerator';

const AVAILABLE_TRAITS = {
  background: ['Cyberpunk City', 'Zen Garden', 'Space Station', 'Underwater Lab'],
  skin: ['Classic', 'Neon', 'Metallic', 'Holographic'],
  eyes: ['Determined', 'Curious', 'Playful', 'Wise'],
  bill: ['Standard', 'Chrome', 'Glowing', 'Crystal'],
  clothes: ['Tech Suit', 'Lab Coat', 'Ninja Gear', 'Royal Robe'],
  tail: ['Sleek', 'Fluffy', 'Robotic', 'Ethereal'],
  head: ['Plain', 'Cyber Visor', 'Crown', 'Halo'],
  feet: ['Webbed', 'Hover Boots', 'Ninja Tabi', 'Royal Slippers'],
  leftHand: ['Empty', 'Laser Sword', 'Scroll', 'Magic Orb'],
  rightHand: ['Empty', 'Shield', 'Staff', 'Crystal Ball']
};

function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export async function POST(request: Request) {
  try {
    const { count = 1 } = await request.json();
    const profiles = [];

    for (let i = 0; i < count; i++) {
      const id = uuidv4();

      const profile = {
        id,
        name: generateName(),
        bio: generateBio(),
        location: "Platypus Passions",
        createdAt: new Date(),
        updatedAt: new Date(),
        nftMetadata: {
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
          zodiac: getRandomItem(['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio'])
        },
        isInGlobalPool: true,
        isActive: true
      };

      const createdProfile = await prisma.profile.create({
        data: profile
      });

      profiles.push(createdProfile);
    }

    return NextResponse.json({ success: true, profiles });
  } catch (error) {
    console.error('Error generating profiles:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate profiles',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}