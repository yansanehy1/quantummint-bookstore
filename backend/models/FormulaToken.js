const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const FormulaToken = sequelize.define('FormulaToken', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        formulaId: {
            type: DataTypes.UUID,
            allowNull: false
        },
        symbol: {
            type: DataTypes.STRING,
            allowNull: false
        },
        spoken: {
            type: DataTypes.STRING,
            allowNull: false
        },
        definition: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        diagramUrl: {
            type: DataTypes.STRING,
            allowNull: true
        },
        orderIndex: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        }
    });

    return FormulaToken;
};
