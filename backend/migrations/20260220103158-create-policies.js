"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Policies", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      policy_name: Sequelize.STRING,
      coverage_amount: Sequelize.INTEGER,
      premium: Sequelize.FLOAT,
      duration_years: Sequelize.INTEGER,
      company_id: {
        type: Sequelize.INTEGER,
        references: { model: "Companies", key: "id" },
        onDelete: "CASCADE"
      },
      category_id: {
        type: Sequelize.INTEGER,
        references: { model: "Categories", key: "id" },
        onDelete: "CASCADE"
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable("Policies");
  }
};