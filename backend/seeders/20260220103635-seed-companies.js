"use strict";

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("Companies", [
      {
        company_name: "LIC",
        rating: 4.5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        company_name: "HDFC Life",
        rating: 4.2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        company_name: "ICICI Prudential",
        rating: 4.3,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Companies", null, {});
  }
};