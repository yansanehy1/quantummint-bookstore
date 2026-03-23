import { audioClient } from '../client';
import type { ProcessTextRequest, ProcessTextResponse } from '../../types/api';

export const audioService = {
    /**
     * Process text for audiobook creation (detect sentences, formulas)
     */
    async processText(data: ProcessTextRequest): Promise<ProcessTextResponse> {
        return audioClient.post<ProcessTextResponse>('/process', data);
    },

    /**
     * Save audiobook
     */
    async createAudiobook(data: { title: string; sentences: any[]; formulaCount?: number }): Promise<any> {
        return audioClient.post('/audiobooks', data);
    },

    /**
     * Get audiobooks list
     */
    async getAudiobooks(): Promise<any[]> {
        return audioClient.get('/audiobooks');
    },
};
