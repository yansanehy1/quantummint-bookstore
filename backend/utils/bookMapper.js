/**
 * Maps a Sequelize Book instance to the JSON shape expected by the frontend catalog.
 */
function toBookJson(book) {
    const row = book.get ? book.get({ plain: true }) : book;
    return {
        id: row.id,
        title: row.title,
        author: row.author,
        coverUrl: row.coverUrl || '',
        coverImage: row.coverUrl || '',
        description: row.description || '',
        price: 0, // Pay-As-You-Go model
        priceUSD: 0,
        priceSLL: 0,
        rating: 0,
        category: row.category || 'General',
        genre: row.category || 'General',
        reviews: [],
        chapters: [],
        hasAudio: !!row.hasAudio,
        audioUrl: row.audioUrl || undefined,
        creatorId: row.sellerId || undefined,
        createdAt: row.createdAt,
    };
}

module.exports = { toBookJson };
