"use strict";

const data = require("..data/mockData");

module.exports = {
  async up(queryInterface) {

    const companies = data.companies.map(c => ({
      ...c,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    await queryInterface.bulkInsert("Companies", companies);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Companies", null, {});
  }
};