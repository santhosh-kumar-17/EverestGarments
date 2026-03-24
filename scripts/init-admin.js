#!/usr/bin/env node

/**
 * Initialize Admin User Script
 * Run from project root: node scripts/init-admin.js
 * 
 * This script creates the initial admin user in MongoDB
 */

const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Load environment variables
require('dotenv').config({ path: '.env.local' });

// Admin Schema
const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Admin = mongoose.model('Admin', adminSchema);

function question(prompt) {
  return new Promise(resolve => {
    rl.question(prompt, resolve);
  });
}

async function initializeAdmin() {
  try {
    console.log('\n👤 Everest Garments - Admin Initialization\n');

    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Check if admin exists
    const existingAdmin = await Admin.findOne({ username: process.env.ADMIN_USERNAME });
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists');
      const overwrite = await question('Do you want to overwrite? (yes/no): ');
      if (overwrite.toLowerCase() !== 'yes') {
        console.log('Cancelled. Exiting.');
        process.exit(0);
      }
      await Admin.deleteOne({ username: process.env.ADMIN_USERNAME });
    }

    // Get credentials
    const username = await question('Enter admin username (default: admin): ');
    const password = await question('Enter admin password (minimum 6 characters): ');

    if (password.length < 6) {
      console.log('❌ Password must be at least 6 characters');
      process.exit(1);
    }

    // Hash password
    console.log('\nHashing password...');
    const passwordHash = await bcryptjs.hash(password, 10);

    // Create admin user
    console.log('Creating admin user...');
    const admin = new Admin({
      username: username || 'admin',
      passwordHash
    });

    await admin.save();
    console.log('\n✅ Admin user created successfully!\n');
    console.log('Username:', admin.username);
    console.log('\nYou can now login at: /admin\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

initializeAdmin();
