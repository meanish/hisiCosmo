const CategoryRepository = require("../repositories/categoryRepository")

const createNew = async (catData) => {

    try {
        const category = await CategoryRepository.create(catData);
        return category;

    } catch (error) {
        return { success: false, message: "Catgory failed" };
    }


}



const getallCat = async () => {

    try {
        const category = await CategoryRepository.all();
        return category;

    } catch (error) {
        return { success: false, message: "Category failed" };
    }


}



module.exports = {
    createNew,
    getallCat

};