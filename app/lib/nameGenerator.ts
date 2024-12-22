const PREFIXES = [
  'Cyber', 'Neo', 'Digital', 'Quantum', 'Tech', 'Data', 'Binary', 'Pixel', 'Virtual', 'Crypto'
];

const NAMES = [
  'Platypus', 'Duck', 'Bill', 'Swimmer', 'Diver', 'Explorer', 'Hunter', 'Seeker', 'Wanderer', 'Scout'
];

const SUFFIXES = [
  'Prime', 'Alpha', 'Zero', 'One', 'X', 'Core', 'Node', 'Link', 'Net', 'Wave'
];

export function generateName(): string {
  const prefix = PREFIXES[Math.floor(Math.random() * PREFIXES.length)];
  const name = NAMES[Math.floor(Math.random() * NAMES.length)];
  const suffix = SUFFIXES[Math.floor(Math.random() * SUFFIXES.length)];

  return `${prefix}${name}${suffix}`;
}