require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Issue = require('./models/Issue');
const Notification = require('./models/Notification');
const store = require('./data/store');
const { initialUsers, initialIssues, initialNotifications } = require('./seedData');

const seedData = async () => {
  console.log('--- CivicConnect Database Seeding ---');

  // ── Production safeguard ──────────────────────────────────────────────────
  // Running this script against a production Atlas database will DELETE all
  // existing data and replace it with demo records. Pass --force explicitly
  // to proceed. This is a destructive operation — do NOT run in production
  // without a backup.
  if (process.env.NODE_ENV === 'production' && !process.argv.includes('--force')) {
    console.error(
      '\n[ABORTED] seed.js refuses to run in production without --force.\n' +
      'This script calls deleteMany() on all collections, which will wipe\n' +
      'your production Atlas database. If you truly intend this, run:\n\n' +
      '  NODE_ENV=production node seed.js --force\n'
    );
    process.exit(1);
  }

  // Always seed local store
  store.resetToSeed();
  console.log('✓ Seeded Local JSON Data Store (server/data/db.json)');

  // Try seeding MongoDB if available
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/civicconnect';
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });
    console.log(`✓ Connected to MongoDB at ${uri}`);

    await User.deleteMany();
    await Issue.deleteMany();
    await Notification.deleteMany();

    await User.insertMany(initialUsers);
    await Issue.insertMany(initialIssues);
    await Notification.insertMany(initialNotifications);

    console.log('✓ Seeded MongoDB with:');
    console.log(`  - ${initialUsers.length} Users (1 Admin, ${initialUsers.length - 1} Citizens)`);
    console.log(`  - ${initialIssues.length} Civic Issues across categories & statuses`);
    console.log(`  - ${initialNotifications.length} Notifications`);

    await mongoose.disconnect();
  } catch (err) {
    console.log(`ℹ MongoDB not active (${err.message}). Local store was seeded and ready.`);
  }

  console.log('\nDemo Logins:');
  console.log('  Admin:   admin@civicconnect.gov / admin123');
  console.log('  Citizen: rajesh.kumar@example.com / citizen123');
  console.log('  Citizen: priya.sharma@example.com / citizen123');
  console.log('  Citizen: anand.v@example.com / citizen123');
  console.log('--------------------------------------\n');
  process.exit(0);
};

seedData();
