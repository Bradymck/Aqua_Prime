import React, { useState } from 'react';

interface Character {
  name: string;
  bio: string;
  faction: string;
  appearance: {
    skinColor: string;
    eyeColor: string;
    height: string;
  };
  personality: string[];
}

const CharacterCreator: React.FC = () => {
  const [character, setCharacter] = useState<Character>({
    name: '',
    bio: '',
    faction: 'moonstone',
    appearance: {
      skinColor: '#e0c6a3',
      eyeColor: '#4a4a4a',
      height: 'medium',
    },
    personality: [],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setCharacter(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof Character],
          [child]: value,
        },
      }));
    } else {
      setCharacter(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Handle character creation submission
    console.log('Character created:', character);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Character Creator</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={character.name}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Bio</label>
            <textarea
              name="bio"
              value={character.bio}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg h-32"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Faction</label>
            <select
              name="faction"
              value={character.faction}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg"
            >
              <option value="moonstone">Moonstone Maverick</option>
              <option value="quantum">Quantum Questers</option>
              <option value="digital">Digital Dreamers</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Skin Color</label>
              <input
                type="color"
                name="appearance.skinColor"
                value={character.appearance.skinColor}
                onChange={handleInputChange}
                className="w-full h-10 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Eye Color</label>
              <input
                type="color"
                name="appearance.eyeColor"
                value={character.appearance.eyeColor}
                onChange={handleInputChange}
                className="w-full h-10 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Height</label>
              <select
                name="appearance.height"
                value={character.appearance.height}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg"
              >
                <option value="short">Short</option>
                <option value="medium">Medium</option>
                <option value="tall">Tall</option>
              </select>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700"
        >
          Create Character
        </button>
      </form>
    </div>
  );
};

export default CharacterCreator;