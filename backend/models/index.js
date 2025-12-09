const { Sequelize } = require('sequelize');
const path = require('path');

// Import models
const UserModel = require('./User');
const BookModel = require('./Book');
const PurchaseModel = require('./Purchase');
const TransactionModel = require('./Transaction');
const ReferralModel = require('./Referral');
const SellerModel = require('./Seller');

module.exports = (sequelize) => {
    // Initialize models
    const User = UserModel(sequelize);
    const Book = BookModel(sequelize);
    const Purchase = PurchaseModel(sequelize);
    const Transaction = TransactionModel(sequelize);
    const Referral = ReferralModel(sequelize);
    const Seller = SellerModel(sequelize);

    // Define Associations

    // User <-> Purchase
    User.hasMany(Purchase);
    Purchase.belongsTo(User);

    // Book <-> Purchase
    Book.hasMany(Purchase);
    Purchase.belongsTo(Book);

    // User <-> Transaction
    User.hasMany(Transaction);
    Transaction.belongsTo(User);

    // User <-> Seller
    User.hasOne(Seller);
    Seller.belongsTo(User);

    // User <-> Book (Seller's books)
    Seller.hasMany(Book);
    Book.belongsTo(Seller);

    // User <-> Referral (Referrer)
    User.hasMany(Referral, { as: 'ReferralsSent', foreignKey: 'referrerId' });
    Referral.belongsTo(User, { as: 'Referrer', foreignKey: 'referrerId' });

    // User <-> Referral (Referred)
    User.hasOne(Referral, { as: 'ReferralReceived', foreignKey: 'referredId' });
    Referral.belongsTo(User, { as: 'Referred', foreignKey: 'referredId' });

    return {
        User,
        Book,
        Purchase,
        Transaction,
        Referral,
        Seller
    };
};
