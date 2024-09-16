const { DataTypes } = require('sequelize');
const sequelize = require('../database/conn');
const Media = require('./mediaModel');
const { default: slugify } = require('slugify');
const Category = require('./categoryModel');
const Brand = require('./brandModel');

const Cart = sequelize.define('Cart', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

}, {
    timestamps: false
})


sequelize.sync().then(() => {
    sequelize.sync()
        .then(() => {
            console.log("Cart table synchronized successfully.");
        })
        .catch((error) => {
            console.error('Unable to synchronize the cart table:', error);
        });
})


module.exports = Cart
