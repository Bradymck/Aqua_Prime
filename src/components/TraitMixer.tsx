import { useState, useEffect } from 'react';
import Image from 'next/image';
import { TRAIT_CATEGORIES } from '../utils/traitConfig';
import type { GeneratedProfile } from '../types/game';
import { motion } from 'framer-motion';

interface TraitMixerProps {
  onProfileGenerated: (profile: GeneratedProfile) => void;
}

interface RarityScore {
  score: number;
  tier: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';
  multiplier: number;
}

export const TraitMixer: React.FC<TraitMixerProps> = ({ onProfileGenerated }) => {
  const [generatingProfile, setGeneratingProfile] = useState(false);

  // Helper function to get random item from array
  const getRandomItem = <T extends any>(items: T[]): T => {
    return items[Math.floor(Math.random() * items.length)];
  };

  const calculateRarity = (traits: GeneratedProfile['traits']): RarityScore => {
    let score = 0;

    // Base rarity scores for each trait category
    const rarityWeights = {
      skin: { Purple: 10, 'Royal Purple': 20, 'Dark Purple': 30 },
      head: { 'Green Slicked': 10, 'Grey Combover': 20, 'Blue Hat': 15 },
      clothes: { 'Green Hoodie': 10, 'ETH Hoodie': 25, 'Aqua Hoodie': 20 },
      eyes: { 'Apathetic': 10, 'Stare': 15, 'Suspicious': 20, 'Sneaky': 25 },
      bill: { 'Relaxed': 10, 'Nervous': 20, 'teeth': 15 },
      feet: { 'White Shoes': 10, 'Blue Sneakers': 15, 'Red Sneakers': 20 },
      background: { 'White': 10, 'Blue Spiral': 20, 'Green Spiral': 25 }
    };

    // Calculate total score
    Object.entries(traits).forEach(([category, trait]) => {
      const categoryWeights = rarityWeights[category as keyof typeof rarityWeights];
      const traitName = trait.replace('.png', '');
      score += categoryWeights[traitName as keyof typeof categoryWeights] || 0;
    });

    // Determine rarity tier
    let tier: RarityScore['tier'];
    let multiplier: number;

    if (score >= 150) {
      tier = 'Legendary';
      multiplier = 3.0;
    } else if (score >= 120) {
      tier = 'Epic';
      multiplier = 2.5;
    } else if (score >= 90) {
      tier = 'Rare';
      multiplier = 2.0;
    } else if (score >= 60) {
      tier = 'Uncommon';
      multiplier = 1.5;
    } else {
      tier = 'Common';
      multiplier = 1.0;
    }

    return { score, tier, multiplier };
  };

  const generateRandomProfile = async (): Promise<GeneratedProfile> => {
    // Get basic traits
    const traits = {
      skin: getRandomItem(TRAIT_CATEGORIES.BASIC_TRAITS.SKIN),
      head: getRandomItem(TRAIT_CATEGORIES.BASIC_TRAITS.HEAD),
      clothes: getRandomItem(TRAIT_CATEGORIES.BASIC_TRAITS.CLOTHES),
      eyes: getRandomItem(TRAIT_CATEGORIES.BASIC_TRAITS.EYES),
      bill: getRandomItem(TRAIT_CATEGORIES.BASIC_TRAITS.BILL),
      feet: getRandomItem(TRAIT_CATEGORIES.BASIC_TRAITS.FEET),
      background: getRandomItem(TRAIT_CATEGORIES.BASIC_TRAITS.BACKGROUND)
    };
  
    // Calculate rarity
    const rarity = calculateRarity(traits);
  
    // Generate personality based on traits and rarity
    const personalities = [
      'Mysterious', 'Playful', 'Intellectual', 'Flirty',
      'Philosophical', 'Cryptic', 'Mathematical', 'Artistic'
    ];
    
    const personalityCount = rarity.tier === 'Legendary' ? 3 : 
                           rarity.tier === 'Epic' ? 2 : 1;
    
    const personality = Array.from({ length: personalityCount }, 
      () => getRandomItem(personalities)
    ).filter((v, i, a) => a.indexOf(v) === i);
  
    // Calculate power level based on rarity (50-100)
    const basePower = Math.floor(Math.random() * 51) + 50;
    const powerLevel = Math.floor(basePower * rarity.multiplier);
  
    // Calculate moonstone bonus based on rarity
    const moonstoneBonus = Number((rarity.multiplier).toFixed(1));
  
    // Generate backstory using the API
    const backstory = await generateBackstory(traits, personality, rarity.tier);
  
    return {
      id: `profile-${Date.now()}`,
      traits,
      personality,
      powerLevel,
      moonstoneBonus,
      backstory,
      rarity: rarity.tier
    };
  };

  const generateBackstory = async (
    traits: GeneratedProfile['traits'],
    personality: string[],
    rarity: string
  ): Promise<string> => {
    try {
      // Format traits for the API
      const formattedTraits = Object.entries(traits).map(([category, value]) => ({
        category,
        image: typeof value === 'string' ? value : value.toString()
      }));

      // Add personality traits to the array
      personality.forEach((trait, index) => {
        formattedTraits.push({
          category: 'personality',
          image: trait
        });
      });

      // Add rarity to traits
      formattedTraits.push({
        category: 'rarity',
        image: rarity
      });

      const response = await fetch('/api/generate-backstory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ traits: formattedTraits })
      });

      if (!response.ok) {
        throw new Error('Failed to generate backstory');
      }

      const data = await response.json();
      return data.backstory;
    } catch (error) {
      console.error('Error generating backstory:', error);
      // Fallback to template-based backstory if API call fails
      const templates = [
        `A ${rarity.toLowerCase()} ${traits.skin.replace('.png', '')} platypus with ${personality.join(' and ')} tendencies. Often seen wearing ${traits.clothes.replace('.png', '')} and sporting ${traits.head.replace('.png', '')}.`,
        `Known for their ${personality.join(' and ')} nature, this ${rarity.toLowerCase()} platypus has a unique style featuring ${traits.clothes.replace('.png', '')} and ${traits.head.replace('.png', '')}.`,
        `A mysterious ${rarity.toLowerCase()} figure with ${traits.eyes.replace('.png', '')} eyes, wearing ${traits.clothes.replace('.png', '')}. Their ${personality.join(' and ')} personality makes them intriguing.`
      ];

      return templates[Math.floor(Math.random() * templates.length)];
    }
  };

  const handleGenerate = async () => {
    setGeneratingProfile(true);
    try {
      const profile = await generateRandomProfile();
      onProfileGenerated(profile);
    } catch (error) {
      console.error('Profile generation error:', error);
    } finally {
      setGeneratingProfile(false);
    }
  };

  return (
    <div className="trait-mixer">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleGenerate}
        className="px-6 py-3 bg-purple-600 text-white rounded-lg shadow-lg"
        disabled={generatingProfile}
      >
        {generatingProfile ? 'Generating...' : 'Generate Random Profile'}
      </motion.button>

      <style jsx>{`
        .trait-mixer {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
        }
      `}</style>
    </div>
  );
};

export default TraitMixer;
