const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Subscription = sequelize.define('Subscription', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false
        },
        planId: {
            type: DataTypes.ENUM('12hours', '24hours', '7days', '30days'),
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('active', 'expired', 'cancelled'),
            defaultValue: 'active'
        },
        startDate: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        endDate: {
            type: DataTypes.DATE,
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
        autoRenew: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        sponsorId: {
            type: DataTypes.UUID,
            allowNull: true,
            comment: 'ID of the user who paid for this subscription (if not the subscriber)'
        },
        groupId: {
            type: DataTypes.UUID,
            allowNull: true,
            comment: 'ID of the UserGroup if this is a group-based subscription'
        },
        allowedBookIds: {
            type: DataTypes.JSON,
            allowNull: true,
            comment: 'List of specific book IDs allowed under this subscription. If null, access is platform-wide.'
        }
    });

    return Subscription;
};
