const { DataTypes } = require('sequelize');
const sequelize = require('../database/conn');
const Category = require('./categoryModel');

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
}, {
    tableName: 'products',
    timestamps: true,
    underscored: true,
});

Product.belongsToMany(Category, { through: 'ProductCategories', as: 'categories' });
Category.belongsToMany(Product, { through: 'ProductCategories', as: 'products' });

sequelize.sync().then(() => {
    sequelize.sync()
        .then(() => {
            console.log("Product table synchronized successfully.");
        })
        .catch((error) => {
            console.error('Unable to synchronize the product table:', error);
        });
})



module.exports = Product;
