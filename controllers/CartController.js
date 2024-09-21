const cartService = require("../services/cartServices")

const storeNew = async (req, res) => {

    try {
        const result = await cartService.storeNew(req);

        console.log("result", result)
        if (!result.success) {   
            res.status(400).json({ success: false, message: result?.message });
        } else {
          
            res.status(200).json({ message: "Added to cart success", success: true });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

const getCart = async (req, res) => {
    try {
        const result = await cartService.getAll(req);
        if (!result.success) {
            res.status(400).json({ success: false, error: result.message });
        } else {
            res.status(200).json({ data: result?.data, success: true });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}


const asyncCart = async (req, res) => {
    try {
        const result = await cartService.asyncAll(req);

        if (!result.success) {
            res.status(400).json({ success: false, error: result.message || "Failed to update" });
        } else {
            // If the service returns a success, send a 200 response with the data
            res.status(200).json({ message: result.message, success: true });
        }
    } catch (error) {
        console.error("Error in asyncCart:", error.message);  // Improved logging for better debugging
        res.status(500).json({ success: false, error: error.message });
    }
}


const deleteCart = async (req, res) => {
    try {
        const result = await cartService.remove(req);
        if (!result.success) {
            // If the service returns an error, send a 400 response with the message
            res.status(400).json({ success: false, error: result.message });
        } else {
            // If the service returns a success, send a 200 response with the data
            res.status(200).json({ message: "Removed from cart success", success: true });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}




module.exports = {
    storeNew,
    deleteCart,
    getCart,
    asyncCart
};