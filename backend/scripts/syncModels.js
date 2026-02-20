import { connectDB } from '../config/database.js';
import User from '../models/User.js';
import Provider from '../models/Provider.js';
import Policy from '../models/Policy.js';
import UserRequest from '../models/UserRequest.js';
const syncModels = async () => {
  await connectDB();

  await User.sync();
  await Provider.sync();
  await Policy.sync();
  await UserRequest.sync();

  console.log('✅ User & Provider tables synced');
  process.exit(0);
};

syncModels();