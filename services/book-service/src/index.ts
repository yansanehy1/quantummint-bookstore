import express from 'express';
import { z } from 'zod';
import { DrizzleORM } from '@quantummin/shared/database/drizzle-orm';
import { ServiceRegistryClient } from '@quantummin/shared/utils/service-registry-client';
import { BookSearchEngine } from './book-search-engine';
import { BookRecommendationEngine } from './book-recommendation-engine';

const app = express();
app.use(express.json());

const db = new DrizzleORM();
const serviceRegistry = new ServiceRegistryClient();
const searchEngine = new BookSearchEngine();
const recommendationEngine = new BookRecommendationEngine();

// Health
app.get('/health', (_req, res) => res.json({ status: 'healthy' }));

const createBookSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().min(10),
  category: z.string().min(1),
  priceUSD: z.number().min(0),
  priceSLL: z.number().min(0),
  level: z.enum(['JSS', 'SSS', 'OTHER']),
  subjects: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  coverImage: z.string().url().optional(),
  samplePages: z.array(z.object({
    pageNumber: z.number(),
    content: z.string(),
    isFree: z.boolean().default(false)
  })).optional()
});

const searchBooksSchema = z.object({
  query: z.string().optional(),
  category: z.string().optional(),
  level: z.enum(['JSS', 'SSS', 'OTHER']).optional(),
  subjects: z.array(z.string()).optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  rating: z.number().min(1).max(5).optional(),
  sortBy: z.enum(['relevance', 'price', 'rating', 'newest']).default('relevance'),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20)
});

app.get('/books', async (req: any, res) => {
  try {
    const searchParams = searchBooksSchema.parse(req.query);

    let books: any;
    if (searchParams.query) {
      books = await searchEngine.search(searchParams);
    } else {
      books = await db.books.findWithFilters(searchParams);
    }

    let recommendations: any[] = [];
    if (req.user) {
      recommendations = await recommendationEngine.getRecommendations(req.user.id, 5);
    }

    res.json({
      success: true,
      data: books,
      pagination: { page: searchParams.page, limit: searchParams.limit, total: books.total },
      recommendations
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/books/:id', async (req: any, res) => {
  try {
    const { id } = req.params;

    const book = await db.books.findById(id);
    if (!book) return res.status(404).json({ error: 'Book not found' });

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
        samplePages: book.samplePages?.filter((p: any) => p.isFree) || []
      }
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/books', async (req: any, res) => {
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
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/books/:id/analytics', async (req: any, res) => {
  try {
    const { id } = req.params;
    const book = await db.books.findById(id);
    if (!book || (book.createdBy !== req.user?.id && req.user?.role !== 'admin')) {
      return res.status(403).json({ error: 'Access denied' });
    }
    const analytics = await db.analytics.getBookAnalytics(id);
    res.json({ success: true, data: analytics });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/books/bulk/upload', async (req: any, res) => {
  try {
    const { books } = req.body;
    const results = await Promise.allSettled(
      books.map((bookData: any) => db.books.create({ ...bookData, createdBy: req.user.id, published: req.user.role === 'admin' }))
    );

    const successful = results.filter((r: any) => r.status === 'fulfilled').length;
    const failed = results.filter((r: any) => r.status === 'rejected').length;

    res.json({ success: true, data: { total: books.length, successful, failed, details: results.map((r: any, i: number) => ({ index: i, status: r.status, error: r.status === 'rejected' ? (r as any).reason?.message : undefined })) } });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

async function checkUserAccess(userId: string, bookId: string): Promise<boolean> {
  try {
    const orderService = await serviceRegistry.discover('order-service');
    const response = await fetch(`${orderService[0].serviceUrl}/orders/access/${bookId}`, { headers: { 'X-User-Id': userId } });
    return response.ok;
  } catch {
    return false;
  }
}

function calculateAverageRating(reviews: any[]): number {
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
}

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Book service running on port ${PORT}`);
  serviceRegistry.register('book-service', `http://localhost:${PORT}`, `http://localhost:${PORT}/health`);
});
