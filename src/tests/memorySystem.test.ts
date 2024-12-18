import { SystemOrchestrator } from '../services/systemOrchestrator';
import { PersonalityEvolutionService } from '../services/personalityEvolutionService';
import { prismaMock } from './setup';

describe('Memory System Integration', () => {
  let evolutionService: PersonalityEvolutionService;
  
  const mockTokenId = 1;
  const mockUserId = 'test-user-456';
  
  beforeEach(() => {
    evolutionService = new PersonalityEvolutionService();
    
    prismaMock.nFTMetadata.findUnique.mockResolvedValue({
      tokenId: mockTokenId,
      ownerAddress: mockUserId,
      metadataUri: "ipfs://test-metadata",
      imageUri: "ipfs://test-image",
      dialogueStyle: ["friendly", "casual"],
      lastInteraction: new Date(),
      balance: 1000,
      traits: {
        head: "Cool Hat",
        personality: ["brave", "witty"],
        powerLevel: 100,
        rarity: "rare",
        moonstoneBonus: 1.5
      }
    });
  });

  test('Memory creation and retrieval', async () => {
    const interaction = "Hello! I'm excited to meet you!";
    
    prismaMock.nFTInteraction.create.mockResolvedValue({
      tokenId: mockTokenId,
      type: "CHAT",
      timestamp: new Date(),
      metadata: { message: interaction }
    });

    const result = await evolutionService.processUserInteraction(
      mockTokenId.toString(),
      mockUserId,
      interaction
    );

    expect(result).toHaveProperty('response');
    expect(prismaMock.nFTInteraction.create).toHaveBeenCalledWith({
      data: {
        tokenId: mockTokenId,
        type: "CHAT",
        metadata: expect.any(Object)
      }
    });
  });
}); 