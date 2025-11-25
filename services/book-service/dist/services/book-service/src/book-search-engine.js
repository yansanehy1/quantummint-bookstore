"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookSearchEngine = void 0;
const elasticsearch_1 = require("@elastic/elasticsearch");
class BookSearchEngine {
    constructor() {
        this.indexName = 'books';
        this.client = new elasticsearch_1.Client({ node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200' });
    }
    async search(params) {
        const { query, category, level, subjects, minPrice, maxPrice, rating, sortBy, page, limit } = params;
        const from = (page - 1) * limit;
        const must = [];
        const filter = [];
        if (query) {
            must.push({
                multi_match: {
                    query,
                    fields: ['title^3', 'description^2', 'subjects', 'tags'],
                    fuzziness: 'AUTO'
                }
            });
        }
        if (category)
            filter.push({ term: { category } });
        if (level)
            filter.push({ term: { level } });
        if (subjects?.length)
            filter.push({ terms: { subjects } });
        if (minPrice !== undefined || maxPrice !== undefined) {
            const priceRange = {};
            if (minPrice !== undefined)
                priceRange.gte = minPrice;
            if (maxPrice !== undefined)
                priceRange.lte = maxPrice;
            filter.push({ range: { priceSLL: priceRange } });
        }
        if (rating)
            filter.push({ range: { averageRating: { gte: rating } } });
        let sort = [];
        switch (sortBy) {
            case 'price':
                sort.push({ priceSLL: { order: 'asc' } });
                break;
            case 'rating':
                sort.push({ averageRating: { order: 'desc' } });
                break;
            case 'newest':
                sort.push({ createdAt: { order: 'desc' } });
                break;
            default: sort.push(query ? { _score: { order: 'desc' } } : { createdAt: { order: 'desc' } });
        }
        const searchBody = { query: { bool: { must: must.length ? must : [{ match_all: {} }], filter } }, sort, from, size: limit };
        const response = await this.client.search({ index: this.indexName, body: searchBody });
        const books = response.body.hits.hits.map((hit) => ({ ...hit._source, score: hit._score }));
        return { books, total: response.body.hits.total.value, aggregations: response.body.aggregations };
    }
    async indexBook(book) {
        await this.client.index({ index: this.indexName, id: book.id, body: { id: book.id, title: book.title, description: book.description, category: book.category, level: book.level, subjects: book.subjects || [], tags: book.tags || [], priceUSD: book.priceUSD, priceSLL: book.priceSLL, averageRating: book.averageRating || 0, totalReviews: book.totalReviews || 0, createdAt: book.createdAt, updatedAt: book.updatedAt } });
    }
    async updateBookRating(bookId, newRating) {
        await this.client.update({ index: this.indexName, id: bookId, body: { doc: { averageRating: newRating } } });
    }
}
exports.BookSearchEngine = BookSearchEngine;
