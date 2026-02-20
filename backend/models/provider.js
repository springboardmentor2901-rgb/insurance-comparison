import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Provider = sequelize.define("Provider", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  contactEmail: {
    type: DataTypes.STRING,
  },
  phone: {
    type: DataTypes.STRING,
  },
});

export default Provider;
