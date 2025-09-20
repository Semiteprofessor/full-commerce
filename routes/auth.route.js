const express = require("express");
const authController = require("../controllers/auth.ctl");
const router = express.Router();

router.post("/auth/register", authController.registerUser);

router.post("/auth/login", authController.loginUser);

module.exports = router;
