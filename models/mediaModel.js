// models/media.js

const { DataTypes } = require('sequelize');
const sequelize = require('../database/conn');

const Media = sequelize.define('Media', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mediaableId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    mediaableType: {
        type: DataTypes.STRING,
        allowNull: false
    },
    filePath: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fileType: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'media',
    timestamps: true,
    underscored: true,
    getterMethods: {
        url() {
            return this.path;
        }
    }
});


sequelize.sync().then(() => {
    sequelize.sync()
        .then(() => {
            console.log("Media table synchronized successfully.");
        })
        .catch((error) => {
            console.error('Unable to synchronize the media table:', error);
        });
})



module.exports = Media;
