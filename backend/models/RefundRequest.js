const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const RefundRequest = sequelize.define('RefundRequest', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false
        },
        purchaseId: {
            type: DataTypes.UUID,
            allowNull: false
        },
        reason: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('pending', 'approved', 'rejected'),
            defaultValue: 'pending'
        },
        adminNotes: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        amount: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false
        },
        currency: {
            type: DataTypes.ENUM('SLL', 'USD'),
            allowNull: false
        }
    });

    return RefundRequest;
};
