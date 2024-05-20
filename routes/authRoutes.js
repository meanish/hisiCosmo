const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const UserController = require("../controllers/UserController")




router.post('/login', UserController.loginUser);
router.post('/logout', authController.logout);


router.post('/register', UserController.registerUser)



module.exports = router
