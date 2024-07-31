'use strict';


const { DataTypes } = require('sequelize');
const sequelize = require('../database/conn');

const Discount = sequelize.define('Discount', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Products',
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    start_date: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    end_date: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    discount_price: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

}, {
    tableName: 'discounts',
    timestamps: true,
    underscored: true,
});

sequelize.sync().then(() => {
    sequelize.sync()
        .then(() => {
            console.log("Discount table synchronized successfully.");
        })
        .catch((error) => {
            console.error('Unable to synchronize the discount table:', error);
        });
})



module.exports = Discount;
