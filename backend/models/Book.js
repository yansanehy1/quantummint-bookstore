const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Book = sequelize.define('Book', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        author: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        priceUSD: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.00
        },
        priceSLL: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.00
        },
        coverUrl: {
            type: DataTypes.STRING,
            allowNull: true
        },
        fileUrl: {
            type: DataTypes.STRING,
            allowNull: false
        },
        category: {
            type: DataTypes.STRING,
            allowNull: true
        },
        sellerId: {
            type: DataTypes.UUID,
            allowNull: true
        },
        educationLevel: {
            type: DataTypes.ENUM('JSS', 'SSS', 'College', 'University', 'Adult Education', 'General'),
            defaultValue: 'General'
        }
    });

    return Book;
};
