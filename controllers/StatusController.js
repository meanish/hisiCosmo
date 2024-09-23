const getAllStatus = async (req, res) => {
    try {
        const result = [
            {
                "id": 1,
                "name": "enabled",
            },
            {
                "id": 2,
                "name": "disabled",
            }
        ];

        // If the service returns a success, send a 200 response with the data
        res.status(200).json({ data: result, success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
}

const getDiscountStatus = async (req, res) => {
    try {
        const result = [
            {
                "id": 1,
                "name": "Yes",
            },
            {
                "id": 0,
                "name": "No",
            }
        ];

        // If the service returns a success, send a 200 response with the data
        res.status(200).json({ data: result, success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
}



const getTransacStatus = async (req, res) => {
    try {

        const result = [
            {
                "id": 1,
                "name": "initiated",
            },
            {
                "id": 2,
                "name": "success",
            },
            {
                "id": 3,
                "name": "failed",
            },
            {
                "id": 4,
                "name": "pending",
            }
        ];

        // If the service returns a success, send a 200 response with the data
        res.status(200).json({ data: result, success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
}



const getOrderStatus = async (req, res) => {
    try {

        const result = [
            {
                "id": 1,
                "name": "pending",
            },
            {
                "id": 2,
                "name": "processing",
            },
            {
                "id": 3,
                "name": "completed",
            },
            {
                "id": 4,
                "name": "failed",
            },
            {
                "id": 5,
                "name": "cancelled",
            }

        ];

        // If the service returns a success, send a 200 response with the data
        res.status(200).json({ data: result, success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
}
const getPurchaseStatus = async (req, res) => {
    try {
        const result = [
            {
                "id": 1,
                "name": "pending",
            },
            {
                "id": 2,
                "name": "confirmed",
            },
            {
                "id": 3,
                "name": "delivered",
            },
            {
                "id": 4,
                "name": "cancelled",
            },

        ];

        // If the service returns a success, send a 200 response with the data
        res.status(200).json({ data: result, success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
}






const getPaymentStatus = async (req, res) => {
    try {
        const result = [
            {
                "id": 1,
                "name": "esewa",
            },
            {
                "id": 2,
                "name": "cod",
            },


        ];

        // If the service returns a success, send a 200 response with the data
        res.status(200).json({ data: result, success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
}


module.exports = { getAllStatus, getTransacStatus, getDiscountStatus, getOrderStatus, getPurchaseStatus, getPaymentStatus }