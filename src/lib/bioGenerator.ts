interface ProfileData {
  rarity: string;
  alignment: string;
  traits: string[];
  personality?: string;
  [key: string]: any;
}

const bioTemplates = [
  (profile: ProfileData) => 
    `A ${profile.rarity.toLowerCase()} platypus with a ${profile.alignment.toLowerCase()} spirit. Seeking someone to share moonlit swims and underwater adventures.`,
  
  (profile: ProfileData) => 
    `${profile.alignment} soul seeking their perfect match. Love exploring tide pools and collecting shiny pebbles.`,
  
  (profile: ProfileData) => 
    `Adventurous ${profile.rarity.toLowerCase()} platypus looking for a companion to share life's mysteries. Expert in underwater tea parties.`,
  
  (profile: ProfileData) => 
    `Charming platypus of ${profile.rarity.toLowerCase()} distinction. Enjoys moonlit swims and philosophical discussions about water ripples.`,
  
  (profile: ProfileData) => 
    `${profile.alignment} platypus with a heart of gold. Seeking someone to share cozy burrow moments and starlit river walks.`
];

export async function generateBio(profile: ProfileData): Promise<string> {
  const template = bioTemplates[Math.floor(Math.random() * bioTemplates.length)];
  return template(profile);
} 