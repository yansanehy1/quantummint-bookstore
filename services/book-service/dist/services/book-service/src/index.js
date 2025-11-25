"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const zod_1 = require("zod");
const drizzle_orm_1 = require("@quantummin/shared/database/drizzle-orm");
const service_registry_client_1 = require("@quantummin/shared/utils/service-registry-client");
const book_search_engine_1 = require("./book-search-engine");
const book_recommendation_engine_1 = require("./book-recommendation-engine");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const db = new drizzle_orm_1.DrizzleORM();
const serviceRegistry = new service_registry_client_1.ServiceRegistryClient();
const searchEngine = new book_search_engine_1.BookSearchEngine();
const recommendationEngine = new book_recommendation_engine_1.BookRecommendationEngine();
// Health
app.get('/health', (_req, res) => res.json({ status: 'healthy' }));
const createBookSchema = zod_1.z.object({
    title: zod_1.z.string().min(1).max(255),
    description: zod_1.z.string().min(10),
    category: zod_1.z.string().min(1),
    priceUSD: zod_1.z.number().min(0),
    priceSLL: zod_1.z.number().min(0),
    level: zod_1.z.enum(['JSS', 'SSS', 'OTHER']),
    subjects: zod_1.z.array(zod_1.z.string()).optional(),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
    coverImage: zod_1.z.string().url().optional(),
    samplePages: zod_1.z.array(zod_1.z.object({
        pageNumber: zod_1.z.number(),
        content: zod_1.z.string(),
        isFree: zod_1.z.boolean().default(false)
    })).optional()
});
const searchBooksSchema = zod_1.z.object({
    query: zod_1.z.string().optional(),
    category: zod_1.z.string().optional(),
    level: zod_1.z.enum(['JSS', 'SSS', 'OTHER']).optional(),
    subjects: zod_1.z.array(zod_1.z.string()).optional(),
    minPrice: zod_1.z.number().optional(),
    maxPrice: zod_1.z.number().optional(),
    rating: zod_1.z.number().min(1).max(5).optional(),
    sortBy: zod_1.z.enum(['relevance', 'price', 'rating', 'newest']).default('relevance'),
    page: zod_1.z.number().min(1).default(1),
    limit: zod_1.z.number().min(1).max(100).default(20)
});
app.get('/books', async (req, res) => {
    try {
        const searchParams = searchBooksSchema.parse(req.query);
        let books;
        if (searchParams.query) {
            books = await searchEngine.search(searchParams);
        }
        else {
            books = await db.books.findWithFilters(searchParams);
        }
        let recommendations = [];
        if (req.user) {
            recommendations = await recommendationEngine.getRecommendations(req.user.id, 5);
        }
        res.json({
            success: true,
            data: books,
            pagination: { page: searchParams.page, limit: searchParams.limit, total: books.total },
            recommendations
        });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
app.get('/books/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const book = await db.books.findById(id);
        if (!book)
            return res.status(404).json({ error: 'Book not found' });
        const relatedBooks = await db.books.findRelated(book.id, book.category, 4);
        const reviews = await db.reviews.findByBookId(id);
        let userAccess = false;
        if (req.user) {
            userAccess = await checkUserAccess(req.user.id, id);
        }
        res.json({
            success: true,
            data: {
                ...book,
                relatedBooks,
                reviews: {
                    averageRating: calculateAverageRating(reviews),
                    totalReviews: reviews.length,
                    recentReviews: reviews.slice(0, 5)
                },
                userAccess,
                samplePages: book.samplePages?.filter((p) => p.isFree) || []
            }
        });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
app.post('/books', async (req, res) => {
    try {
        if (req.user?.role !== 'seller' && req.user?.role !== 'admin') {
            return res.status(403).json({ error: 'Insufficient permissions' });
        }
        const bookData = createBookSchema.parse(req.body);
        const book = await db.books.create({
            ...bookData,
            createdBy: req.user.id,
            published: req.user.role === 'admin'
        });
        await searchEngine.indexBook(book);
        if (req.user.role === 'seller') {
            const notificationService = await serviceRegistry.discover('notification-service');
            await fetch(`${notificationService[0].serviceUrl}/notifications/send`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'book_submission',
                    target: 'admin',
                    data: { bookId: book.id, bookTitle: book.title, sellerId: req.user.id, sellerName: req.user.name }
                })
            });
        }
        res.status(201).json({ success: true, data: book, message: req.user.role === 'admin' ? 'Book published successfully' : 'Book submitted for review' });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
app.get('/books/:id/analytics', async (req, res) => {
    try {
        const { id } = req.params;
        const book = await db.books.findById(id);
        if (!book || (book.createdBy !== req.user?.id && req.user?.role !== 'admin')) {
            return res.status(403).json({ error: 'Access denied' });
        }
        const analytics = await db.analytics.getBookAnalytics(id);
        res.json({ success: true, data: analytics });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
app.post('/books/bulk/upload', async (req, res) => {
    try {
        const { books } = req.body;
        const results = await Promise.allSettled(books.map((bookData) => db.books.create({ ...bookData, createdBy: req.user.id, published: req.user.role === 'admin' })));
        const successful = results.filter((r) => r.status === 'fulfilled').length;
        const failed = results.filter((r) => r.status === 'rejected').length;
        res.json({ success: true, data: { total: books.length, successful, failed, details: results.map((r, i) => ({ index: i, status: r.status, error: r.status === 'rejected' ? r.reason?.message : undefined })) } });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
async function checkUserAccess(userId, bookId) {
    try {
        const orderService = await serviceRegistry.discover('order-service');
        const response = await fetch(`${orderService[0].serviceUrl}/orders/access/${bookId}`, { headers: { 'X-User-Id': userId } });
        return response.ok;
    }
    catch {
        return false;
    }
}
function calculateAverageRating(reviews) {
    if (reviews.length === 0)
        return 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return Math.round((sum / reviews.length) * 10) / 10;
}
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
    console.log(`Book service running on port ${PORT}`);
    serviceRegistry.register('book-service', `http://localhost:${PORT}`, `http://localhost:${PORT}/health`);
});
