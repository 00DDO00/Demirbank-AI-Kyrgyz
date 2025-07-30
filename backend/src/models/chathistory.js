"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ChatHistory extends Model {
    static associate(models) {
      ChatHistory.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });
    }
  }
  ChatHistory.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      message: {
        type: DataTypes.TEXT,
      },
      response: {
        type: DataTypes.TEXT,
      },
      timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "ChatHistory",
    }
  );
  return ChatHistory;
};
