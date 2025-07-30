const bcrypt = require("bcryptjs");
const { User } = require("./src/models");

async function seedTestUser() {
  console.log("👤 Seeding test user...");

  try {
    // Check if test user already exists
    const existingUser = await User.findOne({
      where: { username: "testuser" },
    });

    if (existingUser) {
      console.log("✅ Test user already exists");
      return;
    }

    // Create test user
    const hashedPassword = await bcrypt.hash("password123", 10);

    const testUser = await User.create({
      username: "testuser",
      email: "test@example.com",
      password: hashedPassword,
      role: "User",
    });

    console.log("✅ Test user created successfully!");
    console.log("📧 Username: testuser");
    console.log("🔑 Password: password123");
    console.log("🆔 User ID:", testUser.id);
  } catch (error) {
    console.error("❌ Failed to seed test user:", error.message);
  }
}

seedTestUser();
