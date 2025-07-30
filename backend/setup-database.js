const { Sequelize } = require("sequelize");
const config = require("./config/database");

async function setupDatabase() {
  console.log("🗄️ Setting up PostgreSQL database...");

  try {
    // Create database connection
    const sequelize = new Sequelize(config.development);

    // Test connection
    await sequelize.authenticate();
    console.log("✅ Database connection established successfully.");

    // Sync models (create tables)
    await sequelize.sync({ force: false }); // Set force: true to recreate tables
    console.log("✅ Database tables created successfully.");

    // Close connection
    await sequelize.close();
    console.log("✅ Database setup completed!");
  } catch (error) {
    console.error("❌ Database setup failed:", error.message);
    console.log("\n📋 Please ensure:");
    console.log("1. PostgreSQL is installed and running");
    console.log("2. Database credentials are correct in config/database.js");
    console.log('3. Database "gemini_chatbot_dev" exists (or create it)');
    console.log("\n💡 To create database manually:");
    console.log("   psql -U postgres");
    console.log("   CREATE DATABASE gemini_chatbot_dev;");
  }
}

setupDatabase();
