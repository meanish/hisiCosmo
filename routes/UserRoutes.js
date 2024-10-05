const express = require('express');
const router = express.Router();
const auth = require("../middlewares/auth")
const UserController = require("../controllers/UserController");
const upload = require('../utils/upload');


router.post('/update', auth, upload.single('featured_image'), UserController.updateUser);

// router.delete("/delete/:id", auth, CartController.deleteCart)
router.get("/mydata", auth, UserController.getData)
// router.post("/async", auth, CartController.asyncCart)

module.exports = router
