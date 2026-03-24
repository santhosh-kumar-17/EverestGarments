#!/usr/bin/env node

/**
 * Quick Admin Setup Script
 * This script creates an admin user directly without prompts
 * Usage: node scripts/setup-admin.js [username] [password]
 */

const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

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

async function setupAdmin() {
  try {
    console.log('\n👤 Everest Garments - Admin Setup\n');

    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Get credentials from command line or use defaults
    const username = process.argv[2] || 'admin';
    const password = process.argv[3] || 'admin123';

    // Check if admin exists
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists, deleting old one...');
      await Admin.deleteOne({ username });
    }

    // Hash password
    console.log('Creating admin user...');
    const passwordHash = await bcryptjs.hash(password, 10);

    // Create admin user
    const admin = new Admin({
      username,
      passwordHash
    });

    await admin.save();
    console.log('\n✅ Admin user created successfully!\n');
    console.log('Username:', admin.username);
    console.log('Password:', password);
    console.log('\nYou can now login at: /auth (click Admin Login)\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

setupAdmin();
