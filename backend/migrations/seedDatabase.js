import { connectDB } from '../config/database.js';
import Provider from '../models/Provider.js';
import Policy from '../models/Policy.js';
import { providers, policies } from '../data/insuranceData.js';

const seed = async () => {
  try {
    await connectDB();

    // Recreate tables cleanly
    await Provider.sync({ force: true });
    await Policy.sync({ force: true });

    console.log('🧹 Tables dropped & recreated');

    // Insert providers
    await Provider.bulkCreate(providers);
    console.log('✅ Providers seeded');

    // Insert policies
    await Policy.bulkCreate(policies);
    console.log('✅ Policies seeded');

    console.log('🎉 Database seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seed();