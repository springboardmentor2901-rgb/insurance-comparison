import { sequelize } from '../config/database.js';

async function addSegmentColumn() {
  try {
    await sequelize.query(`
      ALTER TABLE policies
      ADD COLUMN segment VARCHAR(255) NOT NULL DEFAULT 'General';
    `);

    console.log('✅ segment column added successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding segment column:', error.message);
    process.exit(1);
  }
}

addSegmentColumn();