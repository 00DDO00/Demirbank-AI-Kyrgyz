const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User, sequelize } = require("../models");

class AuthController {
  async register(req, res) {
    const transaction = await sequelize.transaction();

    try {
      const { username, email, password } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({
        where: {
          [require("sequelize").Op.or]: [{ username }, { email }],
        },
        transaction,
      });

      if (existingUser) {
        await transaction.rollback();
        return res
          .status(400)
          .json({ error: "Username or email already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = await User.create(
        {
          username,
          email,
          password: hashedPassword,
          role: "User",
        },
        { transaction }
      );

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, username: user.username },
        process.env.JWT_SECRET || "your_jwt_secret_key_here",
        { expiresIn: process.env.JWT_EXPIRES_IN || "24h" }
      );

      // Commit the transaction
      await transaction.commit();

      res.status(201).json({
        message: "User registered successfully",
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      // Rollback transaction on error
      await transaction.rollback();
      console.error("Register error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async login(req, res) {
    try {
      const { username, password } = req.body;

      // Find user
      const user = await User.findOne({
        where: { username },
      });

      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Check password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, username: user.username },
        process.env.JWT_SECRET || "your_jwt_secret_key_here",
        { expiresIn: process.env.JWT_EXPIRES_IN || "24h" }
      );

      res.json({
        message: "Login successful",
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

module.exports = new AuthController();
