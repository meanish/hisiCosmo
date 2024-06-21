const Category = require("./categoryModel");
const Media = require("./mediaModel");
const Product = require("./productsModel");

// Define associations
Product.hasMany(Media, {
    onDelete: 'CASCADE',
    foreignKey: 'mediaableId',
    constraints: false,
    scope: {
        mediaableType: 'product',
    },
    as: 'productMedia',
});

Media.belongsTo(Product, {
    foreignKey: 'mediaableId',
    constraints: false,
    as: 'Productmediaable',
});

Product.belongsToMany(Category, { through: 'ProductCategories', as: 'categories' });
Category.belongsToMany(Product, { through: 'ProductCategories', as: 'products' });

module.exports = {
    Product,
    Category,
    Media,
};
