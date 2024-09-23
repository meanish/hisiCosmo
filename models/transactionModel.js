// models/media.js

const { DataTypes } = require('sequelize');
const sequelize = require('../database/conn');

const Transaction = sequelize.define('Transaction', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Orders',
            key: 'id'
        }
    },

    status: {
        type: DataTypes.ENUM('initiated', 'success', 'failed', 'pending'),
        defaultValue: 'initiated'
    },

    transactionId: {
        type: DataTypes.STRING,
        allowNull: true
    }, // online payment transaction ID or manually entered by admin for COD

    total_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },

    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
},
    {
        tableName: 'transaction',
        timestamps: true,
        underscored: true,
    }
);


sequelize.sync().then(() => {
    sequelize.sync()
        .then(() => {
            console.log("Transaction table synchronized successfully.");
        })
        .catch((error) => {
            console.error('Unable to synchronize the transaction table:', error);
        });
})



module.exports = Transaction;
