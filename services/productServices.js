const ProductRepository = require("../repositories/productRepository")

const createNew = async (productData) => {
    try {
        const product = await ProductRepository.create(productData);
        return product;

    } catch (error) {
        return { success: false, message: "Catgory failed" };
    }


}


const addCategoriesToProduct = async ({ productId, categoryId }) => {


    try {
        const Catproduct = await ProductRepository.addCategories(productId, categoryId);
        return Catproduct;

    } catch (error) {
        return { success: false, message: "Catgory failed" };
    }


}



module.exports = {
    createNew,
    addCategoriesToProduct

};