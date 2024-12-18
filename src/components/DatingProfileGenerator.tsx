import React from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, X, Star, Info } from "lucide-react";
import type { PlatypusProfile, Alignment } from '@/types/platypus-passions';
import { LayeredImage } from './LayeredImage';

const alignmentEmojis: Record<Alignment, string> = {
  whiteHat: '😇',
  greyHat: '😎',
  blackHat: '😈'
};

const alignmentLabels: Record<Alignment, string> = {
  whiteHat: 'White Hat',
  greyHat: 'Grey Hat',
  blackHat: 'Black Hat'
};

interface DatingProfileGeneratorProps {
  profiles: PlatypusProfile[];
  currentProfile: number;
  onSwipe: (direction: "left" | "right") => void;
  onSuperlike: () => void;
  isLoading: boolean;
}

export const DatingProfileGenerator: React.FC<DatingProfileGeneratorProps> = ({
  profiles,
  currentProfile,
  onSwipe,
  onSuperlike,
  isLoading
}) => {
  const [showMetadata, setShowMetadata] = React.useState(false);

  if (isLoading || !profiles.length) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        Loading new profiles...
      </div>
    );
  }

  const profile = profiles[currentProfile];
  if (!profile) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        No more profiles available
      </div>
    );
  }

  const toggleMetadata = () => setShowMetadata(!showMetadata);

  return (
    <div className="relative h-full flex flex-col">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentProfile}
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -300 }}
          transition={{ duration: 0.3 }}
          className="bg-gray-900 rounded-lg overflow-hidden shadow-lg border border-gray-800 flex-grow relative"
        >
          {/* NFT Metadata Panel */}
          <AnimatePresence>
            {showMetadata && (
              <motion.div
                initial={{ opacity: 0, x: '100%' }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: '100%' }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 bg-gray-900/95 backdrop-blur-sm z-50 overflow-y-auto"
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-100">NFT Metadata</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleMetadata}
                      className="text-gray-400 hover:text-gray-100"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {Object.entries(profile.nftMetadata).map(([key, value]) => (
                      <div key={key} className="border-b border-gray-800 pb-3">
                        <div className="text-sm text-gray-400 mb-1 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </div>
                        <div className="text-gray-100">
                          {Array.isArray(value) ? (
                            <div className="flex flex-wrap gap-2">
                              {value.map((v, i) => (
                                <Badge key={i} variant="secondary">
                                  {v}
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <span>{value}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative h-80 bg-gray-800 rounded-t-lg overflow-hidden">
            <LayeredImage
              layers={[
                { image: `/assets/outlines_templates/master_outline.png`, zIndex: 0 },
                { image: `/assets/background/${profile.nftMetadata.background}.png`, zIndex: 1 },
                { image: `/assets/skins/${profile.nftMetadata.skin}.png`, zIndex: 2 },
                { image: `/assets/feet/${profile.nftMetadata.feet}.png`, zIndex: 3 },
                { image: `/assets/clothes/${profile.nftMetadata.clothes}.png`, zIndex: 4 },
                { image: `/assets/eyes/${profile.nftMetadata.eyes}.png`, zIndex: 5 },
                { image: `/assets/head/${profile.nftMetadata.head}.png`, zIndex: 6 },
                { image: `/assets/bill/${profile.nftMetadata.bill}.png`, zIndex: 7 },
                { image: `/assets/lefthand/${profile.nftMetadata.lefthand}.png`, zIndex: 8 },
                { image: `/assets/righthand/${profile.nftMetadata.righthand}.png`, zIndex: 9 },
                { image: `/assets/tail/${profile.nftMetadata.tail}.png`, zIndex: 10 }
              ]}
              containerClassName="w-full h-full"
            />
            {/* Metadata Toggle Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMetadata}
              className="absolute top-4 right-4 bg-gray-900/50 hover:bg-gray-900/75 text-white rounded-full p-2"
            >
              <Info className="h-5 w-5" />
            </Button>
          </div>
          <div className="p-6 bg-gray-900 overflow-y-auto" style={{ height: 'calc(100% - 320px)' }}>
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-semibold text-gray-100">{profile.name}</h2>
                <span className="text-2xl" title={alignmentLabels[profile.personality.alignment]}>
                  {alignmentEmojis[profile.personality.alignment]}
                </span>
              </div>
              <Badge variant="secondary" className="bg-gray-700 text-gray-300">{profile.age}</Badge>
            </div>
            <p className="text-gray-400 mb-4">{profile.bio}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="outline" className="text-gray-400 border-gray-600">
                {alignmentLabels[profile.personality.alignment]}
              </Badge>
              {profile.personality.traits.map((trait: string, index: number) => (
                <Badge key={index} variant="outline" className="text-gray-400 border-gray-600">
                  {trait}
                </Badge>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                MBTI: {profile.personality.mbti}
              </Badge>
              <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                Power: {profile.powerLevel}
              </Badge>
              <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                {profile.rarity}
              </Badge>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      <div className="flex justify-around mt-4 pb-4 absolute bottom-0 left-0 right-0">
        <Button onClick={() => onSwipe("left")} className="bg-rose-500 hover:bg-rose-600 rounded-full p-4">
          <X className="w-8 h-8 text-white" />
        </Button>
        <Button onClick={onSuperlike} className="bg-blue-500 hover:bg-blue-600 rounded-full p-4">
          <Star className="w-8 h-8 text-white" />
        </Button>
        <Button onClick={() => onSwipe("right")} className="bg-green-500 hover:bg-green-600 rounded-full p-4">
          <Heart className="w-8 h-8 text-white" />
        </Button>
      </div>
    </div>
  );
};

export default DatingProfileGenerator;
