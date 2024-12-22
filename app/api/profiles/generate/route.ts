import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import prisma from '../../../lib/prisma';
import { generateName } from '../../../lib/nameGenerator';
import { generateBio } from '../../../lib/bioGenerator';

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
    const { count = 1, walletAddress } = await request.json();

    if (!walletAddress) {
      return NextResponse.json(
        { success: false, error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    const profiles = [];

    for (let i = 0; i < count; i++) {
      const id = uuidv4();

      const profile = {
        id,
        ownerAddress: walletAddress,
        name: generateName(),
        bio: generateBio(),
        location: "Platypus Passions",
        createdAt: new Date(),
        updatedAt: new Date(),
        nftMetadata: JSON.stringify({
          // Base traits
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
          // Personality
          alignment: getRandomItem(['White Hat', 'Grey Hat', 'Black Hat']),
          faction: getRandomItem(['Cyber Knights', 'Data Pirates', 'Code Monks', 'Unaffiliated']),
          mbti: getRandomItem(['INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP']),
          zodiac: getRandomItem(['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio']),
          // Additional traits
          goals: [
            'Become a master hacker',
            'Find true digital love'
          ],
          flaws: [
            'Too much screen time',
            'Addicted to crypto'
          ],
          stats: {
            strength: Math.floor(Math.random() * 100),
            intelligence: Math.floor(Math.random() * 100),
            charisma: Math.floor(Math.random() * 100),
            luck: Math.floor(Math.random() * 100)
          },
          personalityTraits: [
            getRandomItem(['Strategic', 'Mysterious', 'Playful', 'Creative', 'Ambitious']),
            getRandomItem(['Analytical', 'Intuitive', 'Adventurous', 'Cautious', 'Bold']),
            getRandomItem(['Innovative', 'Traditional', 'Rebellious', 'Diplomatic', 'Direct'])
          ],
          visualTraits: [
            {
              dominant: getRandomItem(['vapor_wave', 'cyber_punk', 'retro_wave', 'digital_art', 'pixel_art']),
              r1: getRandomItem(['great_wave', 'neon_city', 'matrix_code', 'binary_rain', 'glitch_art']),
              r2: getRandomItem(['blue_ka_pow', 'red_flash', 'purple_haze', 'green_matrix', 'yellow_spark']),
              r3: getRandomItem(['white_zoom', 'black_void', 'rainbow_burst', 'static_noise', 'data_stream'])
            }
          ],
          hormonalTraits: [
            {
              level: Math.floor(Math.random() * 100),
              baseline: Math.floor(Math.random() * 100),
              volatility: Math.floor(Math.random() * 100),
              recovery: Math.floor(Math.random() * 100)
            }
          ]
        }),
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