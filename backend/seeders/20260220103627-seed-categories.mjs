"use strict";

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("Categories", [
      {
        category_name: "Health",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        category_name: "Vehicle",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        category_name: "Life",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Categories", null, {});
  }
};