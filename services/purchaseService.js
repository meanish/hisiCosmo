const sequelize = require("../database/conn");
const purchaseRepository = require("../repositories/purchaseRepository");



const createNew = async (req) => {
    const transaction = await sequelize.transaction();

    const user_id = req.user.id;
    const fields = req.body
    try {
        console.log("....fields", fields)


        const newOrder = await purchaseRepository.create(fields, user_id, { transaction });
        await transaction.commit();
        return { success: true, message: "New purchase order has been created sucessfully!" };

    } catch (error) {
        transaction.rollback()
        return {
            success: false, message: error.message, error: error.message
        };
    }


}

const getsinglePurchase = async (req) => {

    const transaction = await sequelize.transaction();
    const { id } = req.params;
    try {
        const getItemsResult = await purchaseRepository.findOne(id, { transaction });
        console.log("Hwllo", getItemsResult)


        if (!getItemsResult) {
            await transaction.rollback();
            return { success: false, message: "No purchase hsitory found." };
        }


        return {
            success: true,
            data: getItemsResult,
        }


    } catch (error) {

        console.log("eroro in order servuides", error.message)
        return { success: false, message: error.message };
    }


}



const editPurchase = async (req) => {

    const transaction = await sequelize.transaction();
    const { id } = req.params;
    try {
        const getItemsResult = await purchaseRepository.update(id, req.body, { transaction });
        if (!getItemsResult) {
            await transaction.rollback();
            return { success: false, message: "No purchase history found." };
        }


        return {
            success: true,
            message: "Purchase status updated success!",
        }


    } catch (error) {

        console.log("eroro in order servuides", error.message)
        return { success: false, message: error.message };
    }


}

module.exports = {
    createNew,
    getsinglePurchase,
    editPurchase
}