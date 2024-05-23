const express = require('express');
const CategoryController = require('../controllers/CategoryController');
const router = express.Router();





router.post('/', CategoryController.newCategory);

router.get("/", CategoryController.getAllCat);
// router.post('/logout', authController.logout);

router.get("/search", CategoryController.getInputCat)
// router.post('/register', UserController.registerUser)



module.exports = router
