const categoryService = require("../services/categoryService")
const brandService = require("../services/brandService")


const createBrand = async (req, res) => {
    try {
        const result = await brandService.createNew(req);


        if (result.success === false) {
            // If the service returns an error, send a 400 response with the message
            res.status(400).json({ message: result.message, success: false });
        } else {
            // If the service returns a success, send a 200 response with the data
            res.status(200).json({ data: result, success: true });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

const getAllBrand = async (req, res) => {

    try {
        const result = await brandService.getallBrand();

        if (result.success) {
            res.status(200).json({ data: result.data, success: true });
        }
        else res.status(500).json({ success: false, message: 'failed to get all brands details' });


    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

const getInputCat = async (req, res) => {
    try {
        const searchText = req.query.text;
        if (!searchText) {
            return res.status(400).json({ error: "The 'text' query parameter is required" });
        }

        const result = await categoryService.getallCat();
        const findMatches = (categories, searchText) => {
            let matches = [];
            categories.forEach(category => {
                if (category.name.toLowerCase().includes(searchText.toLowerCase())) {
                    matches.push({ name: category.name, id: category.id });
                }
            });
            return matches;
        };
        const matchingNames = findMatches(result, searchText);
        res.status(200).json({ data: matchingNames, sucess: true });
    }
    catch (error) {
        res.status(500).json({ error: "An error occurred while processing your request" });
    }
}


const editSingleBrand = async (req, res) => {

    try {
        const { id } = req.params;
        const fields = req.body
        const file = req.file
        const result = await brandService.editSingleBrand({ fields, id, file })

        if (result.success) {
            res.status(200).json({ data: result.data, success: true });
        } else {
            res.status(500).json({ error: result.message, success: false });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: true, error: error });
    }
}




const getSingleBrand = async (req, res) => {

    try {
        const { id } = req.params;

        const result = await brandService.getSingleBrand(id);

        if (!result.success) {
            // If the service returns an error, send a 400 response with the message
            res.status(400).json({ success: false, error: result.message });
        } else {
            // If the service returns a success, send a 200 response with the data
            res.status(200).json({ data: result.data, success: true });
        }


    }
    catch (error) {

        console.error(error);
        res.status(500).json({ error: "An error occurred while processing your request" });
    }
}


const deleteSingleBrand = async (req, res) => {
    try {
        const { id } = req.params;
        const isAvailable = await brandService.getSingleBrand(id);
        if (!isAvailable.success) {
            // If the service returns an error, send a 400 response with the message
            res.status(400).json({ success: false, message: "Id not found" });
        } else {

            const deleteBrand = await brandService.deleteSingleBrand(id)
            if (!deleteBrand.success) {
                // If the service returns an error, send a 400 response with the message
                res.status(400).json({ success: false, error: deleteBrand.message });
            } else {
                // If the service returns a success, send a 200 response with the data
                res.status(200).json({ message: deleteBrand.message, success: true });
            }
        }
    }
    catch (error) {
        res.status(500).json({ error: error, success: false });
    }
}

module.exports = {
    createBrand,
    getAllBrand,
    getInputCat,
    editSingleBrand,
    getSingleBrand,
    deleteSingleBrand
};