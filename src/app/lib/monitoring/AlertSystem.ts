export enum AlertSeverity {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
    CRITICAL = "CRITICAL"
}

export interface AlertConfig {
    discordWebhookUrl?: string;
    criticalChannelWebhookUrl?: string;
    generalChannelWebhookUrl?: string;
}

export class AlertSystem {
    private config: AlertConfig;

    constructor(config?: AlertConfig) {
        this.config = config || {};
    }

    async alert(
        title: string,
        message: string,
        severity: AlertSeverity,
        metadata?: Record<string, any>
    ) {
        // Implementation here
    }
}
