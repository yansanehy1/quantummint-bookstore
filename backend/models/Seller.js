const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Seller = sequelize.define('Seller', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        businessName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        businessInfo: {
            type: DataTypes.JSON,
            defaultValue: {}
        },
        taxInfo: {
            type: DataTypes.JSON,
            defaultValue: {}
        },
        status: {
            type: DataTypes.ENUM('pending', 'approved', 'rejected'),
            defaultValue: 'pending'
        },
        commissionRate: {
            type: DataTypes.DECIMAL(5, 2),
            defaultValue: 10.00 // 10%
        },
        paymentDetails: {
            type: DataTypes.JSON,
            allowNull: true
        }
    });

    return Seller;
};
