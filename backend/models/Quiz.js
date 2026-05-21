const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Quiz = sequelize.define('Quiz', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        bookId: {
            type: DataTypes.UUID,
            allowNull: false
        },
        chapterId: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        questions: {
            type: DataTypes.JSON, // Array of { question, options, correctAnswer, explanation }
            allowNull: false
        }
    });

    return Quiz;
};
