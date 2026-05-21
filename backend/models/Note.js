const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Note = sequelize.define('Note', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false
        },
        bookId: {
            type: DataTypes.UUID,
            allowNull: false
        },
        pageId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        color: {
            type: DataTypes.STRING,
            defaultValue: 'yellow' // yellow, blue, green, pink
        },
        highlightText: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        // SRS Fields
        nextReview: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        interval: {
            type: DataTypes.INTEGER,
            defaultValue: 0 // In days
        },
        easeFactor: {
            type: DataTypes.FLOAT,
            defaultValue: 2.5
        },
        repetitionCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        }
    });

    return Note;
};
