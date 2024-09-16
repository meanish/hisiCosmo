const { convertToISO } = require("../helper/isoConvert");
const Discount = require("../models/discountModel");
const discountRepository = require("../repositories/discountRepository");



const addDiscount = async (product, fields, options) => {
    const { id: productId } = product
    let { categoryIds, discount, discount_price, start_date, end_date } = fields



    let data = { productId, discount, discount_price, start_date, end_date }
    try {
        console.log("Disocuint is", discount_price, typeof discount_price)
        if (discount) {
            if (start_date) {
                start_date = convertToISO(start_date)
                data.start_date = start_date
            }
            if (end_date) {
                end_date = convertToISO(end_date)
                data.end_date = end_date
            }

            const storeDiscount = await discountRepository.create(data, options)

            console.log("Dsocint data before passing to controller", storeDiscount)
            return { success: true, data: storeDiscount }

        }
    }
    catch (e) {
        return { success: false, error: e.message }
    }


}

const removeDiscount = async (id) => {

    try {
        const deletedDiscount = await discountRepository.delete(id)
        return { success: true, data: deletedDiscount }
    }
    catch (e) {
        return { success: false, error: error.message }
    }


}


const updateDiscount = async (id, fields,options) => {
    let { categoryIds, discount, discount_price, start_date, end_date } = fields

    let data = {  discount, discount_price, start_date, end_date }
    try {
        console.log("Disocuint is", discount_price, typeof discount_price)
        if (discount) {
            if (start_date) {
                start_date = convertToISO(start_date)
                data.start_date = start_date
            }
            if (end_date) {
                end_date = convertToISO(end_date)
                data.end_date = end_date
            }

            const updatedData = await discountRepository.update(id, data,options)
            return { success: true, data: updatedData }

        }


    }
    catch (e) {
        return { success: false, error: error.message }
    }
}



module.exports = {
    addDiscount,
    removeDiscount,
    updateDiscount

};


