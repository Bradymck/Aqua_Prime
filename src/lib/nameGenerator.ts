const prefixes = ['Captain', 'Dr.', 'Sir', 'Lady', 'Professor', 'Admiral', 'Duke', 'Duchess', 'Count', 'Countess'];
const names = ['Waddles', 'Bill', 'Splash', 'Ripple', 'Ducky', 'Bubbles', 'Quack', 'Paddle', 'Wave', 'Stream'];
const suffixes = ['Jr.', 'III', 'PhD', 'Esq.', 'the Wise', 'the Brave', 'the Curious', 'of the Lake', 'von River', 'the Adventurous'];

export function generateName(): string {
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const name = names[Math.floor(Math.random() * names.length)];
  const useSuffix = Math.random() > 0.5;
  const suffix = useSuffix ? ` ${suffixes[Math.floor(Math.random() * suffixes.length)]}` : '';

  return `${prefix} ${name}${suffix}`;
} 