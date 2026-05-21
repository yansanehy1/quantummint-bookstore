const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('AbandonedCartEmail', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        cart_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        user_email: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        cart_value: {
            type: DataTypes.DECIMAL(10, 2)
        },
        reminder_sequence: {
            type: DataTypes.INTEGER,
            defaultValue: 1
        },
        sent_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        opened_at: {
            type: DataTypes.DATE
        },
        clicked_at: {
            type: DataTypes.DATE
        },
        recovered: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        recovered_at: {
            type: DataTypes.DATE
        },
        recovered_value: {
            type: DataTypes.DECIMAL(10, 2)
        }
    }, {
        tableName: 'abandoned_cart_emails',
        timestamps: false
    });
};
