// models/user.js

const { DataTypes } = require('sequelize');
const sequelize = require('../database/conn');
const slugify = require('slugify');
const Media = require('./mediaModel');


const Brand = sequelize.define('Brand', {
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

    description: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    // Define model options
    tableName: 'brands', // Name of the database table
    timestamps: true, // Add createdAt and updatedAt fields
    underscored: true, // Use snake_case for column names
    hooks: {
        beforeValidate: (category, options) => {

            if (category.name) {
                category.slug = slugify(category.name, { lower: true, strict: true });
            }


        },
    },
});



// Define polymorphic association
Brand.hasMany(Media, {
    foreignKey: 'mediaableId',
    constraints: false,
    scope: {
        mediaableType: 'brand'
    },
    as: "brandMedia"
});

Media.belongsTo(Brand, {
    foreignKey: 'mediaableId',
    constraints: false,
    as: 'brandMediaable'
});



sequelize.sync().then(() => {
    sequelize.sync()
        .then(() => {
            console.log("Brand table synchronized successfully.");
        })
        .catch((error) => {
            console.error('Failed to synchronize the Brand table:', error);
        });
})


module.exports = Brand;
