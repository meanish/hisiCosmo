const Category = require("./categoryModel");
const Media = require("./mediaModel");
const Product = require("./productsModel");
const Brand = require("./brandModel")


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


// Define one-to-many relationship between Brand and Product
Brand.hasMany(Product, { foreignKey: 'brand_id', as: 'products' });
Product.belongsTo(Brand, { foreignKey: 'brand_id', as: 'brand' });


module.exports = {
    Product,
    Category,
    Media,
    Brand
};
