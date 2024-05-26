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


    addCategories: async (productId, categoryId) => {
        console.log("if cat before store", categoryId)
        try {
            const product = await Product.findByPk(productId);
            if (!product) {
                throw new Error(`Product with ID ${productId} not found`);
            }

            // Find the category by its primary key
            const category = await Category.findByPk(categoryId);
            if (!category) {
                throw new Error(`Category with ID ${categoryId} not found`);
            }


            return await product.addCategory(category, { through: { selfGranted: false } });

        } catch (error) {
            // Handle any errors that occur during user creation
            throw new Error(error.message);
        }
    },


};
