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
    'Studio', 'system_error', 'grey_marble', 'pink_zoom', 'white_zoom'
  ],
  skin: [
    'brown', 'confetti', 'zombie_skin', 'dark_purple', 'navy',
    'trippy', 'cooked', 'infected', 'clear', 'erased', 'scribble',
    'purple', 'lines', 'cosmic', 'blue_foundation'
  ],
  eyes: [
    'Crazy', 'Scared', 'Mad', 'Suspicious', 'Dead',
    'Oni', 'Love', 'Snek', 'Apathetic', 'Targets',
    'Shock', 'Sad', 'Cyborg'
  ],
  bill: [
    'grit', 'lipstick', 'fangs', 'teeth', 'cyborg',
    'relaxed', 'tongue', 'nervous', 'Pascifier', 'spikes'
  ],
  clothes: [
    'stripper', 'white_slav', 'aqua_man', 'aqua_hoodie', 'cloud_raincoat',
    'baker', 'anarchy', 'awoken', 'mental_patient', 'orange_raincoat',
    'dancer'
  ],
  tail: [
    'azure_furry', 'green', 'brown_fist', 'bones', 'black_usb',
    'white_usb', 'bone', 'skull_bone', 'japan_flag', 'pink_fist'
  ],
  head: [
    'Monocle', 'Basketball', 'Watch', 'spike_bat', 'wine_bottle',
    'blue_hat', 'tin_foil', 'Gizmo', 'Horn'
  ],
  feet: [
    'old_leather', 'blue_space', 'pink_boots', 'red_sneakers',
    'black_boots', 'stinky'
  ],
  leftHand: [
    'Wand', 'glow_stick', 'tissue_roll', 'black_bracelet'
  ],
  rightHand: [
    'red_bracelet', 'black_bracelet', 'Gun'
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
        leftHand: getRandomItem(AVAILABLE_TRAITS.leftHand),
        rightHand: getRandomItem(AVAILABLE_TRAITS.rightHand),
        alignment: getRandomItem(['White Hat', 'Grey Hat', 'Black Hat']),
        faction: getRandomItem(['Data Pirates', 'Cyber Knights', 'Unaffiliated']),
        mbti: getRandomItem(['INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP']),
        zodiac: getRandomItem(['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces']),
        goals: [
          'Become a master hacker',
          'Find true digital love'
        ],
        flaws: [
          'Too much time online',
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
            dominant: getRandomItem(AVAILABLE_TRAITS.background),
            r1: getRandomItem(AVAILABLE_TRAITS.background),
            r2: getRandomItem(AVAILABLE_TRAITS.background),
            r3: getRandomItem(AVAILABLE_TRAITS.background)
          },
          {
            dominant: getRandomItem(AVAILABLE_TRAITS.skin),
            r1: getRandomItem(AVAILABLE_TRAITS.skin),
            r2: getRandomItem(AVAILABLE_TRAITS.skin),
            r3: getRandomItem(AVAILABLE_TRAITS.skin)
          },
          {
            dominant: getRandomItem(AVAILABLE_TRAITS.eyes),
            r1: getRandomItem(AVAILABLE_TRAITS.eyes),
            r2: getRandomItem(AVAILABLE_TRAITS.eyes),
            r3: getRandomItem(AVAILABLE_TRAITS.eyes)
          },
          {
            dominant: getRandomItem(AVAILABLE_TRAITS.bill),
            r1: getRandomItem(AVAILABLE_TRAITS.bill),
            r2: getRandomItem(AVAILABLE_TRAITS.bill),
            r3: getRandomItem(AVAILABLE_TRAITS.bill)
          },
          {
            dominant: getRandomItem(AVAILABLE_TRAITS.clothes),
            r1: getRandomItem(AVAILABLE_TRAITS.clothes),
            r2: getRandomItem(AVAILABLE_TRAITS.clothes),
            r3: getRandomItem(AVAILABLE_TRAITS.clothes)
          },
          {
            dominant: getRandomItem(AVAILABLE_TRAITS.tail),
            r1: getRandomItem(AVAILABLE_TRAITS.tail),
            r2: getRandomItem(AVAILABLE_TRAITS.tail),
            r3: getRandomItem(AVAILABLE_TRAITS.tail)
          }
        ],
        hormonalTraits: Array.from({ length: 5 }, () => ({
          level: Math.floor(Math.random() * 100),
          baseline: Math.floor(Math.random() * 100),
          volatility: Math.floor(Math.random() * 100),
          recovery: Math.floor(Math.random() * 100)
        })),
        characterTraits: {
          strength: Math.floor(Math.random() * 100),
          intelligence: Math.floor(Math.random() * 100),
          charisma: Math.floor(Math.random() * 100),
          luck: Math.floor(Math.random() * 100)
        }
      };

      // Create profile with stringified metadata
      const profile = await prisma.profile.create({
        data: {
          id,
          name: generateName(),
          bio: generateBio(),
          ownerAddress: walletAddress,
          nftMetadata: JSON.stringify(metadata), // Stringify the metadata object
          isInGlobalPool: !isBurned,
          isActive: true
        }
      });

      // Add the parsed metadata back to the profile for the response
      profiles.push({
        ...profile,
        nftMetadata: metadata // Send back the original metadata object
      });
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
  }
}