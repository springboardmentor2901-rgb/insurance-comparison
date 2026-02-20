"use strict";
const fs = require("fs");
const path = require("path");

module.exports = {
  async up(queryInterface) {

    const data = JSON.parse(
      fs.readFileSync(
        path.join(__dirname, "../data/users.json"),
        "utf-8"
      )
    );

    const formattedData = data.map(item => ({
      ...item,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    await queryInterface.bulkInsert("Users", formattedData);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Users", null, {});
  }
};