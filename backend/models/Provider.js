import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Provider = sequelize.define(
  'Provider',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false
    },

    type: {
      type: DataTypes.STRING,
      allowNull: false
    },

    rating: {
      type: DataTypes.FLOAT,
      allowNull: false
    },

    contact_email: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    tableName: 'providers',
    timestamps: true
  }
);

export default Provider;
