const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('EmailLog', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        campaign_id: {
            type: DataTypes.INTEGER
        },
        recipient_email: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        recipient_name: {
            type: DataTypes.STRING(100)
        },
        template_name: {
            type: DataTypes.STRING(100)
        },
        subject: {
            type: DataTypes.STRING(200)
        },
        sent_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        delivered_at: {
            type: DataTypes.DATE
        },
        opened_at: {
            type: DataTypes.DATE
        },
        first_click_at: {
            type: DataTypes.DATE
        },
        last_click_at: {
            type: DataTypes.DATE
        },
        click_count: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        bounce_type: {
            type: DataTypes.STRING(20)
        },
        bounce_reason: {
            type: DataTypes.STRING(255)
        },
        spam_report: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        unsubscribe_at: {
            type: DataTypes.DATE
        },
        sendgrid_message_id: {
            type: DataTypes.STRING(100)
        },
        metadata: {
            type: DataTypes.JSONB
        }
    }, {
        tableName: 'email_logs',
        timestamps: false
    });
};
