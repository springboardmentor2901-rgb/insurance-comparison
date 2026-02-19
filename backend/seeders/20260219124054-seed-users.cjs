"use strict";
const fs = require("fs");
const path = require("path");

module.exports = {
  async up(queryInterface) {
    const users = JSON.parse(
      fs.readFileSync(path.join(__dirname, "../data/users.json"))
    );

    const formattedUsers = users.map((user) => ({
      ...user,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await queryInterface.bulkInsert("Users", formattedUsers);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
