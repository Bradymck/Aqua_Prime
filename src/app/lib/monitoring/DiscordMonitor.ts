import { Client, GatewayIntentBits, TextChannel } from 'discord.js';
import { ethers } from 'ethers';

interface DiscordMonitorConfig {
    botToken: string;
    guildId: string;
    alertChannelId: string;
    adminChannelId: string;
    adminRoleId: string;
    contractAddress?: string;
}

export class DiscordMonitor {
    private client: Client;
    private config: DiscordMonitorConfig;
    private provider?: ethers.Provider;

    constructor(config: DiscordMonitorConfig) {
        this.config = config;
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent
            ]
        });

        if (config.contractAddress) {
            this.provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
        }

        this.setupEventHandlers();
    }

    private setupEventHandlers() {
        this.client.on('ready', () => {
            console.log(`Logged in as ${this.client.user?.tag}`);
        });

        this.client.on('error', error => {
            console.error('Discord client error:', error);
        });
    }

    async start() {
        try {
            await this.client.login(this.config.botToken);
            console.log('Discord monitor started successfully');

            if (this.provider && this.config.contractAddress) {
                // Setup contract monitoring here if needed
                console.log('Contract monitoring enabled');
            }
        } catch (error) {
            console.error('Failed to start Discord monitor:', error);
            throw error;
        }
    }

    async stop() {
        this.client.destroy();
        console.log('Discord monitor stopped');
    }
} 