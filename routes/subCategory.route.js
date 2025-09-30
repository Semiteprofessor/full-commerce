const express = require("express");
const subCategoryController = require("../controllers/subCategory.ctl");
const router = express.Router();

const verifyToken = require("../config/jwt");

router.post(
  "/sub-category/create",
  verifyToken,
  subCategoryController.createSubCategory
);

router.post(
  "/sub-category/get-all",
  verifyToken,
  subCategoryController.getAllSubCategories
);

module.exports = router;
