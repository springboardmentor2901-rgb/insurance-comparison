"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Claims", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      user_id: {
        type: Sequelize.INTEGER,
        references: { model: "Users", key: "id" }
      },
      policy_id: {
        type: Sequelize.INTEGER,
        references: { model: "Policies", key: "id" }
      },
      claim_amount: Sequelize.INTEGER,
      claim_status: { type: Sequelize.STRING, defaultValue: "Submitted" },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable("Claims");
  }
};