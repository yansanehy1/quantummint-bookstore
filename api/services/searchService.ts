import { searchClient } from '../client';
import type { Book, SearchBooksParams } from '../../types/api';

export const searchService = {
    /**
     * Advanced search with Elasticsearch
     */
    async advancedSearch(params: SearchBooksParams): Promise<any> {
        return searchClient.get('/search', { params });
    },

    /**
     * Autocomplete suggestions
     */
    async autocomplete(query: string): Promise<string[]> {
        return searchClient.get('/search/autocomplete', {
            params: { q: query },
        });
    },

    /**
     * Search by similarity
     */
    async findSimilar(bookId: string, limit = 5): Promise<Book[]> {
        return searchClient.get(`/search/similar/${bookId}`, {
            params: { limit },
        });
    },

    /**
     * Trending searches
     */
    async getTrendingSearches(limit = 10): Promise<string[]> {
        return searchClient.get('/search/trending', {
            params: { limit },
        });
    },
};
