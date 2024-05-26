const Category = require("../models/categoryModel")
const slugify = require('slugify');


module.exports = {

    create: async (catData) => {
        console.log("if cat before store", catData)
        try {

            // Create a new user in the database
            const CatData = await Category.create(catData);
            return CatData;

        } catch (error) {
            // Handle any errors that occur during user creation
            throw new Error(error.message);
        }
    },

    all: async () => {
        try {
            const AllCatData = await Category.findAll();
            return AllCatData

        } catch (error) {
            // Handle any errors that occur during user creation
            throw new Error(error.message);
        }
    },

    update: async () => {

    }
};
