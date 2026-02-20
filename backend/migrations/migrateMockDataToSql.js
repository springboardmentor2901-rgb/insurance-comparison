import { connectDB } from '../config/database.js';
import Provider from '../models/Provider.js';
import Policy from '../models/Policy.js';

// IMPORTANT: import JS data, not JSON
import { policies } from '../data/mockData.js';

const migrate = async () => {
  await connectDB();

  /* 1️⃣ Create Providers based on policy types */
  const providerMap = {};

  for (const policy of policies) {
    if (!providerMap[policy.type]) {
      const provider = await Provider.create({
        name: `${policy.type} Insurance Provider`,
        type: policy.type,
        rating: policy.rating
      });

      providerMap[policy.type] = provider.id;
    }
  }

  /* 2️⃣ Create Policies */
  for (const policy of policies) {
    await Policy.create({
      name: policy.name,
      coverage_amount: policy.coverage,
      premium: policy.premium,
      term_years: policy.duration,
      provider_id: providerMap[policy.type]
    });
  }

  console.log('✅ mockData.js migrated successfully to SQL');
  process.exit(0);
};

migrate();