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

        console.log("Error in saving the cart", error)
        await transaction.rollback();
        return { success: false, message: error.message };
    }

}


const getAll = async (req, res) => {
    const user_id = req.user.id;
    const transaction = await sequelize.transaction();

    try {
        const getCartId = await cartrepository.find(user_id, { transaction })

        const getItemsResult = await cartitemsRepository.findAll(getCartId?.dataValues.id, { transaction })

        const modifiedItemsResult = [];

        getItemsResult.forEach(item => {
            let productWithFeaturedImage = { ...item.product?.dataValues };


            if (item.product && item.product.productMedia.length > 0) {
                const featuredImage = item.product?.dataValues.productMedia[0];
                const path = featuredImage?.dataValues.file_path;
                productWithFeaturedImage.featured_image = `${process.env.NEXT_PUBLIC_HISI_SERVER}/${path}` || null;
            }

            modifiedItemsResult.push({
                ...item.dataValues,
                product: productWithFeaturedImage
            });
        });




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

const asyncAll = async (req) => {
    const user_id = req.user.id;
    const transaction = await sequelize.transaction();
    const { _method } = req.body;

    try {
        // Find existing cart
        const isExisting = await cartRepository.find(user_id, { transaction });

        if (!isExisting) {
            await transaction.rollback();
            return { success: false, message: "Cart not found" };
        }

        switch (_method) {
            case "update":
                console.log("Updating cart items");

                const checkItems = await cartitemsRepository.find(req.body, isExisting.dataValues, { transaction });

                if (checkItems) {
                    // Perform update
                    await cartitemsRepository.asyncupdate(req.body, checkItems.dataValues, { transaction });
                    await transaction.commit();
                    return { success: true, message: "Updated successfully" };
                } else {
                    await transaction.rollback();
                    return { success: false, message: "Items not found in the cart" };
                }

            case "remove":
                console.log("Removing items from cart");

                const checkItemsRemove = await cartitemsRepository.find(req.body, isExisting.dataValues, { transaction });

                if (checkItemsRemove) {
                    // Perform delete
                    await cartitemsRepository.delete(req.body, checkItemsRemove.dataValues, { transaction });
                    await transaction.commit(); // Commit transaction after successful removal
                    return { success: true, message: "Removed from the cart" };
                } else {
                    await transaction.rollback();
                    return { success: false, message: "Items may not be in the cart" };
                }

            default:
                await transaction.rollback(); 
                return { success: false, message: "Invalid method" };
        }
    } catch (error) {

        await transaction.rollback();
        console.error("Error in asyncAll:", error.message);
        return { success: false, message: error.message };
    }
}





module.exports = {
    storeNew,
    getAll,
    remove,
    asyncAll



};