const { DataTypes } = require('sequelize');
const sequelize = require('../database/conn');

const ProductCategories = sequelize.define('ProductCategories', {
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Products',
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Categories',
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    }
}, {
    tableName: 'ProductCategories', // Proper table name for junction table
    timestamps: true, // Automatically handles created_at and updated_at
    underscored: true, // Use snake_case for timestamps and other automatic fields
});

// Synchronize the model
sequelize.sync()
    .then(() => {
        console.log("ProductCategories table synchronized successfully.");
    })
    .catch((error) => {
        console.error('Unable to synchronize the ProductCategories table:', error);
    });

module.exports = ProductCategories;
