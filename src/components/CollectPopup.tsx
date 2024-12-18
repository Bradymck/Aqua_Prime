import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';
import { NFTStack } from './NFTStack';

interface CollectPopupProps {
  showCollectPopup: boolean;
  setShowCollectPopup: (show: boolean) => void;
  mintCount: number;
  setMintCount: (count: number) => void;
  handleMint: (count: number) => void;
  isProcessing: boolean;
  playClickSound: () => void;
}

export function CollectPopup({
  showCollectPopup,
  setShowCollectPopup,
  mintCount,
  setMintCount,
  handleMint,
  isProcessing,
  playClickSound
}: CollectPopupProps) {
  return (
    <>
      {showCollectPopup && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50"
          onClick={() => setShowCollectPopup(false)}
        >
          <Card 
            className="w-full max-w-lg bg-gradient-to-br from-cyan-500 to-blue-600 border-none shadow-2xl backdrop-blur-md"
            onClick={(e) => e.stopPropagation()}
          >
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold mb-8 text-center text-white">How many NFTs?</h2>
              <div className="grid grid-cols-3 gap-6 mb-8">
                {[1, 5, 10].map(count => (
                  <div key={count} className="flex flex-col items-center">
                    <Button
                      onClick={() => {
                        playClickSound();
                        setMintCount(count);
                      }}
                      variant={mintCount === count ? "default" : "outline"}
                      className={`w-full h-40 text-2xl font-bold ${
                        mintCount === count
                          ? "bg-yellow-400 hover:bg-yellow-500 text-blue-900"
                          : "bg-blue-700 hover:bg-blue-600 text-white"
                      } backdrop-blur-md relative overflow-hidden mb-2`}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <NFTStack count={count} />
                      </div>
                    </Button>
                    <span className="text-white text-lg font-semibold">{count}</span>
                  </div>
                ))}
              </div>
              <Button
                className="w-full py-4 text-xl font-bold bg-yellow-400 hover:bg-yellow-500 text-blue-900 backdrop-blur-md"
                onClick={() => {
                  playClickSound();
                  handleMint(mintCount);
                }}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                ) : null}
                Mint {mintCount} NFT{mintCount > 1 ? 's' : ''}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </>
  );
}