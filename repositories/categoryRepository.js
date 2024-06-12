const Category = require("../models/categoryModel")
const slugify = require('slugify');


module.exports = {

    create: async (catData) => {
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

    update: async ({ id, parent_category_id, name, description }) => {
        console.log("What the id", id)
        try {

            const category = await Category.findByPk(id);
            category.name = name;
            category.slug = slugify(name, { lower: true, strict: true });
            category.parent_category_id = parent_category_id;
            category.description = description;
            await category.save();

            // Return the updated category
            return category;
        }


        catch (error) {
            // Handle any errors that occur during user creation
            throw new Error(error.message);
        }
    }
};
