const express = require('express');
const CategoryController = require('../controllers/CategoryController');
const router = express.Router();
const upload = require("../utils/upload")




router.post('/', upload.single('featured_image'), CategoryController.newCategory);

router.put('/:id', CategoryController.editSingleCat);

router.delete("/:id", CategoryController.deleteSingleCategory)

router.get("/", CategoryController.getAllCat);
// router.post('/logout', authController.logout);

router.get("/search", CategoryController.getInputCat)
// router.post('/register', UserController.registerUser)

router.get("/:id", CategoryController.getSingleCat)

module.exports = router
