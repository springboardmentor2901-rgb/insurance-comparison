import { connectDB } from '../config/database.js';
import Provider from '../models/Provider.js';
import Policy from '../models/Policy.js';

const verify = async () => {
  try {
    await connectDB();

    const providers = await Provider.findAll({ raw: true });
    const policies = await Policy.findAll({ raw: true });

    console.log('\n📦 PROVIDERS TABLE');
    console.table(providers);

    console.log('\n📄 POLICIES TABLE');
    console.table(policies);

    process.exit(0);
  } catch (error) {
    console.error('❌ Verification failed:', error);
    process.exit(1);
  }
};

verify();