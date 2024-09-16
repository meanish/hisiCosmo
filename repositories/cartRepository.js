const Brand = require("../models/brandModel");
const Cart = require("../models/cartsModel");
const Category = require("../models/categoryModel")
const slugify = require('slugify');


module.exports = {

    create: async (id) => {
        console.log("create")
        try {
            // Create a new user in the database
            return await Cart.create({ user_id: id });


        } catch (error) {
            console.log("error", error.message)
            // Handle any errors that occur during user creation
            throw new Error(error.message);
        }
    },

    all: async () => {
        try {
            const AllCarts = await Cart.findAll();
            return AllCarts

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

    delete: async (id, options) => {

        try {
            const result = await Brand.destroy({ where: { id }, ...options });
            return result > 0;
        }
        catch (error) {
            throw new Error(error.message);
        }
    },

    find: async (id, options) => {
        console.log("id is ", id)
        try {
            return Cart.findOne({ where: { user_id: id }, ...options });

        } catch (error) {
            console.log("Error", error.message)
            // Handle any errors that occur during user creation
            throw new Error(error.message);
        }
    },




};
