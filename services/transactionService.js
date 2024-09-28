const CategoryRepository = require("../repositories/categoryRepository")
const slugify = require('slugify');
const sequelize = require("../database/conn");
const MediaRepository = require("../repositories/mediaRepository");
const categoryRepository = require("../repositories/categoryRepository");
const brandRepository = require("../repositories/brandRepository");
const Brand = require("../models/brandModel");
const mediaRepository = require("../repositories/mediaRepository");
const mediaTask = require("../helper/mediaTask");
const imageConvert = require("../helper/imageSlashremoval");
const orderRepository = require("../repositories/orderRepository");
const orderproductsRepository = require("../repositories/orderproductsRepository");
const transactionRepository = require("../repositories/transactionRepository");



const createNew = async (req) => {
    const transaction = await sequelize.transaction();

    const user_id = req.user.id;
    try {



        const newOrder = await transactionRepository.create(req, user_id, { transaction });
        await transaction.commit();
        return { success: true, message: "New Transaction created sucessfully!" };

    } catch (error) {
        transaction.rollback()
        return {
            success: false, message: error.message, error: error.message
        };
    }


}


const edit = async (req) => {
    const transaction = await sequelize.transaction();
    const { id } = req.body
    const user_id = req.user.id;
    try {
        // check if the use rhave the authority
        const getTransaction = await transactionRepository.find(id, { transaction })

        console.log("Oders", getTransaction?.dataValues?.id)
        const isRightUser = getTransaction?.dataValues?.order_data?.user_id === user_id


        if (isRightUser) {
            const updateTransaction = await transactionRepository.update(req.body, { transaction });
            await transaction.commit();
            return { success: true, message: "Transaction has been updated!" };

        }
        else {
            transaction.rollback()

            return {
                success: false, message: "User has no access to edit the transaction"
            };
        }

    } catch (error) {
        transaction.rollback()
        return {
            success: false, message: error.message, error: error.message
        };
    }


}

module.exports = {
    createNew,
    edit
}