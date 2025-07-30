const { ChatHistory, User } = require("../models");
const geminiService = require("../services/geminiService");

class ChatController {
  async sendMessage(req, res) {
    try {
      const { message } = req.body;
      const userId = req.user.id;

      if (!message || message.trim() === "") {
        return res.status(400).json({ error: "Message is required" });
      }

      // Generate response using Gemini AI
      const aiResponse = await geminiService.generateResponse(message);

      // Save chat history
      const chatHistory = await ChatHistory.create({
        user_id: userId,
        message: message.trim(),
        response: aiResponse,
        timestamp: new Date(),
      });

      res.json({
        success: true,
        data: {
          id: chatHistory.id,
          message: chatHistory.message,
          response: chatHistory.response,
          timestamp: chatHistory.timestamp,
        },
      });
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({
        error: "Failed to process message",
        details: error.message,
      });
    }
  }

  async getChatHistory(req, res) {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 20 } = req.query;

      const offset = (page - 1) * limit;

      const chatHistory = await ChatHistory.findAndCountAll({
        where: { user_id: userId },
        order: [["timestamp", "DESC"]],
        limit: parseInt(limit),
        offset: parseInt(offset),
      });

      res.json({
        success: true,
        data: {
          messages: chatHistory.rows,
          total: chatHistory.count,
          page: parseInt(page),
          totalPages: Math.ceil(chatHistory.count / limit),
        },
      });
    } catch (error) {
      console.error("Get chat history error:", error);
      res.status(500).json({ error: "Failed to fetch chat history" });
    }
  }
}

module.exports = new ChatController();
