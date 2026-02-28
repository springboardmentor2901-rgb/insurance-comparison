"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Companies", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      company_name: Sequelize.STRING,
      rating: Sequelize.FLOAT,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable("Companies");
  }
};