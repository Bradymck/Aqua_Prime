interface ContextState {
  currentTopic: string;
  recentTopics: string[];
  emotionalContext: {
    userMood: string;
    aiMood: string;
    interactionTone: string;
  };
  conversationDepth: number;
  topicRelevance: Record<string, number>;
}

export class ContextManagementService {
  private contextState: ContextState;
  private readonly maxTopicHistory: number = 10;
  private readonly relevanceDecayRate: number = 0.1;

  constructor() {
    this.contextState = {
      currentTopic: '',
      recentTopics: [],
      emotionalContext: {
        userMood: 'neutral',
        aiMood: 'neutral',
        interactionTone: 'casual'
      },
      conversationDepth: 0,
      topicRelevance: {}
    };
  }

  updateContext(
    newMessage: string,
    sentiment: number,
    currentStyle: string
  ): void {
    const topic = this.extractTopic(newMessage);
    this.updateTopicHistory(topic);
    this.updateEmotionalContext(sentiment);
    this.adjustConversationDepth(newMessage);
    this.decayTopicRelevance();
  }

  private updateTopicHistory(topic: string): void {
    if (!this.contextState.recentTopics.includes(topic)) {
      this.contextState.recentTopics.unshift(topic);
      if (this.contextState.recentTopics.length > this.maxTopicHistory) {
        this.contextState.recentTopics.pop();
      }
    }
    this.contextState.currentTopic = topic;
  }

  private updateEmotionalContext(sentiment: number): void {
    this.contextState.emotionalContext.userMood = this.getSentimentMood(sentiment);
    this.contextState.emotionalContext.aiMood = this.getResponseMood(
      this.contextState.emotionalContext.userMood
    );
  }

  private adjustConversationDepth(message: string): void {
    // Increment depth based on message complexity and context
    const complexity = this.calculateMessageComplexity(message);
    this.contextState.conversationDepth += complexity;
  }

  private decayTopicRelevance(): void {
    Object.keys(this.contextState.topicRelevance).forEach(topic => {
      this.contextState.topicRelevance[topic] *= (1 - this.relevanceDecayRate);
      if (this.contextState.topicRelevance[topic] < 0.1) {
        delete this.contextState.topicRelevance[topic];
      }
    });
  }

  private extractTopic(message: string): string {
    // Simple topic extraction - could be enhanced with NLP
    const keywords = message.toLowerCase().split(' ');
    const topics = {
      'dating': ['date', 'relationship', 'love', 'together'],
      'hobbies': ['hobby', 'interest', 'like', 'enjoy'],
      'platypus life': ['platypus', 'swim', 'bill', 'egg'],
      'simulation': ['reality', 'simulation', 'virtual', 'digital']
    };

    for (const [topic, words] of Object.entries(topics)) {
      if (words.some(word => keywords.includes(word))) {
        return topic;
      }
    }
    return 'general';
  }

  private getSentimentMood(sentiment: number): string {
    if (sentiment > 0.5) return 'happy';
    if (sentiment < -0.5) return 'sad';
    return 'neutral';
  }

  private getResponseMood(userMood: string): string {
    // Match or complement user's mood based on personality
    const moodMap: Record<string, string> = {
      'happy': 'happy',
      'sad': 'empathetic',
      'neutral': 'interested'
    };
    return moodMap[userMood] || 'neutral';
  }

  private calculateMessageComplexity(message: string): number {
    // Simple complexity calculation
    const words = message.split(' ').length;
    const hasQuestions = message.includes('?');
    const hasEmotions = /[!?♥️😊😢]/g.test(message);
    
    return (words / 10) + (hasQuestions ? 0.5 : 0) + (hasEmotions ? 0.3 : 0);
  }

  getContextualResponse(
    baseResponse: string,
    currentContext: ContextState
  ): string {
    // Modify response based on context
    let response = baseResponse;

    // Add topic references
    if (currentContext.currentTopic) {
      response = this.addTopicReference(response, currentContext.currentTopic);
    }

    // Adjust emotional tone
    response = this.adjustTone(response, currentContext.emotionalContext.aiMood);

    // Add depth based on conversation progress
    if (currentContext.conversationDepth > 5) {
      response = this.addDepthMarkers(response);
    }

    return response;
  }

  private addTopicReference(response: string, topic: string): string {
    const topicPhrases = {
      'dating': ['Speaking of relationships', 'As we get to know each other'],
      'hobbies': ['Given your interests', 'Considering what you enjoy'],
      'platypus life': ['As a platypus', 'In my experience'],
      'simulation': ['In this reality', 'Within our digital space']
    };

    const phrases = topicPhrases[topic as keyof typeof topicPhrases] || [];
    if (phrases.length && Math.random() > 0.5) {
      return `${phrases[Math.floor(Math.random() * phrases.length)]}, ${response}`;
    }
    return response;
  }

  private adjustTone(response: string, mood: string): string {
    const toneMarkers = {
      'happy': ['😊', '♥️', '!'],
      'empathetic': ['💕', '🤗'],
      'interested': ['🤔', '✨']
    };

    const markers = toneMarkers[mood as keyof typeof toneMarkers] || [];
    if (markers.length && Math.random() > 0.7) {
      return `${response} ${markers[Math.floor(Math.random() * markers.length)]}`;
    }
    return response;
  }

  private addDepthMarkers(response: string): string {
    const depthPhrases = [
      "I've been thinking about",
      "It's interesting how",
      "Perhaps we could explore",
      "I wonder if"
    ];

    if (Math.random() > 0.7) {
      const phrase = depthPhrases[Math.floor(Math.random() * depthPhrases.length)];
      return response.replace(/^/, `${phrase} `);
    }
    return response;
  }
} 