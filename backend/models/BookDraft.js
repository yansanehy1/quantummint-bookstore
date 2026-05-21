const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const BookDraft = sequelize.define('BookDraft', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false
        },
        title: {
            type: DataTypes.STRING,
            allowNull: true
        },
        metadata: {
            type: DataTypes.JSON,
            defaultValue: {}
        },
        pages: {
            type: DataTypes.JSON,
            defaultValue: []
        },
        selectedVoiceId: {
            type: DataTypes.STRING,
            defaultValue: 'voice-kore'
        },
        lastSavedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'BookDrafts',
        timestamps: true
    });

    return BookDraft;
};
