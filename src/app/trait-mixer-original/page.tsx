'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const TraitMixer = dynamic(() => import('../../components/TraitMixer'), { ssr: false });

export default function TraitMixerOriginalPage() {
  return (
    <div>
      <h1>Trait Mixer Original</h1>
      {/* Add your trait mixer original content here */}
    </div>
  );
}
