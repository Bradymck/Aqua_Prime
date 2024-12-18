const EventEmitter = require('events');

class PlatformConnector extends EventEmitter {
    constructor(character) {
        super();
        this.character = character;
        this.messageQueue = [];
        this.isProcessing = false;
    }

    async initialize() {
        throw new Error('initialize() must be implemented by platform connector');
    }

    async processMessage(message) {
        // Apply character's personality and style
        const response = await this.character.generateResponse(message);
        return this.formatResponse(response);
    }

    formatResponse(response) {
        // Apply platform-specific formatting
        return response;
    }

    async queueMessage(message) {
        this.messageQueue.push(message);
        if (!this.isProcessing) {
            await this.processQueue();
        }
    }

    async processQueue() {
        if (this.messageQueue.length === 0) {
            this.isProcessing = false;
            return;
        }

        this.isProcessing = true;
        const message = this.messageQueue.shift();
        
        try {
            const response = await this.processMessage(message);
            await this.sendResponse(response, message);
        } catch (error) {
            console.error('Error processing message:', error);
        }

        await this.processQueue();
    }

    async sendResponse(response, originalMessage) {
        throw new Error('sendResponse() must be implemented by platform connector');
    }
}

module.exports = PlatformConnector; 