import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface SimpTodayProps {
  profile: {
    name: string;
    traits: string[];
  };
  onClose: () => void;
  onSimp: () => void;
}

const SimpToday: React.FC<SimpTodayProps> = ({ profile, onClose, onSimp }) => {
  const getRandomPrice = () => {
    return Math.floor(Math.random() * 100 + 10);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <Card className="w-[350px] bg-gray-800 text-white">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-center">Super Like Activated!</h2>
          <p className="mb-4 text-center">
            Congratulations! You&apos;ve super-liked {profile.name}. 
            As a {profile.traits[0]} platypus, your special price is:
          </p>
          <p className="text-3xl font-bold text-center text-green-400 mb-4">
            {getRandomPrice()} 🐚
          </p>
          <p className="text-sm text-gray-400 mb-6 text-center">
            *Price may vary based on your genetic modifications, time-traveling abilities, and interdimensional credit score.
          </p>
          <div className="flex justify-center space-x-4">
            <Button onClick={onClose} variant="outline">
              No thanks
            </Button>
            <Button onClick={onSimp} className="bg-pink-600 hover:bg-pink-700">
              Pay Now!
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SimpToday;
