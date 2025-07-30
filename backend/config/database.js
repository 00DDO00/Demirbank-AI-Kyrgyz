require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "Jhgfdsa12345!",
    database: process.env.DB_NAME || "gemini_chatbot_dev",
    host: process.env.DB_HOST || "127.0.0.1",
    port: process.env.DB_PORT || 4001,
    dialect: "postgres",
    logging: false,
  },
  test: {
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "Jhgfdsa12345!",
    database: process.env.DB_NAME || "gemini_chatbot_test",
    host: process.env.DB_HOST || "127.0.0.1",
    port: process.env.DB_PORT || 4001,
    dialect: "postgres",
    logging: false,
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    logging: false,
  },
};
