const transactionService = require("../services/transactionService")


const storeNew = async (req, res) => {
    try {
        const result = await transactionService.createNew(req);
        if (!result.success) {
            // If the service returns an error, send a 400 response with the message
            res.status(400).json({ message: result.message, success: false });
        } else {
            // If the service returns a success, send a 200 response with the data
            res.status(200).json({ message: result.message, success: true });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

const verify = async (req, res) => {
    try {
        const result = await transactionService.createNew(req);
        if (!result.success) {
            // If the service returns an error, send a 400 response with the message
            res.status(400).json({ message: result.message, success: false });
        } else {
            // If the service returns a success, send a 200 response with the data
            res.status(200).json({ message: result.message, success: true });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

const edit = async (req, res) => {
    try {
        const result = await transactionService.edit(req);
        if (!result.success) {
            // If the service returns an error, send a 400 response with the message
            res.status(400).json({ message: result.message, success: false });
        } else {
            // If the service returns a success, send a 200 response with the data
            res.status(200).json({ message: result.message, success: true });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

module.exports = {
    storeNew,
    verify,
    edit
}