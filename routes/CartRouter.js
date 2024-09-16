const express = require('express');
const CategoryController = require('../controllers/CategoryController');
const router = express.Router();
const upload = require("../utils/upload")
const auth = require("../middlewares/auth")
const CartController = require("../controllers/CartController")


router.post('/store', auth, CartController.storeNew);
router.delete("/delete/:id", auth, CartController.deleteCart)
router.get("/", auth, CartController.getCart)
router.post("/async",auth,CartController.asyncCart)

module.exports = router
