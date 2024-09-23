const Brand = require("../models/brandModel");
const Cart = require("../models/cartsModel");
const Category = require("../models/categoryModel")
const slugify = require('slugify');
const Order = require("../models/ordersModel");
const OrderProducts = require("../models/orderProductModel");


module.exports = {

    create: async (order_id, products, options) => {
        try {
            // Ensure all product insertions are awaited using Promise.all()
            if (products.length > 0) {
                const orderProductsData = products.map(product => ({
                    order_id,
                    product_id: product.product_id,
                    quantity: product.quantity,
                    price: product.price
                }));

                // Use Promise.all to await all product creations
                await Promise.all(orderProductsData.map(async product => {
                    await OrderProducts.create(product, options); // Insert product with transaction
                }));
            }

        } catch (error) {
            console.error("Error creating order products:", error.message);
            throw new Error(error.message);
        }
    },



    addProducts: async (productId, categoryIds, options) => {
        console.log("add to cat", productId, categoryIds, typeof categoryIds)
        try {
            const product = await Order.findByPk(productId);

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
        try {
            console.log("Finding cart for user_id:", id);
            return Cart.findOne({ where: { user_id: id }, ...options });
        } catch (error) {
            console.error("Error finding cart:", error.message);
            throw new Error("Failed to retrieve cart. " + error.message);
        }
    }




};
