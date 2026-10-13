
const mongoose = require('mongoose');
const {
  initialUsers,
  initialIssues,
  initialNotifications
} = require('../seedData');

let isMongoConnected = false;

/**
 * Attempt a single mongoose connection with the given URI.
 */
const _tryConnect = async (uri) => {
  return await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
};

/**
 * Auto-seed: if the Users collection is empty after first connect, insert
 * the initial dataset. Only runs in development unless the DB is brand-new.
 *
 * WARNING: On a brand-new production Atlas cluster this WILL seed demo
 * accounts (including an admin). Run `npm run create-admin` afterwards to
 * reset admin credentials. Disable this block if you are migrating real data.
 */
const _autoSeed = async () => {
  try {
    const User = require('../models/User');
    const Issue = require('../models/Issue');
    const Notification = require('../models/Notification');

    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('Seeding initial MongoDB dataset...');
      await User.insertMany(initialUsers);
      await Issue.insertMany(initialIssues);
      await Notification.insertMany(initialNotifications);
      console.log('Initial dataset seeded successfully.');
    }
  } catch (seedErr) {
    console.warn('Auto-seed check notice:', seedErr.message);
  }
};

/**
 * Connect to MongoDB.
 *
 * Connection strategy:
 *  1. Try MONGO_URI (mongodb+srv://…). Requires DNS SRV support.
 *     Some ISP/router DNS servers (e.g. home gateways) refuse SRV queries,
 *     causing Node.js c-ares to raise "querySrv ECONNREFUSED".
 *  2. If MONGO_URI fails AND MONGO_URI_DIRECT is set, retry immediately with
 *     the direct (non-SRV) connection string. This bypasses SRV DNS entirely.
 *  3. If all attempts fail in production (NODE_ENV=production), the process
 *     exits with code 1 to prevent silent data loss via the JSON fallback.
 *  4. If all attempts fail in development, a JSON fallback (db.json) is used
 *     with a loud warning.
 *
 * @param {Function} [onReady] - Called once the DB is confirmed ready (or
 *   JSON fallback is active in dev). Use this to defer app.listen() in
 *   production so no requests are accepted before the DB is connected.
 */
const connectDB = async (onReady) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const srvUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/civicconnect';
  const directUri = process.env.MONGO_URI_DIRECT || null;

  // ── Attempt 1: SRV URI ────────────────────────────────────────────────────
  try {
    const conn = await _tryConnect(srvUri);
    isMongoConnected = true;
    console.log(`MongoDB Connected (SRV): ${conn.connection.host}`);
    await _autoSeed();
    if (onReady) onReady();
    return;
  } catch (srvError) {
    console.error('\nMongoDB SRV connection failed.');
    console.error('Error name:', srvError.name);
    console.error('Error message:', srvError.message);

    if (srvError.message && srvError.message.includes('querySrv')) {
      console.warn(
        'Hint: Your DNS resolver does not support SRV queries.\n' +
        'Set MONGO_URI_DIRECT in your .env with explicit shard hostnames.\n' +
        'See server/.env.example for the format.'
      );
    }
  }

  // ── Attempt 2: Direct (non-SRV) URI ──────────────────────────────────────
  if (directUri) {
    try {
      const conn = await _tryConnect(directUri);
      isMongoConnected = true;
      console.log(`MongoDB Connected (direct): ${conn.connection.host}`);
      await _autoSeed();
      if (onReady) onReady();
      return;
    } catch (directError) {
      console.error('\nMongoDB direct connection also failed.');
      console.error('Error name:', directError.name);
      console.error('Error message:', directError.message);
    }
  } else if (srvUri.startsWith('mongodb+srv')) {
    console.warn(
      'MONGO_URI_DIRECT is not set. If your DNS refuses SRV queries,\n' +
      'add MONGO_URI_DIRECT to your .env. See server/.env.example.'
    );
  }

  // ── All DB attempts failed ────────────────────────────────────────────────
  isMongoConnected = false;

  if (isProduction) {
    console.error(
      '\n[FATAL] All MongoDB connection attempts failed in production.\n' +
      'The server will not start to prevent silent data loss via JSON fallback.\n' +
      'Fix MONGO_URI / MONGO_URI_DIRECT and verify your Atlas IP allowlist.'
    );
    process.exit(1);
  }

  // Development-only JSON fallback
  console.warn(
    '\n[WARNING] MongoDB unavailable. Running in JSON fallback mode (development only).\n' +
    'Data is stored in server/data/db.json and will NOT sync to Atlas.\n' +
    'Do NOT run in JSON fallback mode in production.'
  );
  console.log('JSON fallback is active: server/data/db.json');
  if (onReady) onReady();
};

const getIsMongoConnected = () => isMongoConnected;

module.exports = {
  connectDB,
  getIsMongoConnected
};
