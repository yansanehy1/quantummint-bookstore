const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Purchase = sequelize.define('Purchase', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        currency: {
            type: DataTypes.ENUM('USD', 'SLL'),
            defaultValue: 'USD'
        },
        status: {
            type: DataTypes.ENUM('completed', 'pending', 'failed'),
            defaultValue: 'completed'
        }
    });

    return Purchase;
};
