const { DataTypes } = require('sequelize');
const sequelize = require('../database/conn');
const Media = require('./mediaModel');
const { default: slugify } = require('slugify');
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


    slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },


    description: {
        type: DataTypes.STRING,
    },

    product_description: {
        type: DataTypes.TEXT('long'),
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM('enabled', 'disabled'),
        allowNull: false,
        defaultValue: 'enabled',
    },

    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
}, {
    tableName: 'products',
    timestamps: true,
    underscored: true,
    hooks: {
        beforeValidate: (product, options) => {
            if (product.name) {
                product.slug = slugify(product.name, { lower: true, strict: true });
            }


        },
    },

});


// // Define polymorphic association
// Product.hasMany(Media, {
//     onDelete: 'CASCADE',
//     foreignKey: 'mediaableId',
//     constraints: false,
//     scope: {
//         mediaableType: 'product'
//     },
//     as: 'productMedia'
// });

// Media.belongsTo(Product, {
//     foreignKey: 'mediaableId',
//     constraints: false,
//     as: 'Productmediaable'
// });


// Product.belongsToMany(Category, { through: 'ProductCategories', as: 'categories' });
// Category.belongsToMany(Product, { through: 'ProductCategories', as: 'products' });

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
