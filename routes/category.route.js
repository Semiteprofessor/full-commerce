const express = require("express");
const categoryController = require("../controllers/category.ctl");
const router = express.Router();

const verifyToken = require("../config/jwt");

router.post("/category/create", verifyToken, categoryController.createCategory);

router.get("/category/get-all", categoryController.getAllCategories);

module.exports = router;
