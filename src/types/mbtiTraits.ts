type MBTIType = 'ENFJ' | 'INFJ' | 'ISFJ' | 'ESFJ' | 'ENTP' | 'INTP' | 'ENFP' | 'INFP' | 'INTJ' | 'ENTJ' | 'ISTP' | 'ESTP';

type Alignment = 'whiteHat' | 'greyHat' | 'blackHat';

const mbtiAlignments: Record<Alignment, MBTIType[]> = {
  whiteHat: ['ENFJ', 'INFJ', 'ISFJ', 'ESFJ'],
  greyHat: ['ENTP', 'INTP', 'ENFP', 'INFP'],
  blackHat: ['INTJ', 'ENTJ', 'ISTP', 'ESTP']
};

const personalityTraits: Record<Alignment, string[]> = {
  whiteHat: ['Friendly', 'Caring', 'Wise', 'Analytical'],
  greyHat: ['Mysterious', 'Creative', 'Adventurous', 'Playful'],
  blackHat: ['Mischievous', 'Serious', 'Analytical', 'Mysterious']
};

export function generateTraitsFromMBTI(mbti: MBTIType): string[] {
  // Find which alignment this MBTI belongs to
  const alignment = Object.entries(mbtiAlignments).find(([_, types]) => 
    types.includes(mbti)
  )?.[0] as Alignment;

  if (!alignment) {
    return personalityTraits.greyHat; // Default to greyHat if MBTI not found
  }

  // Get traits for this alignment
  const traits = personalityTraits[alignment];
  
  // Randomly select 3 unique traits
  return [...traits]
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);
}

export type { MBTIType, Alignment }; 