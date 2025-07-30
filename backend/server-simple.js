require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const geminiService = require("./src/services/geminiService");

const app = express();
const PORT = process.env.PORT || 3000;

// In-memory storage for testing
const users = [
  {
    id: 1,
    username: "testuser",
    email: "test@example.com",
    password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // 'password'
    role: "User",
  },
];

const chatHistory = [];

// Enhanced logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`🔍 [${timestamp}] ${req.method} ${req.url}`);
  console.log(`📋 Headers:`, JSON.stringify(req.headers, null, 2));
  console.log(`📦 Body:`, JSON.stringify(req.body, null, 2));
  console.log(`🔗 Query:`, JSON.stringify(req.query, null, 2));
  console.log(`📍 IP: ${req.ip}`);
  console.log(`👤 User-Agent: ${req.get("User-Agent")}`);
  console.log("─".repeat(80));

  // Log response
  const originalSend = res.send;
  res.send = function (data) {
    console.log(`📤 Response Status: ${res.statusCode}`);
    console.log(`📤 Response Body:`, JSON.stringify(data, null, 2));
    console.log("─".repeat(80));
    originalSend.call(this, data);
  };

  next();
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// JWT Secret
const JWT_SECRET = "your_jwt_secret_key_here_for_testing";

// Authentication middleware with enhanced logging
const authenticateToken = (req, res, next) => {
  console.log(`🔐 [AUTH] Starting authentication for ${req.method} ${req.url}`);

  try {
    const authHeader = req.headers["authorization"];
    console.log(`🔐 [AUTH] Authorization header:`, authHeader);

    const token = authHeader && authHeader.split(" ")[1];
    console.log(
      `🔐 [AUTH] Extracted token:`,
      token ? `${token.substring(0, 20)}...` : "null"
    );

    if (!token) {
      console.log(`❌ [AUTH] No token provided`);
      return res.status(401).json({ error: "Access token required" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    console.log(`🔐 [AUTH] Decoded token:`, decoded);

    const user = users.find((u) => u.id === decoded.userId);
    console.log(`🔐 [AUTH] Found user:`, user ? user.username : "null");

    if (!user) {
      console.log(`❌ [AUTH] Invalid token - user not found`);
      return res.status(401).json({ error: "Invalid token" });
    }

    req.user = user;
    console.log(
      `✅ [AUTH] Authentication successful for user: ${user.username}`
    );
    next();
  } catch (error) {
    console.error(`❌ [AUTH] Auth middleware error:`, error);
    return res.status(403).json({ error: "Invalid token" });
  }
};

// Health check endpoint
app.get("/health", (req, res) => {
  console.log(`🏥 [HEALTH] Health check requested`);
  res.json({ status: "OK", message: "Gemini Chatbot API is running" });
});

// Root endpoint for debugging
app.get("/", (req, res) => {
  console.log(`🏠 [ROOT] Root endpoint accessed`);
  res.json({
    message: "Gemini Chatbot API",
    version: "1.0.0",
    endpoints: [
      "GET /health",
      "POST /api/auth/login",
      "POST /api/auth/register",
      "POST /api/chat/sendMessage",
      "GET /api/chat/history",
    ],
  });
});

// Auth routes with enhanced logging
app.post("/api/auth/login", async (req, res) => {
  console.log(`🔑 [LOGIN] Login attempt started`);
  console.log(`🔑 [LOGIN] Request body:`, req.body);

  try {
    const { username, password } = req.body;
    console.log(`🔑 [LOGIN] Username: ${username}`);

    const user = users.find((u) => u.username === username);
    console.log(`🔑 [LOGIN] User found:`, user ? "yes" : "no");

    if (!user) {
      console.log(`❌ [LOGIN] Invalid credentials - user not found`);
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log(`🔑 [LOGIN] Password valid:`, isValidPassword);

    if (!isValidPassword) {
      console.log(`❌ [LOGIN] Invalid credentials - wrong password`);
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: "24h" }
    );
    console.log(`🔑 [LOGIN] Token generated successfully`);

    const response = {
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    };

    console.log(`✅ [LOGIN] Login successful for user: ${username}`);
    res.json(response);
  } catch (error) {
    console.error(`❌ [LOGIN] Login error:`, error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/auth/register", async (req, res) => {
  console.log(`📝 [REGISTER] Registration attempt started`);
  console.log(`📝 [REGISTER] Request body:`, req.body);

  try {
    const { username, email, password } = req.body;
    console.log(`📝 [REGISTER] Username: ${username}, Email: ${email}`);

    const existingUser = users.find(
      (u) => u.username === username || u.email === email
    );
    console.log(
      `📝 [REGISTER] Existing user found:`,
      existingUser ? "yes" : "no"
    );

    if (existingUser) {
      console.log(`❌ [REGISTER] Username or email already exists`);
      return res
        .status(400)
        .json({ error: "Username or email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(`📝 [REGISTER] Password hashed successfully`);

    const newUser = {
      id: users.length + 1,
      username,
      email,
      password: hashedPassword,
      role: "User",
    };

    users.push(newUser);
    console.log(`📝 [REGISTER] User added to storage`);

    const token = jwt.sign(
      { userId: newUser.id, username: newUser.username },
      JWT_SECRET,
      { expiresIn: "24h" }
    );
    console.log(`📝 [REGISTER] Token generated successfully`);

    const response = {
      message: "User registered successfully",
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    };

    console.log(`✅ [REGISTER] Registration successful for user: ${username}`);
    res.status(201).json(response);
  } catch (error) {
    console.error(`❌ [REGISTER] Register error:`, error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Chat routes with enhanced logging
app.post("/api/chat/sendMessage", authenticateToken, async (req, res) => {
  console.log(`💬 [CHAT] Send message attempt started`);
  console.log(`💬 [CHAT] Request body:`, req.body);
  console.log(`💬 [CHAT] User:`, req.user.username);

  try {
    const { message } = req.body;
    const userId = req.user.id;
    console.log(`💬 [CHAT] Message: "${message}"`);
    console.log(`💬 [CHAT] User ID: ${userId}`);

    if (!message || message.trim() === "") {
      console.log(`❌ [CHAT] Empty message received`);
      return res.status(400).json({ error: "Message is required" });
    }

    console.log(`🤖 [CHAT] Calling Gemini AI service...`);
    // Generate response using Gemini AI
    const aiResponse = await geminiService.generateResponse(message);
    console.log(
      `🤖 [CHAT] AI Response received:`,
      aiResponse.substring(0, 100) + "..."
    );

    // Save to in-memory storage
    const chatEntry = {
      id: chatHistory.length + 1,
      user_id: userId,
      message: message.trim(),
      response: aiResponse,
      timestamp: new Date(),
    };

    chatHistory.push(chatEntry);
    console.log(
      `💾 [CHAT] Message saved to history. Total messages: ${chatHistory.length}`
    );

    const response = {
      success: true,
      data: {
        id: chatEntry.id,
        message: chatEntry.message,
        response: chatEntry.response,
        timestamp: chatEntry.timestamp,
      },
    };

    console.log(`✅ [CHAT] Message processed successfully`);
    res.json(response);
  } catch (error) {
    console.error(`❌ [CHAT] Chat error:`, error);
    res.status(500).json({
      error: "Failed to process message",
      details: error.message,
    });
  }
});

app.get("/api/chat/history", authenticateToken, (req, res) => {
  console.log(`📚 [HISTORY] Get chat history attempt started`);
  console.log(`📚 [HISTORY] User:`, req.user.username);
  console.log(`📚 [HISTORY] Query params:`, req.query);

  try {
    const userId = req.user.id;
    const { page = 1, limit = 20 } = req.query;
    console.log(
      `📚 [HISTORY] User ID: ${userId}, Page: ${page}, Limit: ${limit}`
    );

    const userChats = chatHistory.filter((chat) => chat.user_id === userId);
    console.log(`📚 [HISTORY] Total chats for user: ${userChats.length}`);

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedChats = userChats.slice(startIndex, endIndex);
    console.log(`📚 [HISTORY] Paginated chats: ${paginatedChats.length}`);

    const response = {
      success: true,
      data: {
        messages: paginatedChats,
        total: userChats.length,
        page: parseInt(page),
        totalPages: Math.ceil(userChats.length / limit),
      },
    };

    console.log(`✅ [HISTORY] Chat history retrieved successfully`);
    res.json(response);
  } catch (error) {
    console.error(`❌ [HISTORY] Get chat history error:`, error);
    res.status(500).json({ error: "Failed to fetch chat history" });
  }
});

// Enhanced 404 handler with detailed logging
app.use("*", (req, res) => {
  console.log(`❌ [404] Route not found: ${req.method} ${req.originalUrl}`);
  console.log(`❌ [404] Available routes:`);
  console.log(`   - GET /health`);
  console.log(`   - GET /`);
  console.log(`   - POST /api/auth/login`);
  console.log(`   - POST /api/auth/register`);
  console.log(`   - POST /api/chat/sendMessage`);
  console.log(`   - GET /api/chat/history`);
  console.log(`❌ [404] Headers:`, JSON.stringify(req.headers, null, 2));
  console.log(`❌ [404] Body:`, JSON.stringify(req.body, null, 2));

  res.status(404).json({
    error: "Route not found",
    requestedUrl: req.originalUrl,
    method: req.method,
    availableRoutes: [
      "GET /health",
      "GET /",
      "POST /api/auth/login",
      "POST /api/auth/register",
      "POST /api/chat/sendMessage",
      "GET /api/chat/history",
    ],
  });
});

// Error handling middleware with enhanced logging
app.use((err, req, res, next) => {
  console.error(`💥 [ERROR] Unhandled error:`, err);
  console.error(`💥 [ERROR] Stack trace:`, err.stack);
  console.error(`💥 [ERROR] Request URL: ${req.method} ${req.url}`);
  console.error(`💥 [ERROR] Request body:`, req.body);
  console.error(`💥 [ERROR] Request headers:`, req.headers);

  res.status(500).json({
    error: "Something went wrong!",
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

// Start server with enhanced logging
app.listen(PORT, () => {
  console.log("🚀".repeat(20));
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🏠 Root endpoint: http://localhost:${PORT}/`);
  console.log(`🔐 Test credentials:`);
  console.log(`   Username: testuser`);
  console.log(`   Password: password`);
  console.log(`📚 Available API Endpoints:`);
  console.log(`   GET  /health`);
  console.log(`   GET  /`);
  console.log(`   POST /api/auth/register - Register new user`);
  console.log(`   POST /api/auth/login - Login user`);
  console.log(`   POST /api/chat/sendMessage - Send message to Gemini AI`);
  console.log(`   GET  /api/chat/history - Get chat history`);
  console.log("🚀".repeat(20));
  console.log(`🔍 Debug mode: ON - All requests will be logged`);
  console.log("─".repeat(80));
});
