export interface KnowledgeContext {
    worldState: {
        currentEra: string;
        activeEvents: string[];
    };
    personalHistory: {
        experiences: string[];
        relationships: Record<string, number>;
    };
}

export interface DialogueModifiers {
    tone?: string;
    style?: string;
    constraints?: string[];
    preferences?: Record<string, any>;
}
