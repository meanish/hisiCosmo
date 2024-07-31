const { convertToISO } = require("../helper/isoConvert");
const discountRepository = require("../repositories/discountRepository");
const { getSingleProduct } = require("./productServices");



const addDiscount = async (product, fields) => {
    const { id: productId } = product
    let { categoryIds, discount, discount_price, start_date, end_date } = fields



    let data = { productId, discount, discount_price, start_date, end_date }
    try {
        console.log("Disocuint is", discount_price, typeof discount_price)
        if (discount) {
            console.log("Product has a  discount already . Just refining")
            if (start_date) {
                start_date = convertToISO(start_date)
                data.start_date = start_date
            }
            if (end_date) {
                end_date = convertToISO(end_date)
                data.end_date = end_date
            }

            console.log("StartDta", start_date, end_date)
            const storeDiscount = await discountRepository.create(data)
            console.log("Stored Discount", storeDiscount)
            return { success: true, data: storeDiscount }

        }
    }
    catch (e) {
        return { success: false, error: error.message }
    }


}


module.exports = {
    addDiscount

};