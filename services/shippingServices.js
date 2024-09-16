const sequelize = require("../database/conn");

const shippingRepository = require("../repositories/shippingRepository");
const { validateShippingData } = require("../schemas/shippingSchema");


const storeNew = async (req, res) => {
    const transaction = await sequelize.transaction();

    const user_id = req.user.id;
    console.log("User in request", req.user)

    const validationErrors = validateShippingData(req.body);
    if (validationErrors) {
        throw new Error(JSON.stringify(validationErrors));

    }

    // check if already exists
    const isExisting = await shippingRepository.find(user_id, { transaction })

    console.log("is existing", isExisting)
    if (isExisting) {
        await shippingRepository.update(user_id, req.body, { transaction })
    }
    else {
        await shippingRepository.create(user_id, req.body, { transaction })
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

        return {
            success: true,
            data: getCartId.dataValues,
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