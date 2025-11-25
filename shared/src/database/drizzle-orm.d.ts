export declare class DrizzleORM {
    books: {
        findWithFilters(_: any): Promise<any>;
        findById(id: string): Promise<any>;
        findRelated(_id: string, _category: string, _limit: number): Promise<any[]>;
        create(data: any): Promise<any>;
    };
    reviews: {
        findByBookId(_id: string): Promise<any[]>;
    };
    analytics: {
        getBookAnalytics(_id: string): Promise<{
            views: number;
            purchases: number;
            revenue: number;
        }>;
    };
}
