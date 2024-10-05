const express = require('express');
const router = express.Router();
const auth = require("../middlewares/auth")
const CartController = require("../controllers/CartController")


router.post('/store', auth, CartController.storeNew);
router.delete("/delete/:id", auth, CartController.deleteCart)
router.get("/", auth, CartController.getCart)
router.post("/async/update", auth, CartController.asyncCart)
router.post("/async/remove", auth, CartController.removeItem)


module.exports = router
