const express = require("express");
const productController = require("../controllers/product.ctl");
const router = express.Router();

const verifyToken = require("../config/jwt");

router.post(
  "/product/create",
  verifyToken,
  productController.createProductByAdmin
);

module.exports = router;
