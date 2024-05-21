const Category = require("../models/categoryModel")


module.exports = {
    create: async (catData) => {
        console.log("if cat before store", catData)
        try {
            // Create a new user in the database
            const CatData = await Category.create(catData);
            return CatData;

        } catch (error) {
            // Handle any errors that occur during user creation
            throw new Error(error.message);
        }
    },

    all: async () => {
        try {
            // Create a new user in the database
            const AllCatData = await Category.findAll({
                where: { parent_category_id: null },
                include: {
                    model: Category,
                    as: 'subcategories',
                    include: {
                        model: Category,
                        as: 'subcategories',
                    },
                },
            });
            return AllCatData;

        } catch (error) {
            // Handle any errors that occur during user creation
            throw new Error(error.message);
        }
    },
};
