const Purchase = require("../models/purchaseModel");


module.exports = {

    create: async (fields, user_id, options) => {
        const { order_id, status, total_amount } = fields;

        try {
            return await Purchase.create({
                order_id, status, total_amount
            }, options);
        } catch (error) {
            console.error("Error creating purchase:", error.message);
            throw new Error(error.message);
        }
    },

    findOne: async (id, options) => {
        try {
            return await Purchase.findOne({
                where: { order_id: id },
                ...options
            });
        } catch (error) {
            console.error("Error finding order:", error.message);
            throw new Error(error.message);
        }
    },
    update: async (id, data, options) => {
        try {
            const getPurchase = await Purchase.findOne({
                where: { order_id: id }, ...options
            });
            if (!getPurchase) {
                return null;
            }
            return await getPurchase.update(data)
        } catch (error) {
            console.error("Error finding order:", error.message);
            throw new Error(error.message);
        }
    }
}