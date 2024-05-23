const categoryService = require("../services/categoryService")


const newCategory = async (req, res) => {
    console.log("Body", req.body)


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


                // recursion method 
                if (category.subcategories && category.subcategories.length > 0) {
                    matches = matches.concat(findMatches(category.subcategories, searchText));
                }
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




module.exports = {
    newCategory,
    getAllCat,
    getInputCat
};