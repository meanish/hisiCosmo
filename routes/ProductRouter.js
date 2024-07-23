const express = require('express');
const ProductController = require('../controllers/ProductController');
const upload = require('../utils/upload');
const router = express.Router();


router.post('/create', upload.fields([
    { name: 'featured_image', maxCount: 1 },
    { name: 'product_gallery', maxCount: 10 }
]), ProductController.createnewProduct);

router.get("/", ProductController.getAllProduct);

router.get("/:id", ProductController.getSingleProduct)

router.put("/edit/:id", upload.fields([
    { name: 'featured_image', maxCount: 1 },
    { name: 'product_gallery', maxCount: 10 }
]), ProductController.editSingleProduct)



// router.post('/logout', authController.logout);
// router.post('/register', UserController.registerUser)

module.exports = router
