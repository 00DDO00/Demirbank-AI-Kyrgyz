require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { sequelize } = require("./src/models");

// Import routes
const authRoutes = require("./src/routes/auth");
const chatRoutes = require("./src/routes/chat");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Gemini Chatbot API is running" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Database connection and server start
async function startServer() {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log("Database connection established successfully.");

    // Sync database (create tables if they don't exist)
    await sequelize.sync({ alter: true });
    console.log("Database synchronized successfully.");

    // Start server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
      console.log(`API Documentation:`);
      console.log(`  POST /api/auth/register - Register new user`);
      console.log(`  POST /api/auth/login - Login user`);
      console.log(`  POST /api/chat/sendMessage - Send message to Gemini AI`);
      console.log(`  GET /api/chat/history - Get chat history`);
    });
  } catch (error) {
    console.error("Unable to start server:", error);
    process.exit(1);
  }
}

startServer();
