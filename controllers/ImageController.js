
const uploadImage = async (req, res) => {
    try {
        const filePath = req.file.path;
        res.status(200).send({
            status: 'success',
            filePath,
        });
    } catch (err) {
        res.status(400).send({
            status: 'fail',
            message: err.message,
        });
    }
}






module.exports = {
    uploadImage
};