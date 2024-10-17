const categoryService = require("../services/categoryService")
const brandService = require("../services/brandService")
const orderService = require("../services/orderService")


const storeNew = async (req, res) => {
    try {
        const result = await orderService.createNew(req);

        console.log("..........................", result)


        if (!result.success) {
            res.status(400).json({ message: result.message, success: false });
        } else {
            res.status(200).json({ message: result.message, success: true, data: result?.data });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

const getMyOrder = async (req, res) => {

    try {
        const result = await orderService.getmyOrder(req);

        if (result.success) {
            res.status(200).json({ data: result.data, success: true });
        }
        else res.status(500).json({ success: false, message: result?.message });


    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

const getAllOrder = async (req, res) => {
    try {
        const result = await orderService.getallOrder(req);

        if (result.success) {
            res.status(200).json({ data: result.data, success: true });
        }
        else res.status(500).json({ success: false, message: result?.message });


    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

const getSingleOrder = async (req, res) => {
    console.log("...........", req.params)
    try {
        const result = await orderService.getsingleOrder(req);
        console.log("Send to frontend", result)
        if (result.success) {
            res.status(200).json({ data: result.data, success: true });
        }
        else res.status(500).json({ success: false, message: result?.message });


    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}


const editSingleOrder = async (req, res) => {

    try {
        const { id } = req.params;
        const fields = req.body;
        const result = await orderService.editSingleOrder({ fields, id })

        if (result.success) {
            res.status(200).json({ message: result?.message, success: true });
        } else {
            res.status(500).json({ error: result?.message, success: false });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: true, error: error });
    }
}

const getbrandSearch = async (req, res) => {
    try {
        const searchText = req.query.text;
        if (!searchText) {
            return res.status(400).json({ sucesss: false, message: "The 'text' query parameter is required" });
        }

        const result = await brandService.getallBrand();


        if (result.success) {
            const findMatches = (brands, searchText) => {
                let matches = [];
                brands.forEach(brand => {
                    if (brand.name.toLowerCase().includes(searchText.toLowerCase())) {
                        matches.push({ ...brand });
                    }

                });
                return matches;
            };
            const matchingNames = findMatches(result.data, searchText);
            res.status(200).json({ data: matchingNames, success: true });
        }
    }
    catch (error) {
        res.status(500).json({ error: "An error occurred while processing your request" });
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
            res.status(400).json({ success: false, message: "Brand not found" });
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
    storeNew,
    getAllOrder,
    getMyOrder,
    getSingleOrder,
    editSingleOrder
};