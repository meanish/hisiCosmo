const express = require('express');
const CategoryController = require('../controllers/CategoryController');
const router = express.Router();
const upload = require("../utils/upload")
const auth = require("../middlewares/auth")
const ShippingController = require("../controllers/ShippingAddressController")


router.post('/store', auth, ShippingController.storeNew);
router.post("/create",auth,ShippingController.create)
// router.delete("/delete/:id", auth, CartController.deleteCart)
router.get("/user", auth, ShippingController.getData)
// router.post("/async", auth, CartController.asyncCart)

module.exports = router
