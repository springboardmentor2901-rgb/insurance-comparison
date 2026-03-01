"use strict";

const data = require("../data/mockData");

module.exports = {
  async up(queryInterface) {

    const users = data.users.map(u => ({
      ...u,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    await queryInterface.bulkInsert("Users", users);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Users", null, {});
  }
};