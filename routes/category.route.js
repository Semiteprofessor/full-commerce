const express = require("express");
const categoryController = require("../controllers/category.ctl");
const router = express.Router();

const verifyToken = require("../config/jwt");

router.post("/category/create", verifyToken, categoryController.createCategory);

module.exports = router;
