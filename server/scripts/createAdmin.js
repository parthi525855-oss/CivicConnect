const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const store = require('../data/store');

const createAdminAccount = async () => {
  console.log('\n=== CivicConnect Admin Account Setup ===');

  const adminName = (process.env.ADMIN_NAME || 'Municipal Administrator').trim();
  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@civicconnect.gov').toLowerCase().trim();
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

  if (!adminEmail || !adminPassword) {
    console.error('❌ Error: ADMIN_EMAIL and ADMIN_PASSWORD must be configured.');
    process.exit(1);
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(adminPassword, salt);

  // 1. Check & update in Local JSON Store
  let localAdmin = store.users.find(
    (u) => u.email.toLowerCase() === adminEmail
  );

  if (localAdmin) {
    if (localAdmin.role === 'admin') {
      console.log(`ℹ Local store: Admin account already exists for "${adminEmail}". No duplicate created.`);
    } else {
      localAdmin.role = 'admin';
      localAdmin.password = hashedPassword;
      store.save();
      console.log(`✓ Local store: Promoted existing user "${adminEmail}" to admin role.`);
    }
  } else {
    const newAdmin = {
      _id: '661' + Date.now().toString(16).padStart(21, '0').slice(-21),
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
      phone: '+91 98765 00000',
      address: 'Municipal Corporation Head Office, Chennai',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    store.users.push(newAdmin);
    store.save();
    console.log(`✓ Local store: Successfully created admin account for "${adminEmail}".`);
  }

  // 2. Check & update in MongoDB (if reachable)
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/civicconnect';
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });
    const User = require('../models/User');

    const existingMongo = await User.findOne({ email: adminEmail });
    if (existingMongo) {
      if (existingMongo.role === 'admin') {
        console.log(`ℹ MongoDB: Admin account already exists for "${adminEmail}".`);
      } else {
        existingMongo.role = 'admin';
        existingMongo.password = hashedPassword;
        await existingMongo.save();
        console.log(`✓ MongoDB: Promoted existing user "${adminEmail}" to admin role.`);
      }
    } else {
      await User.create({
        name: adminName,
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        phone: '+91 98765 00000',
        address: 'Municipal Corporation Head Office, Chennai'
      });
      console.log(`✓ MongoDB: Successfully created admin account for "${adminEmail}".`);
    }
    await mongoose.disconnect();
  } catch (err) {
    console.log(`ℹ MongoDB not connected (${err.message}). Local store is primed.`);
  }

  console.log('\n=============================================');
  console.log('✓ Admin account is ready.');
  console.log(`  Email:    ${adminEmail}`);
  console.log(`  Role:     admin`);
  console.log('=============================================\n');
  process.exit(0);
};

createAdminAccount().catch((err) => {
  console.error('Fatal error setting up admin:', err);
  process.exit(1);
});
