// models/media.js

const { DataTypes } = require('sequelize');
const sequelize = require('../database/conn');

const OrderProducts = sequelize.define('OrderProducts', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Orders', key: 'id' }
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Products', key: 'id' }
    },
    quantity: {
        type: DataTypes.INTEGER,  // Quantity of this specific product in the order
        allowNull: false,
        defaultValue: 1            // Default quantity is 1 unless specified
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),  // The price at the time of the order for that product
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
},
    {
        tableName: 'orderproducts',
        timestamps: true,
        underscored: true,
    }
);


sequelize.sync().then(() => {
    sequelize.sync()
        .then(() => {
            console.log("OrderProducts table synchronized successfully.");
        })
        .catch((error) => {
            console.error('Unable to synchronize the orderproducts table:', error);
        });
})



module.exports = OrderProducts;
