const Redis = require('ioredis');

class TTSCache {
    constructor() {
        this.redis = new Redis({
            host: process.env.REDIS_HOST || 'localhost',
            port: process.env.REDIS_PORT || 6379,
            password: process.env.REDIS_PASSWORD,
            retryStrategy: (times) => Math.min(times * 50, 2000),
        });

        this.redis.on('error', (err) => {
            console.error('Redis connection error:', err);
        });
    }

    /**
     * Get cached audio URL by text hash
     */
    async getAudioUrl(textHash) {
        try {
            return await this.redis.get(`tts:audio:${textHash}`);
        } catch (err) {
            console.error('Failed to get TTS cache:', err);
            return null;
        }
    }

    /**
     * Cache synthesized audio URL
     * Default TTL: 30 days
     */
    async setAudioUrl(textHash, audioUrl, ttl = 2592000) {
        try {
            await this.redis.set(`tts:audio:${textHash}`, audioUrl, 'EX', ttl);
            return true;
        } catch (err) {
            console.error('Failed to set TTS cache:', err);
            return false;
        }
    }

    /**
     * Invalidate all TTS cache for a specific book
     */
    async invalidateBookCache(bookId) {
        try {
            const keys = await this.redis.keys(`tts:audio:book_${bookId}_*`);
            if (keys.length > 0) {
                await this.redis.del(keys);
            }
        } catch (err) {
            console.error('Failed to invalidate book TTS cache:', err);
        }
    }
}

module.exports = new TTSCache();
