import { bookClient } from '../client';
import type { Book, SearchBooksParams, PaginatedResponse } from '../../types/api';

export const bookService = {
    /**
     * Search/filter books
     */
    async searchBooks(params: SearchBooksParams): Promise<PaginatedResponse<Book>> {
        return bookClient.get<PaginatedResponse<Book>>('/books', { params });
    },

    /**
     * Get book by ID
     */
    async getBookById(id: string): Promise<Book> {
        return bookClient.get<Book>(`/books/${id}`);
    },

    /**
     * Create new book (seller/admin only)
     */
    async createBook(data: Partial<Book>): Promise<Book> {
        return bookClient.post<Book>('/books', data);
    },

    /**
     * Update book (seller/admin only)
     */
    async updateBook(id: string, data: Partial<Book>): Promise<Book> {
        return bookClient.put<Book>(`/books/${id}`, data);
    },

    /**
     * Delete book (admin only)
     */
    async deleteBook(id: string): Promise<void> {
        return bookClient.delete(`/books/${id}`);
    },

    /**
     * Get book analytics (seller/admin only)
     */
    async getBookAnalytics(id: string): Promise<any> {
        return bookClient.get(`/books/${id}/analytics`);
    },
};
