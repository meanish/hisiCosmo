const Category = require("../models/categoryModel");
const Product = require("../models/productsModel");


module.exports = {
    create: async (productData) => {
        console.log("if cat before store", productData)
        try {
            // Create a new user in the database
            const ProductData = await Product.create(productData);
            return ProductData;

        } catch (error) {
            // Handle any errors that occur during user creation
            throw new Error(error.message);
        }
    },


    addCategories: async (productId, categoryIds) => {
        console.log("if cat before store", categoryIds)
        try {
            const product = await Product.findByPk(productId);
            const categories = await Category.findAll({
                where: { id: categoryIds }
            });
            return await product.addCategories(categories, { through: { selfGranted: false } });

        } catch (error) {
            // Handle any errors that occur during user creation
            throw new Error(error.message);
        }
    },


};
