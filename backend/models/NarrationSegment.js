const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const NarrationSegment = sequelize.define('NarrationSegment', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        bookId: {
            type: DataTypes.UUID,
            allowNull: false
        },
        text: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        voiceProfileId: {
            type: DataTypes.UUID,
            allowNull: true
        },
        role: {
            type: DataTypes.ENUM('narrator', 'tutor', 'character', 'explainer'),
            defaultValue: 'narrator'
        },
        orderIndex: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        }
    });

    return NarrationSegment;
};
