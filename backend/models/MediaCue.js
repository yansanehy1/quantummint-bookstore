const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const MediaCue = sequelize.define('MediaCue', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        book_id: {
            type: DataTypes.UUID,
            allowNull: false
        },
        page_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        cue_type: {
            type: DataTypes.ENUM('visual', 'formula', 'step', 'highlight'),
            allowNull: false
        },
        timestamp_ms: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        metadata: {
            type: DataTypes.JSONB,
            defaultValue: {}
        },
        position_data: {
            type: DataTypes.JSONB,
            defaultValue: {}
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        tableName: 'MediaCues',
        underscored: true
    });

    return MediaCue;
};
