const { v4: uuidv4 } = require('uuid');

function getSequelizeFromReq(req) {
    return req.app.get('sequelize');
}

exports.purchaseBook = async (req, userId, bookId, amount, currency) => {
    if (!bookId || !amount || !currency) {
        throw new Error('Missing purchase details');
    }
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
        throw new Error('Invalid amount');
    }

    const sequelize = getSequelizeFromReq(req);

    // ensure book exists and price matches the selected currency
    const [bookRows] = await sequelize.query('SELECT priceSLL, priceUSD FROM Books WHERE id = ?', { replacements: [bookId] });
    const book = bookRows[0];
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

    const walletQuery = await sequelize.query('SELECT balanceSLL, balanceUSD FROM Wallets WHERE userId = ?', { replacements: [userId] });
    const wallets = walletQuery[0] || [];
    const wallet = wallets[0];
    if (!wallet) {
        throw new Error('Wallet not found');
    }

    if (currency === 'SLL') {
        if (parseFloat(wallet.balanceSLL) < amountNum) {
            throw new Error('Insufficient SLL balance');
        }
    } else if (currency === 'USD') {
        if (parseFloat(wallet.balanceUSD) < amountNum) {
            throw new Error('Insufficient USD balance');
        }
    } else {
        throw new Error('Invalid currency');
    }

    return sequelize.transaction(async (t) => {
        const balanceField = currency === 'SLL' ? 'balanceSLL' : 'balanceUSD';
        await sequelize.query(
            `UPDATE Wallets SET ${balanceField} = ${balanceField} - ? WHERE userId = ?`,
            { replacements: [amountNum, userId], transaction: t }
        );

        const purchaseId = uuidv4();
        await sequelize.query(
            'INSERT INTO Purchases (id, userId, bookId, amount, currency, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, "completed", NOW(), NOW())',
            { replacements: [purchaseId, userId, bookId, amountNum, currency], transaction: t }
        );

        const txId = uuidv4();
        const description = `Purchase: Book ID ${bookId}`;
        await sequelize.query(
            `INSERT INTO Transactions (id, userId, type, amount, currency, description, status, createdAt, updatedAt) 
       VALUES (?, ?, 'purchase', ?, ?, ?, 'completed', NOW(), NOW())`,
            { replacements: [txId, userId, amountNum, currency, description], transaction: t }
        );

        return { purchaseId, transactionId: txId };
    });
};
