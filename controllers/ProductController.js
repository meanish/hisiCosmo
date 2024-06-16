const productService = require("../services/productServices")


const newProduct = async (req, res) => {


    const { categoryId } = req.body;


    try {
        const result = await productService.createNew(req.body);

        if (categoryId) {
            await productService.addCategoriesToProduct({ productId: result.id, categoryId });
        }

        res.status(200).json({ data: result, sucess: true });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}






module.exports = {
    newProduct
};