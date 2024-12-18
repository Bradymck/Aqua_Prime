import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';

interface MintPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onMint: () => void;
  isProcessing: boolean;
}

export function MintPopup({
  isOpen,
  onClose,
  onMint,
  isProcessing,
}: MintPopupProps) {
  return (
    <>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <Card className="w-96 bg-white relative">
            <button
              onClick={onClose}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">Mint Your NFT</h2>
              <p className="text-sm text-gray-500 mb-4">
                You&apos;re about to mint your unique AquaPrime character NFT!
              </p>
              <Button
                className="w-full py-4 text-xl font-bold bg-yellow-400 hover:bg-yellow-500 text-blue-900 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={onMint}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                    Minting...
                  </>
                ) : (
                  'Mint NFT'
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </>
  );
}
