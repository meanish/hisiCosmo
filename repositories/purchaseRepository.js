const Purchase = require("../models/purchaseModel");


module.exports = {

    create: async (req, user_id, options) => {
        const { order_id, status, total_amount } = req.body;

        try {
            return await Purchase.create({
                order_id, status,  total_amount
            }, options);
        } catch (error) {
            console.error("Error creating purchase:", error.message);
            throw new Error(error.message);
        }
    }
}