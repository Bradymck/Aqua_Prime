'use client';

import { DatingProfileGenerator } from '@bradymck/ap-private';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">
          Aqua Prime: Platypus Passions
        </h1>
        <DatingProfileGenerator />
      </div>
    </main>
  );
}