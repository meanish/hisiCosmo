const { DataTypes } = require('sequelize');
const sequelize = require('../database/conn');


const CartItem = sequelize.define('CartItem', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    cart_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Carts',
            key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Products',
            key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
    quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
    },

}, {
    tableName: 'cartitems', // Proper table name for junction table
    timestamps: false, // Automatically handles created_at and updated_at
    underscored: true, // Use snake_case for timestamps and other automatic fields
});



sequelize.sync()
    .then(() => {
        console.log("Cartitem table synchronized successfully.");
    })
    .catch((error) => {
        console.error('Unable to synchronize the Cartitems table:', error);
    });

module.exports = CartItem;