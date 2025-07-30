const { sequelize, User, ChatHistory } = require("./src/models");

async function createTables() {
  console.log("🗄️ Creating database tables...");

  try {
    // Sync all models to create tables
    await sequelize.sync({ force: true });

    console.log("✅ Database tables created successfully!");
    console.log("📋 Tables created:");
    console.log("   - Users");
    console.log("   - ChatHistories");
  } catch (error) {
    console.error("❌ Failed to create tables:", error.message);
  } finally {
    await sequelize.close();
  }
}

createTables();
