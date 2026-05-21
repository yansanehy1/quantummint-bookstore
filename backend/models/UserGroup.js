const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const UserGroup = sequelize.define('UserGroup', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        type: {
            type: DataTypes.ENUM('CUG', 'ORGANIZATION', 'GOVERNMENT', 'PRIVATE'),
            defaultValue: 'CUG'
        },
        status: {
            type: DataTypes.ENUM('pending', 'active', 'inactive', 'suspended'),
            defaultValue: 'pending'
        },
        sponsorId: {
            type: DataTypes.UUID,
            allowNull: true,
            comment: 'The user or organization admin who pays for this group'
        },
        maxMembers: {
            type: DataTypes.INTEGER,
            defaultValue: 2000
        },
        prepaidBalance: {
            type: DataTypes.DECIMAL(15, 2),
            defaultValue: 0.00
        },
        currency: {
            type: DataTypes.ENUM('SLL', 'USD'),
            defaultValue: 'SLL'
        },
        allowedBookIds: {
            type: DataTypes.JSON,
            allowNull: true,
            comment: 'List of book IDs this group has access to. If null/empty, access is platform-wide.'
        },
        metadata: {
            type: DataTypes.JSON,
            allowNull: true
        }
    });

    return UserGroup;
};
