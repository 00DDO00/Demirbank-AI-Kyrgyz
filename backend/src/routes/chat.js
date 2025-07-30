const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");
const { authenticateToken } = require("../middlewares/auth");

// Send message to Gemini AI
router.post("/sendMessage", authenticateToken, chatController.sendMessage);

// Get chat history for authenticated user
router.get("/history", authenticateToken, chatController.getChatHistory);

module.exports = router;
