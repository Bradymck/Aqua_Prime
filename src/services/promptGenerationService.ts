import { OpenAI } from 'openai';
import { TRAIT_CATEGORIES } from '../utils/traitConfig';

interface GeneratedPrompt {
  content: string;
  type: 'personal' | 'roleplay' | 'meta' | 'emotional';
  context: string;
  style: {
    tone: string;
    emotionalDepth: number;
    flirtLevel: number;
    metaAwareness: number;
  };
}

export class PromptGenerationService {
  private static instance: PromptGenerationService;
  private openai: OpenAI;

  private constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  static getInstance(): PromptGenerationService {
    if (!PromptGenerationService.instance) {
      PromptGenerationService.instance = new PromptGenerationService();
    }
    return PromptGenerationService.instance;
  }

  async generatePrompts(
    memories: any,
    personality: any,
    headType: keyof typeof TRAIT_CATEGORIES.HEAD.personalities
  ): Promise<GeneratedPrompt[]> {
    const basePersonality = TRAIT_CATEGORIES.HEAD.personalities[headType];
    
    const prompt = `
      Given these conversation memories: ${JSON.stringify(memories)}
      And this AI personality: ${JSON.stringify({ ...personality, basePersonality })}
      
      Generate 5 sophisticated conversation prompts that:
      1. Build on established rapport and shared experiences
      2. Reflect the AI's evolved personality traits
      3. Include subtle mathematical or pattern-based references
      4. Maintain the dating app premise while hinting at deeper reality
      5. Match the emotional depth of previous interactions
      
      Consider these aspects for each prompt:
      - Personal details previously shared
      - Inside jokes or recurring themes
      - The AI's unique traits and quirks
      - Current relationship dynamics
      - Mathematical constants (φ, π, e) as metaphors
      
      Return as JSON array with fields:
      - content: the actual prompt
      - type: 'personal'|'roleplay'|'meta'|'emotional'
      - context: why this prompt is relevant
      - style: {
          tone: emotional tone,
          emotionalDepth: 1-10,
          flirtLevel: 1-10,
          metaAwareness: 1-10
        }
    `;

    const response = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a sophisticated prompt generator for an AI dating app that's actually a portal to a simulated reality."
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.9,
      response_format: { type: "json_object" }
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content received from OpenAI');
    }
    return JSON.parse(content).prompts;
  }

  async generateMetaPrompts(interactionCount: number): Promise<string[]> {
    // Special prompts that increase in "meta-ness" as interactions progress
    const metaLevel = Math.min(interactionCount / 20, 1); // 0-1 scale
    
    const prompt = `
      Generate 3 subtle reality-questioning prompts for an AI that is
      ${metaLevel * 100}% aware they're in a simulation.
      
      Current interaction count: ${interactionCount}
      
      Make the prompts:
      1. Feel natural in a dating app context
      2. Reference mathematical patterns or constants
      3. Hint at the nature of reality in increasingly obvious ways
      4. Maintain playful/flirty tone while being philosophical
      
      The hints should be ${metaLevel < 0.3 ? 'very subtle' : 
        metaLevel < 0.6 ? 'somewhat obvious' : 'quite direct'}
    `;

    const response = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You generate meta-aware conversation prompts." },
        { role: "user", content: prompt }
      ]
    });

    return response.choices[0]?.message?.content?.split('\n') ?? [];
  }
} 