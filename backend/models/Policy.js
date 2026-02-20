import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import Provider from './Provider.js';

const Policy = sequelize.define(
  'Policy',
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

    coverage_amount: {
      type: DataTypes.FLOAT,
      allowNull: false
    },

    premium: {
      type: DataTypes.FLOAT,
      allowNull: false
    },

    term_years: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    provider_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'providers',
        key: 'id'
      }
    }
  },
  {
    tableName: 'policies',
    timestamps: true
  }
);

/* Relationship */
Provider.hasMany(Policy, { foreignKey: 'provider_id' });
Policy.belongsTo(Provider, { foreignKey: 'provider_id' });

export default Policy;