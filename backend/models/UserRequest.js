import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const UserRequest = sequelize.define(
  'UserRequest',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },

    requestType: {
      type: DataTypes.STRING,
      allowNull: false
    },

    details: {
      type: DataTypes.JSON,
      allowNull: true
    }
  },
  {
    tableName: 'user_requests',
    timestamps: true
  }
);

export default UserRequest;
