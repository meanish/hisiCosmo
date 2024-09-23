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



const createNew = async (req) => {
    const transaction = await sequelize.transaction();
    const { payment_type, status, total_amount, products } = req.body;
    const user_id = req.user.id;
    try {



        const newOrder = await orderRepository.create(req, user_id, { transaction });
        if (newOrder) {
            // store products of the order
            const addProducts = await orderproductsRepository.create(newOrder.dataValues.id, products, { transaction })
        }
        await transaction.commit();
        return { success: true, message: "New Order created sucessfully!" };

    } catch (error) {
        transaction.rollback()
        return {
            success: false, message: "Couldn't create a brand"
        };
    }


}



const getmyOrder = async (req) => {
    const user_id = req.user.id;
    const transaction = await sequelize.transaction();

    try {
        const isExisting = await orderRepository.find(user_id, { transaction });

        if (!isExisting) {
            await transaction.rollback();
            return { success: false, message: "No order found of the user" };
        }

        return { success: true, data: isExisting };


    } catch (error) {

        console.log("eroro in order servuides", error.message)
        return { success: false, message: error.message };
    }


}



const getallOrder = async (req) => {

    const transaction = await sequelize.transaction();

    try {
        const isExisting = await orderRepository.findAll({ transaction });


        if (!isExisting) {
            await transaction.rollback();
            return { success: false, message: "All order failed to fetch." };
        }

        return { success: true, data: isExisting };


    } catch (error) {

        console.log("eroro in order servuides", error.message)
        return { success: false, message: error.message };
    }


}


const getsingleOrder = async (req) => {

    const transaction = await sequelize.transaction();
    const { id } = req.params;
    console.log("WHat is isd", id)
    const modifiedItemsResult = []
    try {
        const getItemsResult = await orderRepository.findOne(id, { transaction });
        console.log("Hwllo", getItemsResult)

        const addImgPath = UrlinOrder({ items: getItemsResult.dataValues?.orderproducts })


        // const path = featuredImage?.dataValues.file_path;
        // productWithFeaturedImage.featured_image = `${process.env.NEXT_PUBLIC_HISI_SERVER}/${path}` || null;

        modifiedItemsResult.push({
            ...getItemsResult.dataValues,
            orderproducts: addImgPath
        });

        if (!getItemsResult) {
            await transaction.rollback();
            return { success: false, message: "Order failed to fetch." };
        }


        return {
            success: true,
            data: modifiedItemsResult,
        }


    } catch (error) {

        console.log("eroro in order servuides", error.message)
        return { success: false, message: error.message };
    }


}










module.exports = {
    createNew,
    getmyOrder,
    getallOrder,
    getsingleOrder

};