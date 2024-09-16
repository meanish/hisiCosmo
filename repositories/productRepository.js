const Brand = require("../models/brandModel");
const Category = require("../models/categoryModel");
const Product = require("../models/productsModel");


module.exports = {

    create: async (proData) => {
        console.log("if cat before store", proData)
        try {
            // Create a new user in the database
            return await Product.create(proData)

        } catch (error) {
            console.error("Error in ProductRepository.create:", error.message);
            // Handle any errors that occur during user creation
            throw new Error(error);

        }
    },


    addCategories: async (productId, categoryIds, options) => {
        console.log("add to cat", productId, categoryIds, typeof categoryIds)
        try {
            const product = await Product.findByPk(productId);

            if (!product) {
                throw new Error(`Product with ID ${productId} not found`);
            }

            const categories = [];
            categoryIds = JSON.parse(categoryIds).map(Number);
            // Iterate over each categoryId and fetch the corresponding category
            for (const categoryId of categoryIds) {
                console.log(categoryId)
                const category = await Category.findByPk(categoryId, { transaction: options.transaction });

                if (!category) {
                    throw new Error(`Category with ID ${categoryId} not found`);
                }

                categories.push(category);
            }


            console.log('Catgeories', categories)
            if (categories.length !== categoryIds.length) {
                throw new Error(`One or more categories with IDs ${categoryIds} not found`);
            }
            return await product.addCategory(categories, { through: { selfGranted: false } });
        }
        catch (error) {
            // Handle any errors that occur during user creation
            throw new Error(error.message);
        }
    },


    removeCategories: async (productId, categoryIds, options) => {
        console.log("remove from cat", productId, categoryIds, typeof categoryIds)
        try {
            const product = await Product.findByPk(productId);

            if (!product) {
                throw new Error(`Product with ID ${productId} not found`);
            }

            const categories = [];
            categoryIds = JSON.parse(categoryIds).map(Number);
            // Iterate over each categoryId and fetch the corresponding category
            for (const categoryId of categoryIds) {
                console.log(categoryId)
                const category = await Category.findByPk(categoryId, { transaction: options.transaction });

                if (!category) {
                    throw new Error(`Category with ID ${categoryId} not found`);
                }

                categories.push(category);
            }

            console.log('Categories', categories)
            if (categories.length !== categoryIds.length) {
                throw new Error(`One or more categories with IDs ${categoryIds} not found`);
            }
            return await product.removeCategory(categories, { transaction: options.transaction });
        }
        catch (error) {
            // Handle any errors that occur during user creation
            throw new Error(error.message);
        }
    },
    // setCategories: async (productId, categoryId) => {
    //     console.log("add to cat", productId, categoryId)
    //     try {
    //         const product = await Product.findByPk(productId);

    //         if (!product) {
    //             throw new Error(`Product with ID ${productId} not found`);
    //         }

    //         // Find the category by its primary key
    //         const category = await Category.findByPk(categoryId);
    //         if (!category) {
    //             throw new Error(`Category with ID ${categoryId} not found`);
    //         }
    //         return await product.addCategory(category, { through: { selfGranted: false } });
    //     }
    //     catch (error) {
    //         // Handle any errors that occur during user creation
    //         throw new Error(error.message);
    //     }
    // },



    all: async () => {
        try {
            return await Product.findAll();

        } catch (error) {
            // Handle any errors that occur during user creation
            throw new Error(error.message);
        }
    },

    update: async (id, fields, options) => {

        console.log("fields in", fields, "id", id)
        try {
            const product = await Product.findByPk(id);


            console.log("Found the product", product)


            if (!product) {
                throw new Error(`Product with ID ${id} not found`);
            }

            // if (fields.brand_id !== undefined) {
            //     if (fields.brand_id !== null) {
            //         const brand = await Brand.findByPk(fields.brand_id);
            //         if (!brand) {
            //             throw new Error(`Brand with ID ${fields.brand_id} not found`);
            //         }
            //     }
            // }

            await product.update(fields, options)
            return product;

        } catch (error) {
            console.log('Error in ProductRepository.update:', error.message);
            throw new Error(error.message);
        }
    },


    delete: async (id, options) => {

        try {
            const result = await Product.destroy({ where: { id }, ...options });
            return result > 0;
        }
        catch (error) {
            throw new Error(error.message);
        }
    }

};
