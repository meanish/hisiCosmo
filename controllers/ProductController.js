const productService = require("../services/productServices")


const newProduct = async (req, res) => {


    const { categoryIds } = req.body;


    try {
        const result = await productService.createNew(req.body);

        if (categoryIds && categoryIds.length > 0) {
            await productService.addCategoriesToProduct({ productId: result.id, categoryIds });
        }

        res.status(200).json({ data: result, sucess: true });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}






module.exports = {
    newProduct
};