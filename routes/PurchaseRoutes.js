const express = require('express');
const router = express.Router();
const auth = require("../middlewares/auth")
const PurchaseController = require("../controllers/PurchaseController")


router.post('/create', auth, PurchaseController.storeNew);
// router.delete("/delete/:id", auth, CartController.deleteCart)
// router.get("/", auth, CartController.getCart)
// router.post("/async", auth, CartController.asyncCart)

module.exports = router
