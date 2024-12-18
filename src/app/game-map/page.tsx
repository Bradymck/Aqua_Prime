'use client'

import React from 'react';
import dynamic from 'next/dynamic'

const GameMap = dynamic(() => import('../../components/GameMap'), { ssr: false })

export default function GameMapPage() {
  return (
    <div>
      <h1>Game Map</h1>
      {/* Add your game map content here */}
    </div>
  );
}
