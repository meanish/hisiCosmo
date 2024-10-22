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
const PurchaseRepository = require("../repositories/purchaseRepository")
const Order = require("../models/ordersModel");
const { v4: uuidv4 } = require('uuid');
const CryptoJS = require("crypto-js");
const Transaction = require("../models/transactionModel");

const createNew = async (req) => {
    const transaction = await sequelize.transaction();

    const user_id = req.user.id;
    const currentTime = new Date();
    const formattedTime =
        currentTime.toISOString().slice(2, 10).replace(/-/g, '') +
        '-' +
        currentTime.getHours() +
        currentTime.getMinutes() +
        currentTime.getSeconds();
    console.log("User Order Deta ..................................", req.body)
    let transaction_id = formattedTime + +req.body?.order_id
    try {
        let TransactionData = { ...req.body, transaction_id: transaction_id }


        const newOrder = await transactionRepository.create(TransactionData, user_id, { transaction });

        console.log("New Transaction", newOrder)
        await transaction.commit();
        return { success: true, message: "New Transaction created sucessfully!" };

    } catch (error) {
        transaction.rollback()
        return {
            success: false, message: error.message, error: error.message
        };
    }


}

const verify = async (req) => {
    const transaction = await sequelize.transaction();

    const id = req.params.id
    const data = req.query.data

    let decodedString = atob(data);

    const obj = JSON.parse(decodedString)
    console.log("obj==", typeof (obj))
    decodedString = JSON.parse(decodedString)
    console.log("Decoded String", decodedString)





    switch (decodedString?.status) {
        case "COMPLETE":
            try {

                const order = await Order.findByPk(id)
                let TransactionDetails = { order_id: order?.dataValues?.id, total_amount: order?.dataValues?.total_amount, transaction_id: decodedString.transaction_uuid, status: decodedString?.status.toLowerCase() }
                
                //   create a purchase statement
                const newOrderTransaction = await transactionRepository.create(TransactionDetails, { transaction });
                console.log("New Transaction Status", newOrderTransaction)
                // also create a puchase for it
                let PurchaseDetails = { order_id: order?.dataValues?.id, total_amount: order?.dataValues?.total_amount, status: "confirmed" }
                const newPurchase = await PurchaseRepository.create(PurchaseDetails, { transaction });
                console.log("New Purchase Status", newPurchase)
                await transaction.commit();
                return {
                    success: true, message: "Order is placement after successful transaction!"
                };

                // notworking as of now issue with signature variation

                // const uid = uuidv4();
                // const cleanAmount = Number(parseFloat(decodedString.total_amount.replace(/,/g, '')).toFixed(0));
                // console.log(typeof cleanAmount, typeof decodedString.transaction_uuid, typeof decodedString.product_code)
                // const message = `transaction_code=${ decodedString.transaction_code }, status = ${ decodedString.status }, total_amount = ${ cleanAmount }, transaction_uuid = ${ decodedString.transaction_uuid }, product_code = ${ decodedString.product_code }, signed_field_names = ${ decodedString.signed_field_names } `
                // console.log(message)
                // const hash = CryptoJS.HmacSHA256("total_amount=1500,transaction_uuid=241018-132544,product_code=EPAYTEST", process.env.ESEWASECRET);
                // const hashInBase64 = CryptoJS.enc.Base64.stringify(hash);
                // console.log(hashInBase64)
                // console.log(hashInBase64 == decodedString.signature)
                // const result = hashInBase64 == decodedString.signature
                // if (result === false) {
                //     return { success: false, message: "Hash value not matched" };
                // }

            } catch (error) {
                await transaction.rollback();
                return {
                    success: false, message: error.message, error: error.message
                };
            }
            break;

        case "PENDING":
            break;

        case "FULL_REFUND":
            break;

        case "CANCELED":
            break;

    }
}
// Decoded String {
// transaction_code: '0008VL6',
//     status: 'COMPLETE',
//         total_amount: '300.0',
//             transaction_uuid: '241017-211111',
//                 product_code: 'EPAYTEST',
//                     signed_field_names: 'transaction_code,status,total_amount,transaction_uuid,product_code,signed_field_names',
//                         signature: 'Zp2dRRiVcFinlFoZbaNBYMhSSaeLhvFjSgJ22ZdD1ao='
// }



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
    edit,
    verify
}