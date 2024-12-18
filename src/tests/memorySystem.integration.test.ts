import { PersonalityEvolutionService } from '../services/personalityEvolutionService';
import { prismaMock } from './setup';

describe('Memory System Integration Tests', () => {
  let evolutionService: PersonalityEvolutionService;
  
  const mockTokenId = 'test-token-123';
  const mockUserId = 'test-user-456';

  beforeEach(() => {
    evolutionService = new PersonalityEvolutionService();
    
    // Mock NFT Personality
    prismaMock.nFTPersonality.findUnique.mockResolvedValue({
      id: mockTokenId,
      tokenId: mockTokenId,
      baseTraits: { friendly: 0.8, curious: 0.7 },
      currentTraits: { friendly: 0.9, curious: 0.8 },
      backstory: "A friendly spirit",
      emotionalState: "neutral",
      metaAwareness: 0.5,
      powerLevel: 100,
      moonstoneBonus: 1.5,
      evolutionHistory: [],
      styleHistory: [],
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Mock Conversation
    prismaMock.conversation.create.mockResolvedValue({
      id: 'conv-123',
      nftId: mockTokenId,
      userId: mockUserId,
      messages: [],
      sentiment: 0.5,
      timestamp: new Date()
    });
  });

  test('Full interaction flow', async () => {
    const interaction = "Hello! How are you today?";
    
    const result = await evolutionService.processUserInteraction(
      mockTokenId,
      mockUserId,
      interaction
    );

    expect(result).toHaveProperty('response');
    expect(result).toHaveProperty('state');
    expect(result.loading).toBe(false);
    
    expect(prismaMock.memory.create).toHaveBeenCalled();
    expect(prismaMock.conversation.create).toHaveBeenCalled();
  });
}); 