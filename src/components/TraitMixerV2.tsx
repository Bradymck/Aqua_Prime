import React, { useState } from 'react';
import Image from 'next/image';
import { formatMetadataAttributes } from '@/utils/metadataFormatter';

interface Trait {
  category: string;
  image: string;
  name: string;
}

interface VisualTrait {
  category: string;
  options: {
    name: string;
    image: string;
  }[];
}

const visualTraits: VisualTrait[] = [
  {
    category: 'Background',
    options: [
      { name: 'mystic_pond', image: '/traits/backgrounds/mystic_pond.png' },
      { name: 'moonlit_forest', image: '/traits/backgrounds/moonlit_forest.png' },
    ]
  },
  {
    category: 'Body',
    options: [
      { name: 'classic_brown', image: '/traits/body/classic_brown.png' },
      { name: 'teal_shine', image: '/traits/body/teal_shine.png' },
    ]
  },
  {
    category: 'Accessories',
    options: [
      { name: 'golden_necklace', image: '/traits/accessories/golden_necklace.png' },
      { name: 'silver_watch', image: '/traits/accessories/silver_watch.png' },
    ]
  }
];

const TraitMixerV2: React.FC = () => {
  const [selectedTraits, setSelectedTraits] = useState<Record<string, string>>({});
  const [backstory, setBackstory] = useState<string>('');

  const handleTraitSelect = (category: string, traitName: string) => {
    setSelectedTraits(prev => ({
      ...prev,
      [category.toLowerCase()]: traitName
    }));
  };

  const handleBackstoryChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBackstory(event.target.value);
  };

  const generateMetadata = () => {
    const attributes = formatMetadataAttributes({
      ...selectedTraits,
      personality: backstory
    });

    return {
      name: "Platypus Dating Profile",
      description: backstory,
      attributes
    };
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Create Your Platypus</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Preview Section */}
        <div className="bg-gray-100 rounded-lg p-4">
          <h3 className="text-xl font-semibold mb-4">Preview</h3>
          <div className="relative w-full aspect-square">
            {/* Layer traits here */}
            {Object.entries(selectedTraits).map(([category, traitName]) => {
              const trait = visualTraits
                .find(t => t.category.toLowerCase() === category.toLowerCase())
                ?.options.find(o => o.name === traitName);
                
              return trait && (
                <Image
                  key={category}
                  src={trait.image}
                  alt={trait.name}
                  fill
                  className="object-contain"
                />
              );
            })}
          </div>
        </div>

        {/* Trait Selection */}
        <div className="space-y-4">
          {visualTraits.map((traitCategory) => (
            <div key={traitCategory.category} className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">{traitCategory.category}</h3>
              <div className="grid grid-cols-3 gap-2">
                {traitCategory.options.map((trait) => (
                  <button
                    key={trait.name}
                    onClick={() => handleTraitSelect(traitCategory.category, trait.name)}
                    className={`p-2 rounded-lg transition-colors ${
                      selectedTraits[traitCategory.category.toLowerCase()] === trait.name
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                    aria-label={`Select ${trait.name}`}
                  >
                    <div className="relative w-full aspect-square mb-1">
                      <Image
                        src={trait.image}
                        alt={trait.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <span className="text-sm">
                      {trait.name.split('_').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Backstory Section */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">Backstory</h3>
        <textarea
          value={backstory}
          onChange={handleBackstoryChange}
          className="w-full h-32 p-3 border rounded-lg resize-none"
          placeholder="Write your platypus backstory..."
        />
      </div>

      {/* Mint Button */}
      <button
        onClick={() => console.log(generateMetadata())}
        className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors"
        aria-label="Mint NFT"
      >
        Mint Your Platypus
      </button>
    </div>
  );
};

export default TraitMixerV2;
