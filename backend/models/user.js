const { DataTypes } = require("sequelize");
const sequelize = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define("User", {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
  });
};
