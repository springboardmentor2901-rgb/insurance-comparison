"use strict";

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("Policies", [
      {
        policy_name: "Health Secure",
        coverage_amount: 500000,
        premium: 8000,
        duration_years: 5,
        company_id: 1,
        category_id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        policy_name: "Life Shield",
        coverage_amount: 1000000,
        premium: 12000,
        duration_years: 10,
        company_id: 2,
        category_id: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        policy_name: "Vehicle Protect",
        coverage_amount: 300000,
        premium: 6000,
        duration_years: 3,
        company_id: 3,
        category_id: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Policies", null, {});
  }
};
