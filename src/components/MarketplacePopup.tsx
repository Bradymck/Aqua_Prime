import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from './ui/card';

interface MarketplacePopupProps {
  showMarketplace: boolean;
  setShowMarketplace: (show: boolean) => void;
}

export function MarketplacePopup({ showMarketplace, setShowMarketplace }: MarketplacePopupProps) {
  // Remove these lines
  // const [_isMicActive, _setIsMicActive] = useState(false);
  // const [_moonstoneEffectCount, _setMoonstoneEffectCount] = useState(0);

  useEffect(() => {
    // Your effect code here
  }, []); // Remove _isMicActive from the dependency array

  return (
    <>
      {showMarketplace && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50"
          onClick={() => setShowMarketplace(false)}
        >
          <Card 
            className="w-full max-w-lg bg-gradient-to-br from-cyan-500 to-blue-600 border-none shadow-2xl backdrop-blur-md"
            onClick={(e) => e.stopPropagation()}
          >
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold mb-8 text-center text-white">Marketplace</h2>
              {/* Add your marketplace content here */}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </>
  );
}