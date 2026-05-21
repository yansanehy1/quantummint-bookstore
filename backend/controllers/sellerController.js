const { Seller, Book, Purchase, Transaction, User, VoiceProfile } = require('../models');
const { uuidv4 } = require('../utils/id');
const { main: logger } = require('../utils/logger');

/**
 * Register a new seller or update existing application
 */
exports.registerSeller = async (req, res) => {
    try {
        const userId = req.user.id;
        const { businessName, businessInfo, taxInfo, paymentDetails } = req.body;

        logger.info(`[SellerController] Seller registration attempt for user ${userId}: ${businessName}`);

        let seller = await Seller.findOne({ where: { userId } });

        if (seller) {
            // Update existing application
            await seller.update({
                businessName: businessName || seller.businessName,
                businessInfo: businessInfo || seller.businessInfo,
                taxInfo: taxInfo || seller.taxInfo,
                paymentDetails: paymentDetails ? { ...seller.paymentDetails, ...paymentDetails } : seller.paymentDetails,
                status: 'pending' // Re-trigger review upon update
            });
            logger.info(`[SellerController] Seller application updated for user ${userId}`);
        } else {
            // Create new seller application
            seller = await Seller.create({
                id: uuidv4(),
                userId,
                businessName: businessName || 'Unnamed Business',
                businessInfo: businessInfo || {},
                taxInfo: taxInfo || {},
                status: 'pending',
                commissionRate: 10.00, // Default 10% platform fee
                paymentDetails: paymentDetails || {}
            });
            logger.info(`[SellerController] New seller application created for user ${userId}`);

            // Keep user role as is (usually 'learner') until an admin approves the application.
            // Once approved via the admin panel, the role will be updated to 'seller'.
            // Note: If the user needs immediate access to a limited dashboard, 
            // you could update the role here, but keeping it as 'learner' is more secure.
        }

        res.status(201).json({
            success: true,
            message: 'Seller application submitted successfully. It is now pending review.',
            seller
        });
    } catch (error) {
        logger.error('[SellerController] Register Seller Error:', error);
        res.status(500).json({ error: 'Failed to register seller' });
    }
};

/**
 * Get seller profile and stats
 */
exports.getSellerProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const seller = await Seller.findOne({ 
            where: { userId },
            include: [{ model: User, attributes: ['name', 'email'] }]
        });

        if (!seller) {
            return res.status(404).json({ error: 'Seller profile not found' });
        }

        res.json(seller);
    } catch (error) {
        logger.error('[SellerController] Get Seller Profile Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Get seller earnings and performance stats
 */
exports.getEarnings = async (req, res) => {
    try {
        const userId = req.user.id;
        const seller = await Seller.findOne({ where: { userId } });

        if (!seller) {
            return res.status(404).json({ error: 'Seller not found' });
        }

        // Get all books for this seller
        const books = await Book.findAll({ where: { sellerId: seller.id } });
        const bookIds = books.map(b => b.id);

        // Get all purchases for these books
        const purchases = await Purchase.findAll({
            where: { 
                bookId: bookIds,
                status: 'completed'
            }
        });

        // Calculate earnings
        const platformRate = parseFloat(seller.commissionRate) / 100;
        
        let totalEarningsUSD = 0;
        let totalEarningsSLL = 0;
        
        purchases.forEach(p => {
            const sellerShare = parseFloat(p.amount) * (1 - platformRate);
            if (p.currency === 'USD') {
                totalEarningsUSD += sellerShare;
            } else {
                totalEarningsSLL += sellerShare;
            }
        });

        // Get recent payouts
        const payouts = await Transaction.findAll({
            where: {
                userId,
                type: 'withdrawal'
            },
            order: [['createdAt', 'DESC']],
            limit: 10
        });

        const pendingPayoutUSD = payouts
            .filter(p => p.status === 'processing' && p.currency === 'USD')
            .reduce((sum, p) => sum + parseFloat(p.amount), 0);
            
        const pendingPayoutSLL = payouts
            .filter(p => p.status === 'processing' && p.currency === 'SLL')
            .reduce((sum, p) => sum + parseFloat(p.amount), 0);

        res.json({
            summary: {
                totalEarningsUSD,
                totalEarningsSLL,
                pendingPayoutUSD,
                pendingPayoutSLL,
                totalSales: purchases.length,
                publishedBooks: books.length
            },
            recentPayouts: payouts,
            earningsByBook: books.map(book => {
                const bookPurchases = purchases.filter(p => p.bookId === book.id);
                const earnings = bookPurchases.reduce((sum, p) => sum + parseFloat(p.amount) * (1 - platformRate), 0);
                return {
                    id: book.id,
                    title: book.title,
                    coverUrl: book.coverUrl,
                    earnings,
                    sales: bookPurchases.length
                };
            })
        });
    } catch (error) {
        logger.error('[SellerController] Get Earnings Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Request a payout (withdrawal)
 */
exports.requestPayout = async (req, res) => {
    try {
        const userId = req.user.id;
        const { amount, currency, method } = req.body;

        const seller = await Seller.findOne({ where: { userId } });
        if (!seller) return res.status(404).json({ error: 'Seller not found' });

        const balanceField = currency === 'USD' ? 'usdBalance' : 'sllBalance';
        const user = await User.findByPk(userId);

        if (parseFloat(user[balanceField]) < parseFloat(amount)) {
            return res.status(400).json({ error: 'Insufficient balance' });
        }

        // Deduct balance
        user[balanceField] = (parseFloat(user[balanceField]) - parseFloat(amount)).toFixed(2);
        await user.save();

        // Create transaction
        const tx = await Transaction.create({
            id: uuidv4(),
            userId,
            type: 'withdrawal',
            amount,
            currency,
            status: 'processing',
            description: `Payout request via ${method}`
        });

        logger.info(`[SellerController] Payout requested by user ${userId}: ${amount} ${currency}`);

        res.json({ success: true, transaction: tx });
    } catch (error) {
        logger.error('[SellerController] Request Payout Error:', error);
        res.status(500).json({ error: 'Failed to request payout' });
    }
};

/**
 * Get seller's cloned voices
 */
exports.getClonedVoices = async (req, res) => {
    try {
        const userId = req.user.id;
        const voices = await VoiceProfile.findAll({ 
            where: { creatorId: userId, type: 'CLONED' } 
        });
        res.json(voices);
    } catch (error) {
        logger.error('[SellerController] Get Cloned Voices Error:', error);
        res.status(500).json({ error: 'Failed to fetch voices' });
    }
};
