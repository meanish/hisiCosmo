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

module.exports = { getDiscountStatus }