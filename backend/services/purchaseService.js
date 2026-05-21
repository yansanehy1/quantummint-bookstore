const { Book, User, Purchase, Transaction } = require('../models');
const { uuidv4 } = require('../utils/id');

exports.purchaseBook = async (req, userId, bookId, amount, currency) => {
    // Check if system is in Pay-As-You-Go mode
    const isPayGO = true; // Transitioning to PayGO model
    
    if (isPayGO) {
        throw new Error('Direct book purchases are disabled. Please use Pay-As-You-Go access.');
    }

    if (!bookId || !amount || !currency) {
        throw new Error('Missing purchase details');
    }
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
        throw new Error('Invalid amount');
    }

    // ensure book exists and price matches the selected currency
    const book = await Book.findByPk(bookId);
    if (!book) {
        throw new Error('Book not found');
    }

    const expectedPrice = currency === 'SLL' ? parseFloat(book.priceSLL) : parseFloat(book.priceUSD);
    if (isNaN(expectedPrice)) {
        throw new Error('Invalid book price');
    }
    if (amountNum !== expectedPrice) {
        throw new Error('Amount does not match book price');
    }

    const user = await User.findByPk(userId);
    if (!user) {
        throw new Error('User not found');
    }

    const balanceField = currency === 'SLL' ? 'sllBalance' : 'usdBalance';
    if (parseFloat(user[balanceField]) < amountNum) {
        throw new Error(`Insufficient ${currency} balance`);
    }

    return User.sequelize.transaction(async (t) => {
        // Deduct balance
        await user.update({
            [balanceField]: (parseFloat(user[balanceField]) - amountNum).toFixed(2)
        }, { transaction: t });

        const purchaseId = uuidv4();
        const purchase = await Purchase.create({
            id: purchaseId,
            userId,
            bookId,
            amount: amountNum,
            currency,
            status: 'completed'
        }, { transaction: t });

        const txId = uuidv4();
        const description = `Purchase: ${book.title}`;
        await Transaction.create({
            id: txId,
            userId,
            type: 'purchase',
            amount: amountNum,
            currency,
            description,
            status: 'completed'
        }, { transaction: t });

        return { purchaseId, transactionId: txId };
    });
};
