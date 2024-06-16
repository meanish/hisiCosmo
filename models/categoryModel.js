// models/user.js

const { DataTypes } = require('sequelize');
const sequelize = require('../database/conn');
const slugify = require('slugify');
const Media = require('./mediaModel');


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

    description: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    // Define model options
    tableName: 'categories', // Name of the database table
    timestamps: true, // Add createdAt and updatedAt fields
    underscored: true, // Use snake_case for column names
    hooks: {
        beforeValidate: (category, options) => {
            if (category.parent_category_id === "0" || category.parent_category_id === "") {
                category.parent_category_id = null;
            }
            if (category.name) {
                category.slug = slugify(category.name, { lower: true, strict: true });
            }


        },
    },
});

// Define polymorphic association
Category.hasMany(Media, {
    onDelete: 'CASCADE',
    foreignKey: 'mediaableId',
    constraints: false,
    scope: {
        mediaableType: 'category'
    },
    as: 'categoryMedia'
});

Media.belongsTo(Category, {
    foreignKey: 'mediaableId',
    constraints: false,
    as: 'Categorymediaable'
});




    sequelize.sync()
        .then(() => {
            console.log("Category table synchronized successfully.");
        })
        .catch((error) => {
            console.error('Category to synchronize the User table:', error);
        });


module.exports = Category;
