const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const LearnerInteraction = sequelize.define('LearnerInteraction', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false
        },
        tokenId: {
            type: DataTypes.UUID,
            allowNull: true
        },
        formulaId: {
            type: DataTypes.UUID,
            allowNull: true
        },
        action: {
            type: DataTypes.ENUM('tap', 'replay', 'expand', 'view'),
            defaultValue: 'tap'
        },
        metadata: {
            type: DataTypes.JSONB,
            defaultValue: {}
        }
    });

    return LearnerInteraction;
};
