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
const AddUrlImage = require("../helper/addUrlImage");
const UrlinOrder = require("../helper/urlinOrder");
const Transaction = require("../models/transactionModel");
const Purchase = require("../models/purchaseModel");
const Order = require("../models/ordersModel");



const createNew = async (req) => {
    const transaction = await sequelize.transaction();
    const { payment_type, status, total_amount, products } = req.body;
    const user_id = req.user.id;
    try {



        const newOrder = await orderRepository.create(req, user_id, { transaction });
        if (newOrder) {
            // store products of the order
            const addProducts = await orderproductsRepository.create(newOrder?.dataValues.id, products, { transaction })
        }
        await transaction.commit();
        console.log("........................", newOrder)
        return { success: true, message: "New Order created sucessfully!", data: newOrder?.dataValues };

    } catch (error) {
        transaction.rollback()
        return {
            success: false, message: "Failed to create an order"
        };
    }


}



const getmyOrder = async (req) => {
    const user_id = req.user.id;
    const transaction = await sequelize.transaction();

    try {
        const isExisting = await orderRepository.find(user_id, { transaction });
        const reversedData = isExisting?.reverse();
        if (!isExisting) {
            await transaction.rollback();
            return { success: false, message: "No order found of the user" };
        }

        return { success: true, data: reversedData };


    } catch (error) {

        console.log("error in order services", error.message)
        return { success: false, message: error.message };
    }


}



const getallOrder = async (req) => {
    const transaction = await sequelize.transaction();

    try {
        const OrderData = await orderRepository.findAll({
            transaction,
        });


        const reversedData = OrderData?.reverse();

        if (!OrderData) {
            await transaction.rollback();
            return { success: false, message: "All orders failed to fetch." };
        }



        await transaction.commit();
        return { success: true, data: reversedData };

    } catch (error) {
        await transaction.rollback();
        console.error(error);
        return { success: false, message: "Error fetching orders", error: error.message };
    }
};



const getsingleOrder = async (req) => {

    const transaction = await sequelize.transaction();
    const { id } = req.params;
    const modifiedItemsResult = []
    const user_id = req.user.id
    try {
        const isExisting = await Order.findOne({
            where: { user_id, id },
            transaction,
        });

        if (!isExisting && req.user?.role != "admin") {
            throw new Error("Order not belong to the user");
        }

        const getItemsResult = await orderRepository.findOne(id, { transaction });
        if (!getItemsResult) {
            await transaction.rollback();
            return { success: false, message: getItemsResult?.message };
        }

        console.log("Hwllo", getItemsResult)

        const transactionExists = await Transaction.findOne({
            where: { order_id: getItemsResult?.dataValues.id },
            transaction,
        });

        console.log("Transaction Status", transactionExists)
        getItemsResult.dataValues.transaction_status = transactionExists ? 1 : 0;

        const purchaseExists = await Purchase.findOne({
            where: { order_id: getItemsResult?.dataValues.id },
            transaction,
        });

        console.log("Purchasea Status", purchaseExists)

        getItemsResult.dataValues.purchase_status = purchaseExists ? 1 : 0;


        // addition of image path in the order products
        const addImgPath = UrlinOrder({ items: getItemsResult.dataValues?.orderproducts })


        // const path = featuredImage?.dataValues.file_path;
        // productWithFeaturedImage.featured_image = `${process.env.NEXT_PUBLIC_HISI_SERVER}/${path}` || null;

        modifiedItemsResult.push({
            ...getItemsResult.dataValues,
            orderproducts: addImgPath
        });




        return {
            success: true,
            data: modifiedItemsResult,
        }


    } catch (error) {

        console.log("eroro in order servuides", error.message)
        return { success: false, message: error.message };
    }


}

const editSingleOrder = async ({ fields, id, file }) => {
    const transaction = await sequelize.transaction();
    console.log("Fields", fields)
    try {

        await orderRepository.update(id, fields, { transaction });
        await transaction.commit();

        return {
            success: true,
            message: "Order has been sucessfully updated!"
        };

    } catch (error) {
        return { success: false, message: error.message };
    }

}











module.exports = {
    createNew,
    getmyOrder,
    getallOrder,
    getsingleOrder,
    editSingleOrder

};