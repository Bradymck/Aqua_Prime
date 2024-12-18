import React, { useState } from 'react';

interface SkinTemplate {
  name: string;
  baseColor: string;
  patterns: {
    type: string;
    color: string;
    scale: number;
  }[];
  accessories: string[];
}

const SkinCreator: React.FC = () => {
  const [skin, setSkin] = useState<SkinTemplate>({
    name: '',
    baseColor: '#ffffff',
    patterns: [
      {
        type: 'spots',
        color: '#000000',
        scale: 1,
      },
    ],
    accessories: [],
  });

  const patternTypes = ['spots', 'stripes', 'waves', 'geometric'];
  const accessoryOptions = ['hat', 'glasses', 'necklace', 'backpack', 'watch'];

  const handleBaseColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSkin(prev => ({
      ...prev,
      baseColor: e.target.value,
    }));
  };

  const handlePatternChange = (index: number, field: string, value: string | number) => {
    setSkin(prev => ({
      ...prev,
      patterns: prev.patterns.map((pattern, i) =>
        i === index ? { ...pattern, [field]: value } : pattern
      ),
    }));
  };

  const addPattern = () => {
    setSkin(prev => ({
      ...prev,
      patterns: [
        ...prev.patterns,
        { type: 'spots', color: '#000000', scale: 1 },
      ],
    }));
  };

  const removePattern = (index: number) => {
    setSkin(prev => ({
      ...prev,
      patterns: prev.patterns.filter((_, i) => i !== index),
    }));
  };

  const toggleAccessory = (accessory: string) => {
    setSkin(prev => ({
      ...prev,
      accessories: prev.accessories.includes(accessory)
        ? prev.accessories.filter(a => a !== accessory)
        : [...prev.accessories, accessory],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Handle skin template submission
    console.log('Skin template created:', skin);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Skin Creator</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Template Name</label>
            <input
              type="text"
              value={skin.name}
              onChange={e => setSkin(prev => ({ ...prev, name: e.target.value }))}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Base Color</label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={skin.baseColor}
                onChange={handleBaseColorChange}
                className="w-20 h-10 rounded-lg"
              />
              <span className="text-sm">{skin.baseColor}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Patterns</label>
            {skin.patterns.map((pattern, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg mb-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs mb-1">Type</label>
                    <select
                      value={pattern.type}
                      onChange={e => handlePatternChange(index, 'type', e.target.value)}
                      className="w-full p-2 border rounded-lg"
                    >
                      {patternTypes.map(type => (
                        <option key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs mb-1">Color</label>
                    <input
                      type="color"
                      value={pattern.color}
                      onChange={e => handlePatternChange(index, 'color', e.target.value)}
                      className="w-full h-9 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-xs mb-1">Scale</label>
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.1"
                      value={pattern.scale}
                      onChange={e => handlePatternChange(index, 'scale', parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removePattern(index)}
                  className="mt-2 text-red-600 text-sm hover:text-red-700"
                >
                  Remove Pattern
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addPattern}
              className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
            >
              Add Pattern
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Accessories</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {accessoryOptions.map(accessory => (
                <button
                  key={accessory}
                  type="button"
                  onClick={() => toggleAccessory(accessory)}
                  className={`p-2 rounded-lg border ${
                    skin.accessories.includes(accessory)
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {accessory.charAt(0).toUpperCase() + accessory.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700"
        >
          Save Skin Template
        </button>
      </form>
    </div>
  );
};

export default SkinCreator;