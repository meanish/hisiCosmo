const categoryService = require("../services/categoryService")


const newCategory = async (req, res) => {
    const { name, parent_category_id } = req.body;

    try {
        const result = await categoryService.createNew(req.body);
        res.status(200).json({ data: result, sucess: true });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

const getAllCat = async (req, res) => {

    try {
        const result = await categoryService.getallCat();
        res.status(200).json({ data: result, sucess: true });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}





module.exports = {
    newCategory,
    getAllCat
};