import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { Admin } from '../models/Admin.js';
import { ROLES } from '../constants/roles.js';

const seedSuperAdmin = async () => {
  try {
    await mongoose.connect(env.MONGODB_URI);

    const email = process.env.ADMIN_EMAIL || 'admin@scienceplatform.bd';
    const password = process.env.ADMIN_PASSWORD || 'Admin@123456';

    const existing = await Admin.findOne({ email });
    if (existing) {
      console.log(`ℹ️ Admin already exists with email: ${email}`);
      process.exit(0);
    }

    const admin = await Admin.create({
      name: 'Super Admin',
      email,
      password,
      role: ROLES.SUPER_ADMIN,
    });

    console.log('✅ Super Admin created successfully!');
    console.log(`📧 Email: ${admin.email}`);
    console.log(`🔑 Password: ${password}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating Super Admin:', error.message);
    process.exit(1);
  }
};

seedSuperAdmin();