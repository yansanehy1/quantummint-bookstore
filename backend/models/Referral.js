const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Referral = sequelize.define('Referral', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        code: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        status: {
            type: DataTypes.ENUM('active', 'pending', 'completed'),
            defaultValue: 'pending'
        },
        rewardType: {
            type: DataTypes.STRING,
            defaultValue: 'reading_time' // 'reading_time' or 'cash'
        },
        rewardAmount: {
            type: DataTypes.INTEGER,
            defaultValue: 120 // 120 minutes = 2 hours
        }
    });

    return Referral;
};
