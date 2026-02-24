"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Claims", "claim_document_url", {
      type: Sequelize.STRING
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("Claims", "claim_document_url");
  }
};