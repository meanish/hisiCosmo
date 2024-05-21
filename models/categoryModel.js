// models/user.js

const { DataTypes } = require('sequelize');
const sequelize = require('../database/conn');
const slugify = require('slugify');


const Category = sequelize.define('Category', {
    // Define model attributes
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


    parent_category_id: {
        type: DataTypes.INTEGER,
        defaultValue: null,

        references: {
            model: 'categories', // This references the table name
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
}, {
    // Define model options
    tableName: 'categories', // Name of the database table
    timestamps: true, // Add createdAt and updatedAt fields
    underscored: true, // Use snake_case for column names
    hooks: {
        beforeValidate: (category, options) => {
            if (category.name) {
                category.slug = slugify(category.name, { lower: true, strict: true });
            }

            if (category.parent_category_id === 0) {
                category.parent_category_id = null;
            }
        },
    },
});


Category.hasMany(Category, { as: 'subcategories', foreignKey: 'parent_category_id' });
Category.belongsTo(Category, { as: 'parent', foreignKey: 'parent_category_id' });



sequelize.sync().then(() => {
    sequelize.sync()
        .then(() => {
            console.log("Category table synchronized successfully.");
        })
        .catch((error) => {
            console.error('Category to synchronize the User table:', error);
        });
})


module.exports = Category;
