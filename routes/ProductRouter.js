const express = require('express');
const ProductController = require('../controllers/ProductController');
const router = express.Router();





router.post('/', ProductController.newProduct);

// router.get("/", ProductController.getAllCat);
// router.post('/logout', authController.logout);


// router.post('/register', UserController.registerUser)



module.exports = router
