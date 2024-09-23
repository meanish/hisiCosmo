const Discount = require("../models/discountModel")
const slugify = require('slugify');


module.exports = {

    create: async (data, options) => {
        console.log("Dis dfd", data)
        try {
            // Create a new user in the database
            const DiscountData = await Discount.create(data, options);
            console.log("Stored Discount", DiscountData)
            return DiscountData;

        } catch (error) {

            console.log("Ay Error", error.message)
            // Handle any errors that occur during user creation
            throw new Error(error.message);
        }
    },

    all: async () => {
        try {
            const AllDiscount = await Discount.findAll();
            return AllDiscount

        } catch (error) {
            // Handle any errors that occur during user creation
            throw new Error(error.message);
        }
    },

    update: async (id, fields, options) => {
        try {

            const discount = await Discount.findByPk(id);
            console.log("Found the disocunt table daata", discount, "Wht update", fields)
            await discount.update(fields, options);
            return discount
        }


        catch (error) {
            // Handle any errors that occur during user creation
            throw new Error(error.message);
        }
    },

    delete: async (id, options) => {

        try {
            const result = await Discount.destroy({ where: { id }, ...options });
            return result > 0;
        }
        catch (error) {
            throw new Error(error.message);
        }
    }


};


/* Dis dfd {
  productId: 27,
  discount: '1',
  discount_price: '100',
  start_date: 2024-09-16T18:15:00.000Z,
  end_date: 2024-09-20T18:15:00.000Z
} */

/* Dis dfd {
productId: 93,
discount: '1',
discount_price: '12',
start_date: 2024-09-13T18:15:00.000Z,
end_date: 2024-09-20T18:15:00.000Z
} */