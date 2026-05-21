const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const VoiceProfile = sequelize.define('VoiceProfile', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        educatorId: {
            type: DataTypes.UUID,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        provider: {
            type: DataTypes.STRING,
            defaultValue: 'azure'
        },
        providerVoiceId: {
            type: DataTypes.STRING,
            allowNull: true
        },
        languageCode: {
            type: DataTypes.STRING,
            defaultValue: 'en-US'
        },
        pitch: {
            type: DataTypes.FLOAT,
            defaultValue: 1.0
        },
        speed: {
            type: DataTypes.FLOAT,
            defaultValue: 1.0
        },
        status: {
            type: DataTypes.ENUM('active', 'inactive', 'analyzing'),
            defaultValue: 'active'
        },
        metadata: {
            type: DataTypes.JSONB,
            defaultValue: {}
        }
    });

    return VoiceProfile;
};
