const sequelize = require("../database/conn");

const shippingRepository = require("../repositories/shippingRepository");
const { validateShippingData } = require("../schemas/shippingSchema");


const storeNew = async (req, res) => {
    const transaction = await sequelize.transaction();
    const data = req.body
    const user_id = req.user.id;
    console.log("User in request", data)

    const validationErrors = validateShippingData(data);
    if (validationErrors) {
        throw new Error(JSON.stringify(validationErrors));

    }

    // check if already exists
    const isExisting = await shippingRepository.find(user_id, { transaction })

    console.log("is existing", isExisting)
    if (isExisting) {
        await shippingRepository.update(user_id, data, { transaction })
    }
    else {
        await shippingRepository.create(user_id, data, { transaction })
    }
    await transaction.commit();
    return {
        success: true, message: "Shipping Address Updated!"
    };



}


const getData = async (req, res) => {
    const user_id = req.user.id;
    const transaction = await sequelize.transaction();

    try {
        const getCartId = await shippingRepository.find(user_id, { transaction })
        console.log("GetCart", getCartId)
        if (getCartId) {
            return {
                success: true,
                data: getCartId.dataValues,
            }
        }
        else {
            return {
                success: true,
                data: null,
            }
        }

    }
    catch (error) {
        await transaction.rollback();
        return { success: false, message: error.message };
    }
}





module.exports = {
    storeNew,
    getData



};