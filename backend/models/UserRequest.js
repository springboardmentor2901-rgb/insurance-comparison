import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import User from './User.js';
import Policy from './Policy.js';

const UserRequest = sequelize.define(
  'UserRequest',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },

    request_type: {
      type: DataTypes.STRING,
      allowNull: false
    },

    age: {
      type: DataTypes.INTEGER,
      allowNull: true
    },

    income: {
      type: DataTypes.FLOAT,
      allowNull: true
    },

    coverage_needed: {
      type: DataTypes.FLOAT,
      allowNull: true
    },

    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      }
    },

    policy_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'policies',
        key: 'id'
      }
    }
  },
  {
    tableName: 'user_requests',
    timestamps: true
  }
);

/* Relationships */
User.hasMany(UserRequest, { foreignKey: 'user_id' });
UserRequest.belongsTo(User, { foreignKey: 'user_id' });

Policy.hasMany(UserRequest, { foreignKey: 'policy_id' });
UserRequest.belongsTo(Policy, { foreignKey: 'policy_id' });

export default UserRequest;