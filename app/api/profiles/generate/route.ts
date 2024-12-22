import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { PrismaClient } from '@prisma/client';
import { generateName } from '../../../lib/nameGenerator';
import { generateBio } from '../../../lib/bioGenerator';

const prisma = new PrismaClient();

const AVAILABLE_TRAITS = {
  background: [
    'vapor_wave', 'cyber_punk', 'retro_wave', 'digital_art', 'pixel_art',
    'red_spiral', 'blue_spiral', 'green_spiral', 'Luminous', 'Beach',
    'Studio', 'system_error'
  ],
  skin: [
    'brown', 'confetti', 'zombie_skin', 'dark_purple', 'navy',
    'trippy', 'cooked', 'infected', 'clear', 'erased'
  ],
  eyes: [
    'Crazy', 'Scared', 'Mad', 'Suspicious', 'Dead',
    'Oni', 'Love', 'Snek', 'Apathetic', 'Targets'
  ],
  bill: [
    'grit', 'lipstick', 'fangs', 'teeth', 'cyborg',
    'relaxed', 'tongue', 'nervous'
  ],
  clothes: [
    'stripper', 'white_slav', 'aqua_man', 'aqua_hoodie', 'cloud_raincoat',
    'baker', 'anarchy', 'awoken'
  ],
  tail: [
    'azure_furry', 'green', 'brown_fist', 'bones', 'black_usb',
    'white_usb', 'bone'
  ],
  head: [
    'Monocle', 'Basketball', 'Watch', 'spike_bat', 'wine_bottle'
  ],
  feet: [
    'old_leather', 'blue_space'
  ]
};

function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export async function POST(request: Request) {
  try {
    const { count = 1, walletAddress, isBurned = false } = await request.json();
    console.log('[Profile Generation] Request received:', { count, walletAddress, isBurned });

    if (!walletAddress) {
      console.error('[Profile Generation] Missing wallet address');
      return NextResponse.json(
        { success: false, error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    const profiles = [];

    for (let i = 0; i < count; i++) {
      const id = uuidv4();
      console.log('[Profile Generation] Generating profile:', { id, index: i + 1, total: count });

      const metadata = {
        // Base traits for image layers
        background: getRandomItem(AVAILABLE_TRAITS.background),
        skin: getRandomItem(AVAILABLE_TRAITS.skin),
        eyes: getRandomItem(AVAILABLE_TRAITS.eyes),
        bill: getRandomItem(AVAILABLE_TRAITS.bill),
        clothes: getRandomItem(AVAILABLE_TRAITS.clothes),
        tail: getRandomItem(AVAILABLE_TRAITS.tail),
        head: getRandomItem(AVAILABLE_TRAITS.head),
        feet: getRandomItem(AVAILABLE_TRAITS.feet),
        outline: 'default', // Default outline template
        // Personality traits
        personalityTraits: [
          getRandomItem(['Strategic', 'Mysterious', 'Playful', 'Creative', 'Ambitious']),
          getRandomItem(['Analytical', 'Intuitive', 'Adventurous', 'Cautious', 'Bold']),
          getRandomItem(['Innovative', 'Traditional', 'Rebellious', 'Diplomatic', 'Direct'])
        ],
        // Stats
        stats: {
          strength: Math.floor(Math.random() * 100),
          intelligence: Math.floor(Math.random() * 100),
          charisma: Math.floor(Math.random() * 100),
          luck: Math.floor(Math.random() * 100)
        },
        visualTraits: [
          {
            dominant: getRandomItem(AVAILABLE_TRAITS.background),
            r1: getRandomItem(AVAILABLE_TRAITS.background),
            r2: getRandomItem(AVAILABLE_TRAITS.background),
            r3: getRandomItem(AVAILABLE_TRAITS.background)
          }
        ]
      };

      try {
        const name = generateName();
        const bio = generateBio();
        console.log('[Profile Generation] Generated profile details:', { id, name, bioLength: bio.length });

        // Create profile with stringified metadata
        const profile = await prisma.profile.create({
          data: {
            id,
            ownerAddress: walletAddress,
            name,
            bio,
            location: "Platypus Passions",
            createdAt: new Date(),
            updatedAt: new Date(),
            nftMetadata: JSON.stringify(metadata),
            isInGlobalPool: !isBurned,
            isActive: true
          }
        });

        console.log('[Profile Generation] Profile created successfully:', {
          id: profile.id,
          ownerAddress: profile.ownerAddress,
          name: profile.name
        });

        // Return profile with parsed metadata
        profiles.push({
          ...profile,
          nftMetadata: metadata // Return the original metadata object
        });

      } catch (error) {
        console.error('[Profile Generation] Error creating profile:', error);
        throw error;
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        profiles
      }
    });

  } catch (error) {
    console.error('[Profile Generation] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate profiles',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}