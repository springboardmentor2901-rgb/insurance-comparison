"use strict";

const data = require("..data/mockData");

module.exports = {
  async up(queryInterface) {

    const policies = data.policies.map(p => ({
      ...p,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    await queryInterface.bulkInsert("Policies", policies);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Policies", null, {});
  }
};