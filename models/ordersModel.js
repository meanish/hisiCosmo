// models/media.js

const { DataTypes } = require('sequelize');
const sequelize = require('../database/conn');

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "Users",
            key: 'id'
        }
    },
    payment_type: {
        type: DataTypes.ENUM("cod", "esewa"),
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('pending', 'processing', 'completed', 'failed', 'cancelled'),
        defaultValue: "pending"
    },
    total_amount: {
        type: DataTypes.DECIMAL(10, 2), allowNull: false
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
        tableName: 'orders',
        timestamps: true,
        underscored: true,
    }
);


sequelize.sync().then(() => {
    sequelize.sync()
        .then(() => {
            console.log("Order table synchronized successfully.");
        })
        .catch((error) => {
            console.error('Unable to synchronize the order table:', error);
        });
})



module.exports = Order;
