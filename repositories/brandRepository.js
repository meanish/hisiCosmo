const Brand = require("../models/brandModel");
const Category = require("../models/categoryModel")
const slugify = require('slugify');


module.exports = {

    create: async (brandData) => {
        try {

            // Create a new user in the database
            const BrandData = await Brand.create(brandData);
            return BrandData;

        } catch (error) {
            // Handle any errors that occur during user creation
            throw new Error(error.message);
        }
    },

    all: async () => {
        try {
            const AllBrands = await Brand.findAll();
            return AllBrands

        } catch (error) {
            // Handle any errors that occur during user creation
            throw new Error(error.message);
        }
    },

    update: async ({ id, name, description }) => {
        console.log("What the id", id)
        try {

            const brand = await Brand.findByPk(id);
            brand.name = name;
            brand.slug = slugify(name, { lower: true, strict: true });
            brand.description = description;
            await brand.save();

            // Return the updated category
            return brand;
        }


        catch (error) {
            // Handle any errors that occur during user creation
            throw new Error(error.message);
        }
    },

    delete: async (id, transaction) => {

        try {
            const result = await Brand.destroy({ where: { id }, transaction });
            return result > 0;
        }
        catch (error) {
            throw error;
        }
    }


};
