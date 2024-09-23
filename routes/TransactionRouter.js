const express = require('express');
const router = express.Router();
const auth = require("../middlewares/auth")
const TransactionController = require("../controllers/TransactionController")


router.post('/create', auth, TransactionController.storeNew);
router.post("/verify", TransactionController.verify)
// router.delete("/delete/:id", auth, CartController.deleteCart)
router.post("/edit/:id", auth, TransactionController.edit)
// router.post("/async", auth, CartController.asyncCart)

module.exports = router
