const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        role: {
            type: DataTypes.ENUM('learner', 'seller', 'admin', 'support'),
            defaultValue: 'learner'
        },
        usdBalance: {
            type: DataTypes.DECIMAL(15, 2),
            defaultValue: 0.00
        },
        sllBalance: {
            type: DataTypes.DECIMAL(15, 2),
            defaultValue: 0.00
        },
        avatarUrl: {
            type: DataTypes.STRING,
            allowNull: true
        },
        isVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    });

    return User;
};
