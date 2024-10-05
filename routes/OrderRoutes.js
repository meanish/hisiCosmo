const express = require('express');
const router = express.Router();
const auth = require("../middlewares/auth")
const OrderController = require("../controllers/OrderController");
const adminAuth = require('../middlewares/adminauth');


router.post('/store', auth, OrderController.storeNew);
// router.delete("/delete/:id", auth, CartController.deleteCart)
router.get("/myorder", auth, OrderController.getMyOrder)
router.get("/all", adminAuth, OrderController.getAllOrder)
// router.post("/async", auth, CartController.asyncCart)
router.get("/single/:id", auth, OrderController.getSingleOrder)
router.post("/edit/:id", adminAuth, OrderController.editSingleOrder)



module.exports = router
