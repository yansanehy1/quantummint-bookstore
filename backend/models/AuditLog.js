const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const AuditLog = sequelize.define('AuditLog', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        adminId: {
            type: DataTypes.UUID,
            allowNull: false
        },
        action: {
            type: DataTypes.STRING,
            allowNull: false // e.g., 'APPROVE_SELLER', 'REJECT_BOOK', 'ADJUST_BALANCE'
        },
        targetId: {
            type: DataTypes.STRING,
            allowNull: true
        },
        details: {
            type: DataTypes.JSON,
            allowNull: true
        }
    });

    return AuditLog;
};
