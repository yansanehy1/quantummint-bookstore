const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Formula = sequelize.define('Formula', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        bookId: {
            type: DataTypes.UUID,
            allowNull: false
        },
        rawText: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        narratedText: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        field: {
            type: DataTypes.ENUM('math', 'physics', 'chemistry', 'engineering'),
            defaultValue: 'math'
        }
    });

    return Formula;
};
