const express = require('express');
const ImageUploadController = require('../controllers/ImageController');
const router = express.Router();
const crypto = require("crypto")
const multer = require('multer');
const path = require("path")



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const randomString = crypto.randomBytes(16).toString('hex');
        // Extract the original file extension
        const fileExtension = path.extname(file.originalname);
        // Combine the random string with the original file extension
        cb(null, `${Date.now()}-${randomString}${fileExtension}`);
    },
});

const upload = multer({ storage });


router.post('/', upload.single('featured_image'), ImageUploadController.uploadImage);

module.exports = router