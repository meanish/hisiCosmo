// models/user.js

const { DataTypes } = require('sequelize');
const sequelize = require('../database/conn');

const User = sequelize.define('User', {
    // Define model attributes
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    // Define model options
    tableName: 'users', // Name of the database table
    timestamps: true, // Add createdAt and updatedAt fields
    underscored: true // Use snake_case for column names
});


sequelize.sync().then(() => {
    sequelize.sync()
        .then(() => {
            console.log("User table synchronized successfully.");
        })
        .catch((error) => {
            console.error('Unable to synchronize the User table:', error);
        });
})


module.exports = User;
