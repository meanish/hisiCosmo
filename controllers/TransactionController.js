const transactionService = require("../services/transactionService")


const storeNew = async (req, res) => {
    try {
        const result = await transactionService.createNew(req);
        if (!result.success) {
            res.status(400).json({ message: result.message, success: false });
        } else {
            res.status(200).json({ message: result.message, success: true });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

const verify = async (req, res) => {
    try {
        const result = await transactionService.verify(req);
        if (!result.success) {
            res.status(400).json({ message: result.message, success: false });
        } else {
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
            res.status(400).json({ message: result.message, success: false });
        } else {
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