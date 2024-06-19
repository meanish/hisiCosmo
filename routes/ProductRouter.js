const express = require('express');
const ProductController = require('../controllers/ProductController');
const upload = require('../utils/upload');
const router = express.Router();





router.post('/create', upload.single('featured_image'), ProductController.createnewProduct);

router.get("/", ProductController.getAllProduct);


// router.post('/logout', authController.logout);


// router.post('/register', UserController.registerUser)



module.exports = router
