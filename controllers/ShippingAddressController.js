const shippingService = require("../services/shippingServices")

const storeNew = async (req, res) => {

    try {

        const result = await shippingService.storeNew(req);
        if (result.success) {
            res.status(200).json({ message: result.message, success: true });
        }
    } catch (error) {
        let errorMessage;
        console.log("What si the error message", error)
        try {
            errorMessage = JSON.parse(error.message);
        } catch (parseError) {
            errorMessage = error.message;
        }
        res.status(400).json({ errors: errorMessage, success: false });
    }
}

const create = async (req, res) => {
    try {
        res.status(200).json({ message: "Done", success: true });

    }
    catch {
        res.status(400).json({ errors: "Failed", success: false });

    }
}
const getData = async (req, res) => {

    try {
        const result = await shippingService.getData(req);
        if (result.success) {
            res.status(200).json({ data: result.data, success: true });
        }
    } catch (error) {
        res.status(400).json({ errors: error.message, success: false });
    }
}



module.exports = {
    storeNew,
    getData,
    create
};