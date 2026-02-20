"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Quotes", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      user_id: {
        type: Sequelize.INTEGER,
        references: { model: "Users", key: "id" }
      },
      category_id: {
        type: Sequelize.INTEGER,
        references: { model: "Categories", key: "id" }
      },
      amount_requested: Sequelize.INTEGER,
      status: { type: Sequelize.STRING, defaultValue: "Pending" },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable("Quotes");
  }
};