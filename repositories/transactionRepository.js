const Order = require("../models/ordersModel");
const Transaction = require("../models/transactionModel");
const { find } = require("./mediaRepository");


module.exports = {

    create: async (data, options) => {

        try {
            return await Transaction.create({
                ...data
            }, options);
        } catch (error) {
            console.error("Error creating transaction:", error.message);
            throw new Error(error.message);
        }
    },


    find: async (id, options) => {
        console.log("id", id)
        try {
            return await Transaction.findOne({
                where: { id: id },
                include: [{
                    model: Order,
                    as: 'order_data',
                    attributes: ['id', 'user_id', 'status'],
                }]
            });
        } catch (error) {
            console.error("Error creating transaction:", error.message);
            throw new Error(error.message);
        }
    },


    update: async (data, options) => {
        const { id } = data

        console.log("Inservices", id)
        try {

            const findTransaction = await Transaction.findByPk(id);
            await findTransaction.update({ ...data, ...options });
            return findTransaction
        }


        catch (error) {
            // Handle any errors that occur during user creation
            throw new Error(error.message);
        }
    },

}