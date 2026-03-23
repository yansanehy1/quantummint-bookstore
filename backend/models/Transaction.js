const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Transaction = sequelize.define('Transaction', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false
        },
        type: {
            type: DataTypes.ENUM('deposit', 'purchase', 'withdrawal', 'referral_bonus', 'gift'),
            allowNull: false
        },
        amount: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false
        },
        currency: {
            type: DataTypes.ENUM('SLL', 'USD'),
            defaultValue: 'SLL'
        },
        paymentMethod: {
            type: DataTypes.ENUM('orange_money', 'afrimoney', 'qmoney', 'stripe'),
            allowNull: true
        },
        platformFee: {
            type: DataTypes.DECIMAL(10, 4),
            defaultValue: 0.0000
        },
        externalRef: {
            type: DataTypes.STRING,
            allowNull: true
        },
        phoneNumber: {
            type: DataTypes.STRING,
            allowNull: true
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true
        },
        status: {
            type: DataTypes.ENUM('completed', 'pending', 'failed', 'processing'),
            defaultValue: 'pending'
        }
    });

    return Transaction;
};
