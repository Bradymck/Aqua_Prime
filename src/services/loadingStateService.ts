interface LoadingState {
  isLoading: boolean;
  progress: number;
  stage: string;
  message: string;
}

export class LoadingStateService {
  private static instance: LoadingStateService;
  private currentState: LoadingState = {
    isLoading: false,
    progress: 0,
    stage: 'idle',
    message: ''
  };

  private readonly loadingMessages: Record<string, string[]> = {
    personalityEvolution: [
      "Evolving personality matrix...",
      "Adjusting emotional parameters...",
      "Calibrating response patterns..."
    ],
    contextProcessing: [
      "Processing conversation context...",
      "Analyzing interaction patterns...",
      "Updating knowledge base..."
    ]
  };

  updateLoadingState(
    stage: string,
    progress: number
  ): void {
    this.currentState = {
      isLoading: true,
      progress,
      stage,
      message: this.getLoadingMessage(stage)
    };
  }

  private getLoadingMessage(stage: string): string {
    const messages = this.loadingMessages[stage] || [];
    return messages[Math.floor(Math.random() * messages.length)] ||
           "Processing...";
  }
} 