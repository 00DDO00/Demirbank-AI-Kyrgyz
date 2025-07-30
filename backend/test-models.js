const db = require("./src/models");

console.log("Testing models...");
console.log("Available models:", Object.keys(db));

// Test User model
if (db.User) {
  console.log("✅ User model found");
} else {
  console.log("❌ User model not found");
}

// Test ChatHistory model
if (db.ChatHistory) {
  console.log("✅ ChatHistory model found");
} else {
  console.log("❌ ChatHistory model not found");
}
