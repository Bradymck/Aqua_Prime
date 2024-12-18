interface AlertConfig {
    webhookUrl: string;
    channels: {
        critical: string;
        general: string;
        alerts: string;
    };
} 