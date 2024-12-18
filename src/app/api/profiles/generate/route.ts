import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateName } from '@/lib/nameGenerator';
import { generateBio } from '@/lib/bioGenerator';

function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generatePersonalityTraits(): string[] {
  const mbtiTypes = ['INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP', 
                     'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP'];
  
  const temperaments = ['Phlegmatic', 'Choleric', 'Melancholic', 'Sanguine'];
  const attitudes = ['Introverted', 'Ambivert', 'Extroverted'];
  const emotionalStyles = ['Expressive', 'Reserved', 'Balanced'];
  const decisionStyles = ['Analytical', 'Intuitive', 'Methodical'];
  const conflictStyles = ['Accommodating', 'Collaborative', 'Competitive'];
  const socialStyles = ['Independent', 'Cooperative', 'Leader'];
  const adaptabilityTypes = ['Flexible', 'Structured', 'Mixed'];
  const energyStyles = ['High-energy', 'Calm', 'Moderate'];
  const valueTypes = ['Traditional', 'Progressive', 'Balanced'];

  const selectedMbti = getRandomElement(mbtiTypes);

  return [
    `MBTI: ${selectedMbti}`,
    `Temperament: ${getRandomElement(temperaments)}`,
    `Attitude: ${getRandomElement(attitudes)}`,
    `Emotional: ${getRandomElement(emotionalStyles)}`,
    `Decision Making: ${getRandomElement(decisionStyles)}`,
    `Conflict Style: ${getRandomElement(conflictStyles)}`,
    `Social Style: ${getRandomElement(socialStyles)}`,
    `Adaptability: ${getRandomElement(adaptabilityTypes)}`,
    `Energy: ${getRandomElement(energyStyles)}`,
    `Values: ${getRandomElement(valueTypes)}`
  ];
}

function generateAlignment(): string {
  return getRandomElement(['White Hat', 'Grey Hat', 'Black Hat']);
}

export async function POST(req: Request) {
  try {
    const personalityTraits = generatePersonalityTraits();
    const alignment = generateAlignment();

    const profile = await prisma.profile.create({
      data: {
        name: generateName(),
        age: (Math.floor(Math.random() * 5) + 18).toString(),
        bio: await generateBio({ 
          rarity: 'Common',
          alignment,
          traits: personalityTraits 
        }),
        traits: personalityTraits,
        personality: JSON.stringify(personalityTraits),
        powerLevel: Math.floor(Math.random() * 10) + 1,
        rarity: getRandomElement(['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary']),
        alignment,
        emotionalBaseline: Number((0.3 + Math.random() * 0.7).toFixed(2)),
        interactionPrefs: {
          directness: Number(Math.random().toFixed(2)),
          formality: Number(Math.random().toFixed(2)),
          complexity: Number(Math.random().toFixed(2))
        },
        culturalContext: ['Modern Tech', 'Nature Lover', 'Urban Explorer'],
        fundamentalValues: ['Honesty', 'Curiosity', 'Adventure'],
        adaptability: Number((0.4 + Math.random() * 0.6).toFixed(2)),
        learningRate: Number((0.1 + Math.random() * 0.4).toFixed(2)),
        evolutionStage: 1,
        metaAwareness: Number(Math.random().toFixed(2)),
        dialogueStyle: getRandomElement(['Casual', 'Formal', 'Playful', 'Mysterious']),
        moonstoneBonus: Math.floor(Math.random() * 100),
        mbti: personalityTraits[0].split(': ')[1],
        nftMetadata: {
          alignment,
          traits: personalityTraits
        }
      }
    });

    return NextResponse.json({ success: true, profile });
  } catch (error) {
    console.error('Error generating profile:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate profile' },
      { status: 500 }
    );
  }
}
