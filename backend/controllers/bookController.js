const asyncHandler = require('../middleware/asyncHandler');
const { Op } = require('sequelize');
const { toBookJson } = require('../utils/bookMapper');
const { main: logger } = require('../utils/logger');

exports.listBooks = asyncHandler(async (req, res) => {
    const { Book } = req.app.get('models');
    const { genre, search, sortBy, hasVideo } = req.query;

    logger.info(`[BookController] Listing books with filters: genre=${genre}, search=${search}, sortBy=${sortBy}, hasVideo=${hasVideo}`);

    const where = { status: 'approved' }; // Only show approved books by default
    
    if (genre && typeof genre === 'string' && genre !== 'all') {
        where.category = genre;
    }

    if (hasVideo === 'true') {
        where.hasVideo = true;
    }
    if (search && typeof search === 'string' && search.trim()) {
        where[Op.or] = [
            { title: { [Op.like]: `%${search.trim()}%` } },
            { author: { [Op.like]: `%${search.trim()}%` } },
            { description: { [Op.like]: `%${search.trim()}%` } },
        ];
    }

    let order = [['createdAt', 'DESC']];
    if (sortBy === 'popular') {
        order = [['title', 'ASC']];
    }

    const books = await Book.findAll({ where, order, limit: 100 });
    res.json(books.map(toBookJson));
});

exports.getBook = asyncHandler(async (req, res) => {
    const { Book } = req.app.get('models');
    const book = await Book.findByPk(req.params.id);
    if (!book) {
        return res.status(404).json({ error: 'Book not found' });
    }
    res.json(toBookJson(book));
});
