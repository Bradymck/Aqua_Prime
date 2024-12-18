const RARITY_TIERS: Record<RarityTier, { powerMultiplier: number }> = {
  Common: {
    powerMultiplier: 1
  },
  Uncommon: {
    powerMultiplier: 1.25
  },
  Rare: {
    powerMultiplier: 1.5
  },
  Epic: {
    powerMultiplier: 2
  },
  Legendary: {
    powerMultiplier: 3
  }
} as const;
