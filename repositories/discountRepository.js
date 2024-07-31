const Discount = require("../models/discountModel")
const slugify = require('slugify');


module.exports = {

    create: async (data) => {
        console.log("Dis dfd", data)
        try {
            // Create a new user in the database
            const DiscountData = await Discount.create(data);
            console.log("Stored Discount", DiscountData)
            return DiscountData;

        } catch (error) {

            console.log("Ay Error", error.message)
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
