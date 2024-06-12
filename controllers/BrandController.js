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


                // // recursion method 
                // if (category.subcategories && category.subcategories.length > 0) {
                //     matches = matches.concat(findMatches(category.subcategories, searchText));
                // }


            });

            return matches;
        };

        const matchingNames = findMatches(result, searchText);



        res.status(200).json({ data: matchingNames, sucess: true });



    }
    catch (error) {
        // Step 5: Handle any potential errors
        console.error(error);
        res.status(500).json({ error: "An error occurred while processing your request" });
    }
}


const editSingleBrand = async (req, res) => {

    try {
        const { id } = req.params;

        const fields = req.body
        const file = req.file

        const updatedbrand = await brandService.editSingleBrand({ fields, id, file })

        if (updatedbrand.success) {
            res.status(200).json({ data: updatedbrand.data, success: true });
        } else {
            res.status(400).json({ error: updatedbrand.message, success: false });
        }


    }
    catch (error) {
        // Step 5: Handle any potential errors
        console.error(error);
        res.status(500).json({ error: "An error occurred while processing your request" });
    }
}




const getSingleCat = async (req, res) => {

    try {
        const { id } = req.params;

        const result = await categoryService.getSingleCat(id);

        if (result.success === false) {
            // If the service returns an error, send a 400 response with the message
            res.status(400).json({ success: false, message: result.message });
        } else {
            // If the service returns a success, send a 200 response with the data
            res.status(200).json({ data: result, success: true });
        }


    }
    catch (error) {
        // Step 5: Handle any potential errors
        console.error(error);
        res.status(500).json({ error: "An error occurred while processing your request" });
    }
}


const deleteSingleBrand = async (req, res) => {
    try {
        const { id } = req.params;
        const getBrand = await brandService.getSingleBrand(id);
        if (!getCat.success) {
            // If the service returns an error, send a 400 response with the message
            res.status(400).json({ success: false, message: result.message });
        } else {
            const deleteBrand = await brandService.deleteSingleBrand(getBrand)
            res.status(200).json({ success: "DeleteSucess" });

        }
    }
    catch (error) {
        res.status(500).json({ error: "An error occurred while processing your request" });
    }
}

module.exports = {
    createBrand,
    getAllBrand,
    getInputCat,
    editSingleBrand,
    getSingleCat,
    deleteSingleBrand
};