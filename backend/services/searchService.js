const { Book, Formula, FormulaToken } = require('../models');
const { Op } = require('sequelize');

class SearchService {
    /**
     * Performs a deep search across books, formulas, and definitions.
     */
    async deepSearch(query, limit = 20) {
        try {
            // 1. Search in Book titles and authors
            const books = await Book.findAll({
                where: {
                    [Op.or]: [
                        { title: { [Op.like]: `%${query}%` } },
                        { author: { [Op.like]: `%${query}%` } },
                        { category: { [Op.like]: `%${query}%` } }
                    ]
                },
                limit
            });

            // 2. Search in Formulas and Definitions
            const formulas = await Formula.findAll({
                where: {
                    [Op.or]: [
                        { rawText: { [Op.like]: `%${query}%` } },
                        { narratedText: { [Op.like]: `%${query}%` } }
                    ]
                },
                include: [{ model: Book }],
                limit
            });

            // 3. Search in specific symbol definitions
            const tokens = await FormulaToken.findAll({
                where: {
                    [Op.or]: [
                        { symbol: { [Op.like]: `%${query}%` } },
                        { spoken: { [Op.like]: `%${query}%` } },
                        { definition: { [Op.like]: `%${query}%` } }
                    ]
                },
                include: [{ 
                    model: Formula,
                    include: [Book]
                }],
                limit
            });

            return {
                query,
                results: {
                    books,
                    formulas,
                    concepts: tokens
                }
            };

        } catch (error) {
            console.error('Deep Search Error:', error);
            throw error;
        }
    }
}

module.exports = new SearchService();
