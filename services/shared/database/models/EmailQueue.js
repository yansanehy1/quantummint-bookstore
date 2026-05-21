const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('EmailQueue', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        template_name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        recipient_email: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        recipient_name: {
            type: DataTypes.STRING(100)
        },
        dynamic_data: {
            type: DataTypes.JSONB
        },
        priority: {
            type: DataTypes.INTEGER,
            defaultValue: 5
        },
        scheduled_for: {
            type: DataTypes.DATE
        },
        status: {
            type: DataTypes.STRING(20),
            defaultValue: 'pending'
        },
        attempts: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        last_error: {
            type: DataTypes.TEXT
        },
        processed_at: {
            type: DataTypes.DATE
        }
    }, {
        tableName: 'email_queue',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false
    });
};
