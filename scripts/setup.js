#!/usr/bin/env node

/**
 * Admin Setup Script
 * Run: node scripts/setup.js
 * 
 * This script helps generate secure credentials for your admin setup
 */

const crypto = require('crypto');
const bcryptjs = require('bcryptjs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function generateJWTSecret() {
  const secret = crypto.randomBytes(32).toString('hex');
  console.log('\n✅ JWT Secret (32 bytes):');
  console.log(secret);
  console.log('\nAdd to .env.local as: JWT_SECRET=' + secret);
  return secret;
}

async function hashPassword(password) {
  try {
    const hash = await bcryptjs.hash(password, 10);
    console.log('\n✅ Password Hash (bcryptjs):');
    console.log(hash);
    console.log('\nAdd to .env.local as: ADMIN_PASSWORD_HASH=' + hash);
    return hash;
  } catch (error) {
    console.error('Error hashing password:', error);
    return null;
  }
}

function question(prompt) {
  return new Promise(resolve => {
    rl.question(prompt, resolve);
  });
}

async function main() {
  console.log('\n🛡️  Everest Garments - Admin Setup\n');
  
  const choice = await question(
    'What would you like to do?\n1. Generate JWT Secret\n2. Hash Admin Password\n3. Both\n\nEnter choice (1-3): '
  );

  if (choice === '1' || choice === '3') {
    await generateJWTSecret();
  }

  if (choice === '2' || choice === '3') {
    const password = await question('\nEnter password to hash: ');
    if (password.length < 6) {
      console.log('❌ Password must be at least 6 characters');
    } else {
      await hashPassword(password);
    }
  }

  console.log('\n✨ Setup complete! Update your .env.local file with the credentials above.\n');
  rl.close();
}

main().catch(console.error);
