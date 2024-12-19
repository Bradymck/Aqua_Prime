import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

const getRandomItem = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

const generateRandomBio = () => {
  const bios = [
    "Looking for my perfect match in the digital world! 🌐",
    "Tech enthusiast seeking meaningful connections",
    "Here to meet fellow crypto lovers",
    "Web3 native searching for the one",
    "DeFi degen with a heart of gold",
  ];
  return getRandomItem(bios);
};

const generateRandomTraits = () => {
  const traits = ["Friendly", "Adventurous", "Creative", "Analytical", "Passionate"];
  return traits.slice(0, Math.floor(Math.random() * 3) + 1);
};

const generateRandomGoals = () => {
  const goals = ["Build the future of web3", "Create innovative DApps", "Grow the crypto community"];
  return goals.slice(0, Math.floor(Math.random() * 2) + 1);
};

const generateRandomFlaws = () => {
  const flaws = ["Workaholic", "Too passionate", "Perfectionist"];
  return flaws.slice(0, Math.floor(Math.random() * 2) + 1);
};

const AVAILABLE_TRAITS = {
  background: ["Blue", "Red", "Green"],
  skin: ["Default", "Cyber", "Neon"],
  eyes: ["Normal", "Cool", "Cute"],
  bill: ["Standard", "Fancy", "Tech"],
  clothes: ["Casual", "Formal", "Punk"],
  tail: ["Short", "Long", "Curly"],
  head: ["None", "Hat", "Crown"],
  feet: ["Normal", "Boots", "Sneakers"],
  leftHand: ["Empty", "Phone", "Laptop"],
  rightHand: ["Empty", "Coffee", "Token"]
};

async function main() {
  // Clear existing pool profiles
  await prisma.profile.deleteMany({
    where: {
      isInGlobalPool: true
    }
  });

  // Create 20 initial pool profiles
  const poolProfiles = Array.from({ length: 20 }, () => ({
    name: `Platypus #${Math.floor(Math.random() * 10000)}`,
    bio: generateRandomBio(),
    location: "Platypus Passions",
    isInGlobalPool: true,
    isActive: true,
    nftMetadata: {
      background: getRandomItem(AVAILABLE_TRAITS.background),
      skin: getRandomItem(AVAILABLE_TRAITS.skin),
      eyes: getRandomItem(AVAILABLE_TRAITS.eyes),
      bill: getRandomItem(AVAILABLE_TRAITS.bill),
      clothes: getRandomItem(AVAILABLE_TRAITS.clothes),
      tail: getRandomItem(AVAILABLE_TRAITS.tail),
      head: getRandomItem(AVAILABLE_TRAITS.head),
      feet: getRandomItem(AVAILABLE_TRAITS.feet),
      leftHand: getRandomItem(AVAILABLE_TRAITS.leftHand),
      rightHand: getRandomItem(AVAILABLE_TRAITS.rightHand),
      alignment: getRandomItem(['White Hat', 'Grey Hat', 'Black Hat']),
      faction: getRandomItem(['Cyber Knights', 'Data Pirates', 'Code Monks']),
      mbti: getRandomItem(['INTJ', 'INTP', 'ENTJ', 'ENTP']),
      zodiac: getRandomItem(['Aries', 'Taurus', 'Gemini', 'Cancer']),
      goals: generateRandomGoals(),
      flaws: generateRandomFlaws(),
      stats: {
        strength: Math.floor(Math.random() * 100),
        intelligence: Math.floor(Math.random() * 100),
        charisma: Math.floor(Math.random() * 100),
        luck: Math.floor(Math.random() * 100)
      },
      personalityTraits: generateRandomTraits(),
      visualTraits: [],
      hormonalTraits: [
        {
          level: Math.floor(Math.random() * 100),
          baseline: Math.floor(Math.random() * 100),
          volatility: Math.floor(Math.random() * 100),
          recovery: Math.floor(Math.random() * 100)
        }
      ],
      characterTraits: {
        strength: Math.floor(Math.random() * 100),
        intelligence: Math.floor(Math.random() * 100),
        charisma: Math.floor(Math.random() * 100),
        luck: Math.floor(Math.random() * 100)
      }
    }
  }));

  for (const profile of poolProfiles) {
    await prisma.profile.create({
      data: profile
    });
  }

  console.log('Added 20 profiles to the pool');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 