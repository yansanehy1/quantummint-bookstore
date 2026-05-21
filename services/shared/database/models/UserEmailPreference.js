const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('UserEmailPreference', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true
        },
        receives_marketing: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        receives_alerts: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        receives_reviews: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        receives_newsletters: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        digest_frequency: {
            type: DataTypes.STRING(20),
            defaultValue: 'daily'
        },
        last_marketing_email: {
            type: DataTypes.DATE
        },
        last_alert_email: {
            type: DataTypes.DATE
        },
        marketing_emails_count: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        total_emails_received: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        unsubscribed_at: {
            type: DataTypes.DATE
        }
    }, {
        tableName: 'user_email_preferences',
        timestamps: true,
        createdAt: false,
        updatedAt: 'updated_at'
    });
};
