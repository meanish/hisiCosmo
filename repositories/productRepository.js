const Category = require("../models/categoryModel");
const Product = require("../models/productsModel");


module.exports = {
    create: async (proData, options) => {
        console.log("if cat before store", proData)
        try {
            // Create a new user in the database
            return await Product.create(proData, options)

        } catch (error) {
            console.error("Error in ProductRepository.create:", error.message);
            // Handle any errors that occur during user creation
            throw new Error(error);

        }
    },


    addCategories: async (productId, categoryId) => {
        console.log("add to cat", productId, categoryId)
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
        }
        catch (error) {
            // Handle any errors that occur during user creation
            throw new Error(error.message);
        }
    },


    all: async () => {
        try {
            return await Product.findAll();

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
    },

    delete: async (id, options) => {

        try {
            const result = await Category.destroy({ where: { id }, ...options });
            return result > 0;
        }
        catch (error) {
            throw new Error(error.message);
        }
    }

};
