import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Provider from "./provider.js";

const Policy = sequelize.define("Policy", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  sector: {
    type: DataTypes.STRING,
  },
  coverage: {
    type: DataTypes.INTEGER,
  },
  basePremium: {
    type: DataTypes.INTEGER,
  },
});

Provider.hasMany(Policy);
Policy.belongsTo(Provider);

export default Policy;
