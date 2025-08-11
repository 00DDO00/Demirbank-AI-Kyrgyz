const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { authenticateToken } = require("../middlewares/auth");

// Register new user
router.post("/register", authController.register);

// Login user
router.post("/login", authController.login);

// Logout user (requires authentication)
router.post("/logout", authenticateToken, authController.logout);

// Get current user info (requires authentication)
router.get("/me", authenticateToken, authController.getCurrentUser);

module.exports = router;
