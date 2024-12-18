import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { AnimatePresence } from 'framer-motion';
import ComicBubble from './ComicBubble';

export function StoryGenerator() {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [storyChunks, setStoryChunks] = useState<string[]>([]);
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);

  const generateStory = async () => {
    setIsGenerating(true);
    try {
      const demoBackstory = `In a post-apocalyptic world where technology merged with organic life, WIP.png emerged as a unique creation. WIP.png was a mysterious being with clear skin that shimmered with an otherworldly glow. Sporting a green hoodie to blend in with the surroundings, WIP.png's appearance was further accentuated by devil horns atop its head. Despite its unsettling appearance, WIP.png's eyes held a glint of suspicion, always alert and observant of its surroundings. Its hands told a tale of duality - one adorned with a roll of eternal toilet paper, symbolizing a quirky sense of humor, while the other cradled a phone, a symbol of its connection to the digital world. WIP.png navigated the wastelands with a sharpened bill, ready to defend itself against any threats that may lurk in the shadows. Its feet were adorned with blue space-like boots, granting it agility and speed in its travels through the desolate landscapes.`;

      const chunks = demoBackstory.split(/(?<=[.!?])\s+/);
      setStoryChunks(chunks);
      setCurrentChunkIndex(0);
    } catch (error) {
      console.error('Error generating story:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBubbleTypingDone = () => {
    if (currentChunkIndex < storyChunks.length - 1) {
      setCurrentChunkIndex(prevIndex => prevIndex + 1);
    }
  };

  return (
    <div className="space-y-4 max-w-2xl mx-auto p-4 bg-gradient-to-br from-blue-100 to-purple-100 min-h-screen">
      <Button onClick={generateStory} disabled={isGenerating} className="w-full bg-yellow-400 text-black hover:bg-yellow-500 border-2 border-black font-bold">
        {isGenerating ? 'Generating...' : 'Generate Story'}
      </Button>
      <div className="mt-4 space-y-2">
        <AnimatePresence mode="wait">
          {storyChunks.length > 0 && (
            <ComicBubble 
              key={currentChunkIndex}
              content={storyChunks[currentChunkIndex]}
              backgroundColor={currentChunkIndex % 2 === 0 ? '#F0F0F0' : '#E1F5FE'}
              onTypingDone={handleBubbleTypingDone}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}