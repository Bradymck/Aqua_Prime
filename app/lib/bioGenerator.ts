const INTROS = [
  'A mysterious',
  'An adventurous',
  'A tech-savvy',
  'A playful',
  'A sophisticated'
];

const DESCRIPTORS = [
  'cyberpunk',
  'digital nomad',
  'code wizard',
  'data explorer',
  'virtual pioneer'
];

const ACTIVITIES = [
  'exploring the digital seas',
  'mining moonstones',
  'hacking the mainframe',
  'building virtual worlds',
  'collecting rare NFTs'
];

const GOALS = [
  'seeking digital connections',
  'looking for crypto companions',
  'searching for virtual adventures',
  'hunting for rare artifacts',
  'building the future of Web3'
];

export function generateBio(): string {
  const intro = INTROS[Math.floor(Math.random() * INTROS.length)];
  const descriptor = DESCRIPTORS[Math.floor(Math.random() * DESCRIPTORS.length)];
  const activity = ACTIVITIES[Math.floor(Math.random() * ACTIVITIES.length)];
  const goal = GOALS[Math.floor(Math.random() * GOALS.length)];

  return `${intro} ${descriptor} ${activity} while ${goal}.`;
}