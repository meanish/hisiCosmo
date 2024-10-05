const Brand = require("../models/brandModel");
const Category = require("../models/categoryModel")
const slugify = require('slugify');
const User = require("../models/userModel");


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
            return await User.findAll();

        } catch (error) {
            // Handle any errors that occur during user creation
            throw new Error(error.message);
        }
    },

    update: async (id, fields, options) => {
        console.log("What the id", id)
        const { username, dob } = fields;

        try {

            const user = await User.findByPk(id);
            // user.username = name;
            // user.dob = dob;
            return user.update({ username, dob });
        }


        catch (error) {
            // Handle any errors that occur during user creation
            throw new Error(error.message);
        }
    },

    delete: async (id, options) => {

        try {
            const result = await Brand.destroy({ where: { id }, ...options });
            return result > 0;
        }
        catch (error) {
            throw new Error(error.message);
        }
    }


};
