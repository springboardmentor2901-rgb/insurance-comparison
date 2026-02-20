import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./User.js";
import Policy from "./policy.js";

const UserRequest = sequelize.define("UserRequest", {
  age: {
    type: DataTypes.INTEGER,
  },
  calculatedPremium: {
    type: DataTypes.INTEGER,
  },
});

User.hasMany(UserRequest);
UserRequest.belongsTo(User);

Policy.hasMany(UserRequest);
UserRequest.belongsTo(Policy);

export default UserRequest;
