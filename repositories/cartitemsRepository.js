const Brand = require("../models/brandModel");
const CartItem = require("../models/cartitemsModel");
const Cart = require("../models/cartsModel");
const Category = require("../models/categoryModel")
const slugify = require('slugify');
const Product = require("../models/productsModel");
const Media = require("../models/mediaModel");


module.exports = {

    create: async (data, cart, options) => {

        console.log("Cart", cart)
        const cart_id = cart.id
        const CartItems = { ...data, cart_id }

        console.log("CartItems", CartItems)
        try {
            // Create a new user in the database
            return await CartItem.create(CartItems, { ...options });


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

    update: async (data, cart, options) => {

        const { cart_id, product_id } = cart

        const cartData = { cart, ...data }

        // console.log("Cart Daata", cartData)
        try {
            const cartItems = await CartItem.findOne({ where: { product_id, cart_id } })
            const getQuantity = cartItems.dataValues.quantity;
            cartData.quantity = +cartData.quantity + +getQuantity
            if (cartData.quantity > 10) {
                throw new Error("Total items to be placed in the cart is exceeding limit 10. Please check your cart.");
            }
            else {
                return await cartItems.update(cartData, { ...options });
            }


        }


        catch (error) {
            // Handle any errors that occur during user creation
            throw new Error(error.message);
        }
    },

    asyncupdate: async (data, cart, options) => {
        const { cart_id, product_id } = cart;
        const cartData = { ...data, cart_id, product_id };  // Merge necessary data for update
        try {
            // Find the cart item
            const cartItems = await CartItem.findOne({ where: { product_id, cart_id }, ...options });

            if (!cartItems) {
                console.log(`CartItem not found for cart_id: ${cart_id} and product_id: ${product_id}`);
                throw new Error('CartItem not found.');
            }

            // Proceed with updating the cart item
            const afterUpdate = await cartItems.update(cartData, { ...options });

            console.log("After Update:", afterUpdate);

            return afterUpdate;
        } catch (error) {
            console.error("Error during cart update:", error.message);
            throw new Error(`Failed to update cart item: ${error.message}`);
        }
    },


    delete: async (data, cart, options) => {
        const { product_id, cart_id } = cart

        try {
            return await CartItem.destroy({ where: { product_id, cart_id }, ...options });

        } catch (error) {
            console.log("Error", error.message)
            // Handle any errors that occur during user creation
            throw new Error(error.message);
        }
    },

    find: async (data, cart, options) => {
        const { product_id } = data;
        const cart_id = cart.id;

        try {
            console.log(`Looking for CartItem with product_id: ${product_id} and cart_id: ${cart_id}`);
            const cartItem = await CartItem.findOne({ where: { product_id, cart_id }, ...options });

            if (!cartItem) {
                console.log(`CartItem not found for cart_id: ${cart_id} and product_id: ${product_id}`);
                return null;
            }

            return cartItem;
        } catch (error) {
            console.error("Error during cart item retrieval:", error.message);
            throw new Error(`Failed to retrieve cart item: ${error.message}`);
        }
    },

    findAll: async (id, options) => {
        try {
            const all = await CartItem.findAll({
                where: { cart_id: id },
                include: [{
                    model: Product,
                    as: 'product',
                    attributes: ['id', 'name', 'price', 'description'],
                    include: [
                        {
                            model: Media,
                            as: 'productmedia',
                            attributes: ['file_path'],
                            where: {
                                mediaableType: 'product'
                            }
                        }
                    ]
                }],
                ...options
            })

            return all
        }
        catch (error) {
            throw new Error(error.message)
        }
    }


};
