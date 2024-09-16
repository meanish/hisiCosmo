const sequelize = require("../database/conn");
const cartRepository = require("../repositories/cartrepository");
const cartitemsRepository = require("../repositories/cartitemsRepository");
const cartrepository = require("../repositories/cartrepository");


const storeNew = async (req, res) => {
    const transaction = await sequelize.transaction();

    const user_id = req.user.id;
    console.log("User in request", req.user)
    try {
        // check if already exists
        const isExisting = await cartRepository.find(user_id, { transaction })
        if (isExisting) {
            // check if the product id exists of same cart_id
            const checkItems = await cartitemsRepository.find(req.body, isExisting.dataValues, { transaction })
            if (checkItems) {
                await cartitemsRepository.update(req.body, checkItems.dataValues, { transaction })
            }
            else {
                await cartitemsRepository.create(req.body, isExisting.dataValues, { transaction })
            }
        }
        else {
            const createCart = await cartRepository.create(user_id)
            // store all in the cartItems
            await cartitemsRepository.create(req.body, createCart.dataValues, { transaction })
        }
        await transaction.commit();
        return {
            success: true
        };

    } catch (error) {
        await transaction.rollback();
        return { success: false, message: error.message };
    }

}


const getAll = async (req, res) => {
    const user_id = req.user.id;
    const transaction = await sequelize.transaction();


    console.log("Usrer id", user_id)
    try {
        const getCartId = await cartrepository.find(user_id, { transaction })
        const getItemsResult = await cartitemsRepository.findAll(getCartId.dataValues.id, { transaction })


        console.log("get", getItemsResult)
        const modifiedItemsResult = [];

        getItemsResult.forEach(item => {
            let productWithFeaturedImage = { ...item.product.dataValues };


            if (item.product && item.product.productMedia.length > 0) {
                const featuredImage = item.product.dataValues.productMedia[0];
                const path = featuredImage.dataValues.file_path;
                productWithFeaturedImage.featured_image = `${process.env.NEXT_PUBLIC_HISI_SERVER}/${path}` || null;
            }

            modifiedItemsResult.push({
                ...item.dataValues,
                product: productWithFeaturedImage
            });
        });


        // console.log("mModified", modifiedItemsResult)

        return {
            success: true,
            data: modifiedItemsResult,
        }

    }
    catch (error) {
        await transaction.rollback();
        return { success: false, message: error.message };
    }
}

const remove = async (req, res) => {

}


const asyncAll = async (req, res) => {
    const user_id = req.user.id;
    const transaction = await sequelize.transaction();
    const { _method } = req.body;


    console.log("method", _method)


    try {
        const isExisting = await cartRepository.find(user_id, { transaction })
        if (isExisting) {
            switch (_method) {
                case "update": {
                    console.log("Means Update")

                    // check if the product id exists of same cart_id
                    const checkItems = await cartitemsRepository.find(req.body, isExisting.dataValues, { transaction })
                    if (checkItems) {
                        await cartitemsRepository.asyncupdate(req.body, checkItems.dataValues, { transaction })
                    }

                    await transaction.commit();
                    return {
                        success: true, message: "Updated successfully"
                    };
                }
                case "remove": {
                    console.log("Means distroy")
                    // check if the product id exists of same cart_id
                    const checkItems = await cartitemsRepository.find(req.body, isExisting.dataValues, { transaction })

                    console.log("Found items", checkItems)
                    if (checkItems) {
                        await cartitemsRepository.delete(req.body, checkItems.dataValues, { transaction })

                        await transaction.commit();
                        return {
                            success: true, message: "removed from the cart"
                        };
                    }
                    else return {
                        success: false, message: "Items may not be in the cart"
                    };
                }
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
    getAll,
    remove,
    asyncAll



};