const categoryService = require("../services/categoryService")
const formidable = require('formidable');

const newCategory = async (req, res) => {
    try {
        const result = await categoryService.createNew(req);
        if (!result.success) {
            // If the service returns an error, send a 400 response with the message
            res.status(400).json({ success: false, error: result.message });
        } else {
            // If the service returns a success, send a 200 response with the data
            res.status(200).json({ data: result.data, success: true });
        }

    } catch (error) {
        res.status(500).json({ success: false, error: error });
    }
}

const getAllCat = async (req, res) => {

    try {
        const result = await categoryService.getallCat();
        if (!result.success) {
            // If the service returns an error, send a 400 response with the message
            res.status(400).json({ success: false, error: result.message });
        } else {
            // If the service returns a success, send a 200 response with the data
            res.status(200).json({ data: result.data, success: true });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
}


const getInputCat = async (req, res) => {
    try {
        const searchText = req.query.text;
        if (!searchText) {
            return res.status(400).json({ sucesss: false, message: "The 'text' query parameter is required" });
        }

        const result = await categoryService.getallCat();


        if (result.success) {
            const findMatches = (categories, searchText) => {
                let matches = [];



                categories.forEach(category => {

                    if (category.name.toLowerCase().includes(searchText.toLowerCase())) {
                        matches.push({ name: category.name, id: category.id });
                    }


                    // // recursion method 
                    // if (category.subcategories && category.subcategories.length > 0) {
                    //     matches = matches.concat(findMatches(category.subcategories, searchText));
                    // }


                });

                return matches;
            };

            const matchingNames = findMatches(result.data, searchText);
            res.status(200).json({ data: matchingNames, sucess: true });
        }



    }
    catch (error) {
        // Step 5: Handle any potential errors
        console.error(error);
        res.status(500).json({ error: "An error occurred while processing your request" });
    }
}


const editSingleCat = async (req, res) => {

    try {
        const { id } = req.params;

        const fields = req.body
        const file = req.file
        const result = await categoryService.editSingleCat({ fields, id, file })

        if (result.success) {
            res.status(200).json({ data: result.data, success: true });
        } else {
            res.status(500).json({ error: "An error occurred while processing your request", success: false });
        }
    } catch (error) {
        res.status(500).json({ error: result.error, success: false });
    }
}




const getSingleCat = async (req, res) => {

    try {
        const { id } = req.params;

        const result = await categoryService.getSingleCat(id);
        console.log("Result ", result)

        if (!result.success) {
            // If the service returns an error, send a 400 response with the message
            res.status(400).json({ success: false, error: result.message });
        } else {
            // If the service returns a success, send a 200 response with the data
            res.status(200).json({ data: result.data, success: true });
        }


    }
    catch (error) {
        // Step 5: Handle any potential errors
        console.error(error);
        res.status(500).json({ error: error, success: false });
    }
}


const deleteSingleCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const isAvailable = await categoryService.getSingleCat(id);
        if (!isAvailable.success) {
            // If the service returns an error, send a 400 response with the message
            res.status(400).json({ success: false, message: "Id not found" });
        } else {
            const deleteCat = await categoryService.deleteSingleCat(id)
            if (!deleteCat.success) {
                // If the service returns an error, send a 400 response with the message
                res.status(400).json({ success: false, error: result.message });
            } else {
                // If the service returns a success, send a 200 response with the data
                res.status(200).json({ data: result.data, message: "Delete Success", success: true });
            }
        }
    }
    catch (error) {
        res.status(500).json({ error: "An error occurred to delete Category" });
    }
}

module.exports = {
    newCategory,
    getAllCat,
    getInputCat,
    editSingleCat,
    getSingleCat,
    deleteSingleCategory
};