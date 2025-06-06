const express = require('express');
const CategoryController = require('../controllers/CategoryController');
const router = express.Router();
const upload = require("../utils/upload")
const BrandController = require("../controllers/BrandController")



router.post('/create', upload.single('featured_image'), BrandController.createBrand);

router.put('/:id', upload.single('featured_image'), BrandController.editSingleBrand);

router.delete("/:id", BrandController.deleteSingleBrand)

router.get("/", BrandController.getAllBrand);
// router.post('/logout', authController.logout);

router.get("/search", CategoryController.getInputCat)
// router.post('/register', UserController.registerUser)

router.get("/:id", CategoryController.getSingleCat)

module.exports = router
