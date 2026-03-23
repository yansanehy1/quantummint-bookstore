// Library Service
// Handles user library management and reading progress

import api from '../utils/api';
import type { Book } from '../types';

export interface ReadingProgress {
    currentChapter: number;
    currentPosition: number;
    lastAccessedAt: string;
    percentComplete: number;
}

class LibraryService {
    private library: Book[] = [];

    /**
     * Get user's library
     */
    async getLibrary(): Promise<Book[]> {
        try {
            this.library = await api.library.getLibrary();
            return this.library;
        } catch (error) {
            console.error('Failed to get library:', error);
            throw error;
        }
    }

    /**
     * Add book to library
     */
    async addToLibrary(bookId: string): Promise<void> {
        try {
            await api.library.addToLibrary(bookId);
            // Refresh library
            await this.getLibrary();
        } catch (error) {
            console.error('Failed to add to library:', error);
            throw error;
        }
    }

    /**
     * Remove book from library
     */
    async removeFromLibrary(bookId: string): Promise<void> {
        try {
            await api.library.removeFromLibrary(bookId);
            // Update local library
            this.library = this.library.filter(book => book.id !== bookId);
        } catch (error) {
            console.error('Failed to remove from library:', error);
            throw error;
        }
    }

    /**
     * Get reading progress for a book
     */
    async getProgress(bookId: string): Promise<ReadingProgress> {
        try {
            const progress = await api.library.getProgress(bookId);

            // Calculate percent complete
            const book = this.library.find(b => b.id === bookId);
            const percentComplete = book
                ? (progress.currentChapter / book.chapters.length) * 100
                : 0;

            return {
                ...progress,
                percentComplete
            };
        } catch (error) {
            console.error('Failed to get progress:', error);
            throw error;
        }
    }

    /**
     * Update reading progress
     */
    async updateProgress(
        bookId: string,
        chapterNumber: number,
        position: number
    ): Promise<void> {
        try {
            await api.library.updateProgress(bookId, chapterNumber, position);
        } catch (error) {
            console.error('Failed to update progress:', error);
            throw error;
        }
    }

    /**
     * Check if book is in library
     */
    isInLibrary(bookId: string): boolean {
        return this.library.some(book => book.id === bookId);
    }

    /**
     * Get recently accessed books
     */
    getRecentlyAccessed(limit: number = 5): Book[] {
        // This would typically be sorted by lastAccessedAt from the backend
        return this.library.slice(0, limit);
    }

    /**
     * Get books by genre
     */
    getByGenre(genre: string): Book[] {
        return this.library.filter(book => book.genre === genre);
    }

    /**
     * Search library
     */
    searchLibrary(query: string): Book[] {
        const lowerQuery = query.toLowerCase();
        return this.library.filter(book =>
            book.title.toLowerCase().includes(lowerQuery) ||
            book.author.toLowerCase().includes(lowerQuery) ||
            book.description.toLowerCase().includes(lowerQuery)
        );
    }

    /**
     * Get library statistics
     */
    getStatistics(): {
        totalBooks: number;
        totalDuration: number;
        genres: { [key: string]: number };
    } {
        const stats = {
            totalBooks: this.library.length,
            totalDuration: this.library.reduce((sum, book) => sum + book.totalDuration, 0),
            genres: {} as { [key: string]: number }
        };

        this.library.forEach(book => {
            stats.genres[book.genre] = (stats.genres[book.genre] || 0) + 1;
        });

        return stats;
    }
}

export const libraryService = new LibraryService();
export default libraryService;
