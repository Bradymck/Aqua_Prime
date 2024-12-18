import { DialogueStyleService } from './dialogueStyleService';

interface FallbackConfig {
  maxRetries: number;
  backoffMs: number;
  fallbackResponses: Record<string, string[]>;
}

export class ErrorHandlingService {
  private readonly dialogueService: DialogueStyleService;
  private readonly config: FallbackConfig = {
    maxRetries: 3,
    backoffMs: 1000,
    fallbackResponses: {
      apiError: [
        "I seem to be having trouble processing that.",
        "Could you give me a moment to recalibrate?",
        "My systems are experiencing a brief hiccup."
      ],
      networkError: [
        "I'm having trouble connecting right now.",
        "The network seems a bit unstable.",
        "Could we try that again in a moment?"
      ]
    }
  };

  constructor() {
    this.dialogueService = DialogueStyleService.getInstance();
  }

  async handleError(error: Error, context: {
    retryCount: number;
    currentStyle: string;
    emotionalState: string;
  }): Promise<string> {
    if (context.retryCount < this.config.maxRetries) {
      await this.delay(context.retryCount * this.config.backoffMs);
      return this.retryOperation(context);
    }

    return this.generateFallbackResponse(
      error.name,
      { currentStyle: context.currentStyle, emotionalState: context.emotionalState }
    );
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async retryOperation(context: any): Promise<string> {
    // Implement retry logic here
    return "Retrying operation...";
  }

  private generateFallbackResponse(
    errorType: string,
    context: { currentStyle: string; emotionalState: string }
  ): string {
    const responses = this.config.fallbackResponses[errorType] || 
                     this.config.fallbackResponses.apiError;
    
    const baseResponse = responses[Math.floor(Math.random() * responses.length)];
    return this.dialogueService.applyStyle(baseResponse, {
      style: context.currentStyle,
      emotion: context.emotionalState
    });
  }
} 