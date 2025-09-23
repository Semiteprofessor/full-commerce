const express = require("express");
const productController = require("../controllers/product.ctl");
const router = express.Router();

router.post("/product/create", productController.registerUser);

module.exports = router;
