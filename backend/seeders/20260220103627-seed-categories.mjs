"use strict";

const data = require("..data/mockdata");

module.exports = {
  async up(queryInterface) {

    const categories = data.categories.map(c => ({
      ...c,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    await queryInterface.bulkInsert("categories", categories);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("categories", null, {});
  }
};