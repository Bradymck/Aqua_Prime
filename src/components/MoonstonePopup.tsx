import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { useMoonstonePopup } from '../hooks/useMoonstonePopup';

interface MoonstonePopupProps {
  showMoonstonePopup: boolean;
  setShowMoonstonePopup: (show: boolean) => void;
  moonstoneBalance: number;
  setMoonstoneBalance: (balance: number) => void;
  setBatteryLevel: (level: number) => void;
  setIsNFTPoweredDown: (isPoweredDown: boolean) => void;
  setButtonState: React.Dispatch<React.SetStateAction<'collect' | 'mint' | 'burn'>>;
  playClickSound: () => void;
}

export function MoonstonePopup({
  showMoonstonePopup,
  setShowMoonstonePopup,
  moonstoneBalance,
  setMoonstoneBalance,
  setBatteryLevel,
  setIsNFTPoweredDown,
  setButtonState,
  playClickSound
}: MoonstonePopupProps) {
  const { isOpen, togglePopup } = useMoonstonePopup();

  const handleBurnMoonstone = () => {
    if (moonstoneBalance > 0) {
      setMoonstoneBalance(moonstoneBalance - 1);
      setBatteryLevel(Math.min(100, moonstoneBalance * 20 + 20));
      setIsNFTPoweredDown(false);
      setButtonState('collect');
      playClickSound();
    }
  };

  const isProcessing = false; // You might want to implement this state if needed

  return (
    <>
      {showMoonstonePopup && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50"
          onClick={() => setShowMoonstonePopup(false)}
        >
          <Card 
            className="w-full max-w-lg bg-gradient-to-br from-cyan-500 to-blue-600 border-none shadow-2xl backdrop-blur-md"
            onClick={(e) => e.stopPropagation()}
          >
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold mb-4 text-center text-white">Moonstone Power</h2>
              <p className="text-lg text-center text-white mb-8">You have {moonstoneBalance} moonstones</p>
              <Button
                className="w-full py-4 text-xl font-bold bg-yellow-400 hover:bg-yellow-500 text-blue-900 backdrop-blur-md"
                onClick={handleBurnMoonstone}
                disabled={isProcessing || moonstoneBalance === 0}
              >
                {isProcessing ? "Processing..." : "Burn Moonstone"}
              </Button>
              <p className="text-sm text-center text-white mt-4">Burn moonstones to power your ARI</p>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </>
  );
}
