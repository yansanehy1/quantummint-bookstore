const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const ReadingSession = sequelize.define('ReadingSession', {
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
        startTime: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        endTime: {
            type: DataTypes.DATE,
            allowNull: true
        },
        durationSeconds: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        pagesRead: {
            type: DataTypes.JSON, // Array of page IDs read in this session
            defaultValue: []
        }
    });

    return ReadingSession;
};
