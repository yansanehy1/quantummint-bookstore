export declare class BookSearchEngine {
    private client;
    private indexName;
    constructor();
    search(params: any): Promise<{
        books: any;
        total: any;
        aggregations: any;
    }>;
    indexBook(book: any): Promise<void>;
    updateBookRating(bookId: string, newRating: number): Promise<void>;
}
