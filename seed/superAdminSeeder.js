import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import User from '../models/User.js';

dotenv.config();

const createSuperAdmin = async () => {
  try {
    await connectDB();

    // Check if superadmin already exists
    const existingSuperAdmin = await User.findOne({ role: 'superadmin' });
    
    if (existingSuperAdmin) {
      console.log('SuperAdmin already exists');
      process.exit(0);
    }

    // Create superadmin
    const superAdmin = await User.create({
      name: 'Super Admin',
      email: 'admin@gmail.com',
      password: 'admin@123',
      role: 'superadmin',
      phone: '+1234567890'
    });

    console.log('SuperAdmin created successfully:');
    console.log('Email: superadmin@soiltest.com');
    console.log('Password: superadmin123');
    console.log('Please change the password after first login');

    process.exit(0);
  } catch (error) {
    console.error('Error creating superadmin:', error);
    process.exit(1);
  }
};

createSuperAdmin();