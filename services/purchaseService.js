const sequelize = require("../database/conn");
const purchaseRepository = require("../repositories/purchaseRepository");



const createNew = async (req) => {
    const transaction = await sequelize.transaction();

    const user_id = req.user.id;
    try {



        const newOrder = await purchaseRepository.create(req, user_id, { transaction });
        await transaction.commit();
        return { success: true, message: "New purchase order has been created sucessfully!" };

    } catch (error) {
        transaction.rollback()
        return {
            success: false, message: error.message, error: error.message
        };
    }


}

module.exports = {
    createNew
}