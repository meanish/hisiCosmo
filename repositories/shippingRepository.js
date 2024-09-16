const Brand = require("../models/brandModel");
const Cart = require("../models/cartsModel");
const Category = require("../models/categoryModel")
const slugify = require('slugify');
const Shipping = require("../models/shippingModel");


module.exports = {

    create: async (user_id, data, options) => {
        const allData = { user_id, ...data }
        console.log("To create", allData)
        try {
            // Create a new user in the database
            return await Shipping.create(allData, { ...options });


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

    update: async (user_id, data, options) => {
        console.log("What the id", user_id, data)
        try {

            const shipping = await Shipping.findOne({ where: { user_id } });
            await shipping.update(data, { ...options });
            return shipping;
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
            return Shipping.findOne({ where: { user_id: id }, ...options });

        } catch (error) {
            console.log("Error", error.message)
            // Handle any errors that occur during user creation
            throw new Error(error.message);
        }
    },




};
