const fs = require('fs');
const path = require('path');
const { initialUsers, initialIssues, initialNotifications } = require('../seedData');

const DATA_DIR = path.join(__dirname);
const DATA_FILE = path.join(DATA_DIR, 'db.json');

class LocalStore {
  constructor() {
    this.users = [];
    this.issues = [];
    this.notifications = [];
    this.isLoaded = false;
  }

  init() {
    if (this.isLoaded) return;

    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DATA_FILE)) {
      try {
        const raw = fs.readFileSync(DATA_FILE, 'utf8');
        const parsed = JSON.parse(raw);
        this.users = parsed.users || [];
        this.issues = parsed.issues || [];
        this.notifications = parsed.notifications || [];
      } catch (e) {
        console.warn('Failed parsing local db.json, reinitializing from seedData:', e.message);
        this.resetToSeed();
      }
    } else {
      this.resetToSeed();
    }

    this.isLoaded = true;
  }

  resetToSeed() {
    this.users = JSON.parse(JSON.stringify(initialUsers));
    this.issues = JSON.parse(JSON.stringify(initialIssues));
    this.notifications = JSON.parse(JSON.stringify(initialNotifications));
    this.save();
  }

  save() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(
        DATA_FILE,
        JSON.stringify(
          {
            users: this.users,
            issues: this.issues,
            notifications: this.notifications
          },
          null,
          2
        ),
        'utf8'
      );
    } catch (e) {
      console.error('Failed saving to db.json:', e.message);
    }
  }
}

const store = new LocalStore();
store.init();

module.exports = store;
