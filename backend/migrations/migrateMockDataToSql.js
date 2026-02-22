import { connectDB } from '../config/database.js';
import Provider from '../models/Provider.js';
import Policy from '../models/Policy.js';

import { providers, policies } from '../data/insuranceData.js';

const migrate = async () => {
  await connectDB();

  console.log('🧹 Clearing old policy data...');
  await Policy.destroy({ where: {} });

  console.log('🧹 Clearing old provider data...');
  await Provider.destroy({ where: {} });

  /* 1️⃣ Insert Providers */
  console.log('📦 Inserting providers...');
  for (const provider of providers) {
    await Provider.create({
      id: provider.id,
      name: provider.name,
      type: provider.type,
      rating: provider.rating ?? null,
      contact_email: provider.contact_email ?? null
    });
  }

  /* 2️⃣ Insert Policies */
  console.log('📦 Inserting policies...');
  for (const policy of policies) {
    await Policy.create({
      name: policy.name,
      segment: policy.segment,
      coverage_amount: policy.coverage_amount,
      premium: policy.premium,
      term_years: policy.term_years,
      provider_id: policy.provider_id
    });
  }

  console.log('✅ Providers & policies migrated successfully');
  process.exit(0);
};

migrate();