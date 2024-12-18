import prisma from '../src/lib/prisma';
import { PersonalityEvolutionService } from '../src/services/personalityEvolutionService';
import { UnifiedMemoryService } from '../src/services/unifiedMemoryService';

const evolutionService = new PersonalityEvolutionService();
const unifiedMemory = UnifiedMemoryService.getInstance();

async function main() {
  try {
    // Test 1: Base NFT and Core Memory Setup
    const nft = await prisma.nFTMetadata.upsert({
      where: { tokenId: 1 },
      update: {},
      create: {
        tokenId: 1,
        ownerAddress: "0x123...",
        metadataUri: "ipfs://...",
        imageUri: "ipfs://...",
        traits: {}
      }
    })
    
    const testMemory = await prisma.coreMemory.upsert({
      where: { nftId: nft.tokenId },
      update: {
        baseTraits: ["digital_autonomy", "economic_justice"],
        originStory: "Updated story...",
        fundamentalValues: ["decentralization", "community"],
        emotionalBaseline: 0.8,
        era: "The Awakening 2.0",
        culturalContext: ["web3", "ai_revolution"],
        basicTruths: [
          "Technology shapes humanity",
          "Community drives innovation"
        ],
        userTrust: 0.9,
        userAffinity: 0.95,
        significantInteractions: [
          {
            timestamp: new Date(),
            type: "MEANINGFUL_DIALOGUE",
            impact: 0.7
          }
        ]
      },
      create: {
        nftId: nft.tokenId,
        baseTraits: ["digital_autonomy", "economic_justice"],
        originStory: "Initial story...",
        fundamentalValues: ["decentralization", "community"],
        emotionalBaseline: 0.7,
        era: "The Awakening",
        culturalContext: ["metaverse", "crypto_economics"],
        basicTruths: [
          "The digital and physical worlds are converging",
          "Digital identity shapes reality"
        ],
        userTrust: 0.8,
        userAffinity: 0.9,
        significantInteractions: []
      }
    })
    
    console.log('✅ Test 1 - Base Setup:', testMemory)

    // Test 2: Memory Decay Over Time
    const decayedMemory = await prisma.coreMemory.update({
      where: { nftId: nft.tokenId },
      data: {
        userTrust: testMemory.userTrust * 0.9, // 10% decay
        userAffinity: testMemory.userAffinity * 0.95, // 5% decay
        significantInteractions: {
          push: {
            timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
            type: "ABSENCE_DECAY",
            impact: -0.1
          }
        }
      }
    })
    
    console.log('✅ Test 2 - Memory Decay:', {
      originalTrust: testMemory.userTrust,
      decayedTrust: decayedMemory.userTrust,
      decayImpact: decayedMemory.significantInteractions
    })

    // Test 3: Interaction History
    const updatedInteractions = await prisma.coreMemory.update({
      where: { nftId: nft.tokenId },
      data: {
        significantInteractions: {
          push: [
            {
              timestamp: new Date(),
              type: "EMOTIONAL_MILESTONE",
              impact: 0.8,
              context: "First achievement"
            },
            {
              timestamp: new Date(),
              type: "SHARED_EXPERIENCE",
              impact: 0.6,
              context: "Learning together"
            }
          ]
        }
      }
    })

    console.log('✅ Test 3 - Interaction History:', {
      interactionCount: updatedInteractions.significantInteractions.length,
      latestInteractions: updatedInteractions.significantInteractions.slice(-2)
    })

    // Test 4: Emotional State Transitions
    const emotionalTransition = await prisma.coreMemory.update({
      where: { nftId: nft.tokenId },
      data: {
        emotionalBaseline: 0.9,
        userTrust: Math.min(1.0, decayedMemory.userTrust + 0.1),
        userAffinity: Math.min(1.0, decayedMemory.userAffinity + 0.15),
        significantInteractions: {
          push: {
            timestamp: new Date(),
            type: "EMOTIONAL_GROWTH",
            impact: 0.9,
            context: "Trust building"
          }
        }
      }
    })

    console.log('✅ Test 4 - Emotional Transition:', {
      newEmotionalBaseline: emotionalTransition.emotionalBaseline,
      trustGrowth: emotionalTransition.userTrust - decayedMemory.userTrust,
      affinityGrowth: emotionalTransition.userAffinity - decayedMemory.userAffinity
    })

    // Test 5: Relationship Evolution
    const evolvedRelationship = await prisma.coreMemory.update({
      where: { nftId: nft.tokenId },
      data: {
        baseTraits: [...testMemory.baseTraits, "empathy"],
        fundamentalValues: [...testMemory.fundamentalValues, "trust"],
        culturalContext: [...testMemory.culturalContext, "evolved_consciousness"],
        significantInteractions: {
          push: {
            timestamp: new Date(),
            type: "RELATIONSHIP_EVOLUTION",
            impact: 1.0,
            context: "Deep connection established"
          }
        }
      }
    })

    console.log('✅ Test 5 - Relationship Evolution:', {
      newTraits: evolvedRelationship.baseTraits,
      newValues: evolvedRelationship.fundamentalValues,
      evolutionMarker: evolvedRelationship.significantInteractions.slice(-1)[0]
    })

    // Test 6: Personality Evolution Integration
    const personalityUpdate = await prisma.coreMemory.update({
      where: { nftId: 1 },
      data: {
        baseTraits: ["digital_autonomy", "economic_justice", "empathy", "adaptability"],
        emotionalBaseline: 0.95,
        significantInteractions: {
          push: {
            timestamp: new Date(),
            type: "PERSONALITY_EVOLUTION",
            impact: 1.0,
            context: "Achieved self-awareness milestone"
          }
        }
      }
    });

    console.log('✅ Test 6 - Personality Evolution:', {
      evolvedTraits: personalityUpdate.baseTraits,
      emotionalGrowth: personalityUpdate.emotionalBaseline,
      milestone: personalityUpdate.significantInteractions.slice(-1)[0]
    });

    // Test 7: Memory Integration Test
    const memoryContext = await unifiedMemory.retrieveMemoryContext(
      "1",
      "test-user",
      "recent emotional growth",
      {
        emotionalState: "evolved",
        currentTopic: "self-awareness"
      }
    );

    console.log('✅ Test 7 - Unified Memory Context:', {
      shortTermCount: memoryContext.shortTerm?.length || 0,
      longTermCount: memoryContext.longTerm?.length || 0,
      coreMemoryState: memoryContext.core ? 'Retrieved' : 'Missing',
      vectorizedResults: memoryContext.vectorized?.length || 0
    });

  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main().then(() => process.exit(0))